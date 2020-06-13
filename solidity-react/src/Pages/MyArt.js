import React from 'react';
import Web3 from 'web3'
import SpacingGrid from '../Components/Grid.js'
import PrimarySearchAppBar from '../Components/NavBar.js'
import {ART_FACTORY_ABI, ART_FACTORY_ADDRESS } from '../config'

class MyArt extends React.Component {
  web3 = new Web3(Web3.givenProvider || "http://http://104.197.81.33:3000/")
  artFactory = new this.web3.eth.Contract(ART_FACTORY_ABI, ART_FACTORY_ADDRESS)

  componentDidMount() {
    document.body.style.backgroundColor = "rgb(43,45,47)"
    this.loadBlockChainData()
  }

  async loadBlockChainData() {
    const accounts = await this.web3.eth.getAccounts()
    this.setState({ account: accounts[0]})
    let art = []
    let pending = []
    let approved = await this.artFactory.methods.allCoinsOfOwner(this.state.account).call()

    for(let i = 0; i < approved.length; i++) {
      if (approved[i] !== '0') {
        art.push({...await this.artFactory.methods.allCoins(approved[i]).call(), index:approved[i]})
      }
    }

    const ids = await this.artFactory.methods.getArtToRequester(this.state.account).call()
    console.info(ids[1])
    for(let i = 0; i < ids[1].length; i++) {
      if(ids[1][i] !== '0x0000000000000000000000000000000000000000') {
        pending.push([ids[0][i], ids[1][i]])
      }
    }

    this.setState({artList: art})
    this.setState({pending: pending})
    
  }

  constructor(props) {
    super(props)
    this.state = { 
      account: '', 
      artList: [],
      pending: []
    }
  }

  render () {
    return (
      <div>
        <PrimarySearchAppBar navbar={this.state.pending.length}/>
        <div style={{paddingTop : '20px'}} className="container">
          <SpacingGrid artList={this.state.artList} onClick={this.onTransferClick} />
        </div>
      </div>
    );
  }
}

export default MyArt;
