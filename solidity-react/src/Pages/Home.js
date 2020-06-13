import React from 'react';
import Web3 from 'web3'
import SpacingGrid from '../Components/Grid.js'
import PrimarySearchAppBar from '../Components/NavBar.js'
import {ART_FACTORY_ABI, ART_FACTORY_ADDRESS } from '../config'

class Home extends React.Component {

  web3 = new Web3(Web3.givenProvider || "http://http://104.197.81.33:8545/")
  // web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/b2a5a43f39fc407984540ef62717eee9"));
  artFactory = new this.web3.eth.Contract(ART_FACTORY_ABI, ART_FACTORY_ADDRESS);

  componentDidMount() {
    document.body.style.backgroundColor = "rgb(43,45,47)"
    this.loadBlockChainData()
  }

  async loadBlockChainData() {
    console.info(Web3.givenProvider)
    const accounts = await this.web3.eth.getAccounts()
    this.setState({ account: accounts[0]})
    let art = []
    let approved = await this.artFactory.methods.getApprovedArt().call()

    await this.artFactory.methods.owner().call().then((result) => {
      this.setState({owner: result})
      console.info(result)
    })

    for(let i = 0; i < approved.length; i++) {
      if (approved[i] !== '0') {
        art.push({...await this.artFactory.methods.allCoins(approved[i]).call(), index:approved[i]})
      }
    }
    this.setState({artList: art})

    let temp = []
    let pending = []
    console.info(accounts[0])
    console.info(this.state.owner === accounts[0])
    if (this.state.owner === accounts[0]) {      
      temp = await this.artFactory.methods.getPendingArt().call()
      console.info(temp)
      for(let i = 0; i < temp.length; i++) {
        if (temp[i] !== '0') {
          pending.push(await this.artFactory.methods.allCoins(i).call())
        }
      }
    } else {
      const ids = await this.artFactory.methods.getArtToRequester(this.state.account).call()
      console.info(ids[1])
      for(let i = 0; i < ids[1].length; i++) {
        if(ids[1][i] !== '0x0000000000000000000000000000000000000000') {
          pending.push([ids[0][i], ids[1][i]])
        }
      }
    }
    this.setState({pending: pending})

  }

  onTransferClick = (value) => {
    console.info(value)
    this.artFactory.methods.requestTransfer(value.index, this.state.account).send({from: this.state.account}).then(() => {
      this.loadBlockChainData()
    })
  }

  constructor(props) {
    super(props)
    this.state = { 
      account: '', 
      artList: [],
      owner: '',
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

export default Home;
