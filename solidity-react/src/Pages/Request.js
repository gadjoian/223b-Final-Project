import React from 'react';
import Web3 from 'web3'
import Form from '../Components/Form.js'
import Button from '@material-ui/core/Button';
import {ART_FACTORY_ABI, ART_FACTORY_ADDRESS } from '../config';

class Request extends React.Component {
    web3 = new Web3(Web3.givenProvider || "http://http://104.197.81.33:7454/")
    artFactory = new this.web3.eth.Contract(ART_FACTORY_ABI, ART_FACTORY_ADDRESS)
    constructor(props) {
        super(props)
        this.state = { 
            account: '', 
            input: {
            artist: '',
            artName: '',
            },
            submitted: false,
        }
    }

    onInputChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        console.info(event.target)
        this.setState ((prevState) =>({
            input: { ...prevState.input, [name]: value }
        }));
    }

    onInputSubmit = () => {
        this.artFactory.methods.owner().call().then((result) => {
            console.info(result)
        })
        console.info(this.state.input.artName, this.state.input.artist, this.state.account)
        this.artFactory.methods.requestCreate(this.state.input.artName, this.state.input.artist, this.state.account).send({from : this.state.account}).then(() => {
            this.setState({submitted: true})
        })
    }

    componentWillMount() {
        document.body.style.backgroundColor = "rgb(43,45,47)"
        this.loadBlockChainData()
    }

    async loadBlockChainData() {
        const accounts = await this.web3.eth.getAccounts()
        this.setState({ account: accounts[0]})
    }

    render () {
        console.info(this.state)
        if (this.state.submitted === false) {
            return (
                <div style={{backgroundColor:"white",
                    paddingTop: '20px',
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center"
                    }} className="container">
                    <h1>Submit a Request</h1>
                    <div style={{flexBasis: '100%', height: '0'}}/>
                    <p>By submitting a request to ArtKeeper™ you are agreeing to display your art on our online marketplace. Upon approval
                    you will be notified when members of our community make offers on your item. Once you submit a request, one of our professional
                    staff members will be in contact with you to gather the necessary documents to prove the legitimacy of your work. Once this process is complete
                    we will include your art into our block chain. Thank you for using our service!
                    </p>
                    <Form onChange={this.onInputChange} input={this.state.input}/>
                    <div style={{flexBasis: '100%', height: '0'}}/>
                    <Button style={{marginBottom:'20px'}} variant="contained" color="primary" onClick={this.onInputSubmit} disableElevation>
                        Submit
                    </Button>
                </div>
            );
        }
        else {
            return (
                <div style={{backgroundColor:"white",
                    paddingTop: '20px',
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center"
                    }} className="container">
                    <h1>Request Successfuly Submitted</h1>
                    <div style={{flexBasis: '100%', height: '0'}}/>
                    <p>Thank you for submitting a request! One of our professional staff will reach out to you shortly and verify your request.
                    </p>
                </div>
            )
        }
   }
}

export default Request;