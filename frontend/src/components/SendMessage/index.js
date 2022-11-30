import React, { Component } from "react";
import { ethers } from 'ethers';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class SendMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "network": '',
            "message": ''
        };
    }

    sendMessage = async () => {
        if (typeof window.ethereum !== 'undefined' && this.state.message) {
            this.props.requestAccount();
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const network = await provider.getNetwork();
            let address = network.name === 'goerli' ? this.props.ethBridgeContractAddress : this.props.bscBridgeContractAddress;
            const contract = new ethers.Contract(address, this.props.bridgeAbi, signer);
            try {
                let tx = await contract.sendMessage(this.state.message);
                await tx.wait();
            } catch (error) {
                console.log(error);
            }
        }
    };

    updateNetwork = async () => {
        if (typeof window.ethereum !== 'undefined') {
            this.props.requestAccount();
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const network = await provider.getNetwork();
            this.setState({ network: network.name });
        }
    };

    componentDidMount = () => {
        this.interval = setInterval(async () => {
            await this.updateNetwork();
        }, 2000);
    };

    componentWillUnmount = () => {
        clearInterval(this.interval);
    };

    render() {
        return (
            <div style={{padding: '20px'}}>
                <h3>Send Message to {this.state.network === 'goerli' ? "Binance": "Goerli"}</h3>
                <Form style={{textAlign: 'left'}}>
                    <Form.Group>
                        <Form.Label>Message</Form.Label>
                        <Form.Control onChange={(e) => this.setState({ message: e.target.value })}></Form.Control>
                        <Form.Text className="text-muted">
                            You are connecting to {this.state.network === 'goerli' ? "Goerli Testnet" : "Binance Testnet"}, the message will be sent to {this.state.network === 'goerli' ? "Binance Testnet": "Goerli Testnet"}.
                        </Form.Text>
                    </Form.Group>
                    <Button onClick={() => this.sendMessage()} variant="outline-dark">Send</Button>
                </Form>
            </div>
        );
    }
}

export default SendMessage;