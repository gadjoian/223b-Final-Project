import React from 'react';
import Web3 from 'web3'
import {ART_FACTORY_ABI, ART_FACTORY_ADDRESS } from '../config';
import ComplexGrid from '../Components/List.js';
import PrimarySearchAppBar from '../Components/NavBar.js'

class Transfer extends React.Component {
    web3 = new Web3(Web3.givenProvider || "http://http://104.197.81.33:8545/")
    artFactory = new this.web3.eth.Contract(ART_FACTORY_ABI, ART_FACTORY_ADDRESS)
    constructor(props) {
        super(props)
        this.state = { 
            account: '', 
            pending: '',
        }
    }

    onAccept = (value) => {
        console.info(value)
        //console.info(this.state.input.artName, this.state.input.artist, this.state.account)
        this.artFactory.methods.safeTransferFrom(this.state.account, value[1], value[0]).send({from: this.state.account}).then( () => {
            this.loadBlockChainData()
        })
    }

    componentDidMount() {
        document.body.style.backgroundColor = "rgb(43,45,47)"
        this.loadBlockChainData()
    }

    async loadBlockChainData() {
        const accounts = await this.web3.eth.getAccounts()
        this.setState({ account: accounts[0]})
        await this.artFactory.methods.owner().call().then((result) => {
            this.setState({owner: result})
        })

        let temp
        let pending = []
        const ids = await this.artFactory.methods.getArtToRequester(this.state.account).call()
        console.info(ids[1])
        for(let i = 0; i < ids[1].length; i++) {
          if(ids[1][i] !== '0x0000000000000000000000000000000000000000') {
            pending.push([ids[0][i], ids[1][i]])
          }
        }
        this.setState({pending: pending})
    }

    render () {
        return (
            <div>
                <PrimarySearchAppBar navbar={this.state.pending.length}/>
                <div style={{
                     paddingTop: '20px',
                     display: "flex",
                     flexWrap: 'wrap',
                     justifyContent: "center",
                     alignItems: "center"
                    }} className="container">
                        <ComplexGrid pending={this.state.pending} onAccept={this.onAccept} />
                </div>
            </div>
        );
   }
}

export default Transfer;