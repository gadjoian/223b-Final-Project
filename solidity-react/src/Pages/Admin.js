import React from 'react';
import Web3 from 'web3'
import {ART_FACTORY_ABI, ART_FACTORY_ADDRESS } from '../config';
import ComplexGrid from '../Components/List.js';
import PrimarySearchAppBar from '../Components/NavBar.js'

class Admin extends React.Component {
    web3 = new Web3(Web3.givenProvider || "http://http://104.197.81.33:8545/")
    artFactory = new this.web3.eth.Contract(ART_FACTORY_ABI, ART_FACTORY_ADDRESS)
    constructor(props) {
        super(props)
        this.state = { 
            account: '', 
            input: {
            artist: '',
            artName: '',
            },
            owner: '',
            pending: '',
        }
    }

    onAccept = (value) => {
        console.info(value)
        //console.info(this.state.input.artName, this.state.input.artist, this.state.account)
        this.artFactory.methods.requestApprove(value.index).send({from: this.state.owner}).then( () => {
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
        if (this.state.owner === this.state.account) {
            temp = await this.artFactory.methods.getPendingArt().call()
            console.info(temp)
            for(let i = 0; i < temp.length; i++) {
              if (temp[i] !== '0') {
                console.info(temp[i])
                pending.push({...await this.artFactory.methods.allCoins(i).call(), index: temp[i]})
              }
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
                        <ComplexGrid pending={this.state.pending} onAccept={this.onAccept}/>   
                </div>
            </div>
        );
   }
}

export default Admin;