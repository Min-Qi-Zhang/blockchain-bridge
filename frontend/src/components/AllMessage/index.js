import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import { ethers } from 'ethers';

import MessageCard from "../MessageCard";
import './index.css';

class AllMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'network': '',
            'messageSent': [],
            'messageReceived': []
        };
    }

    getMessages = async () => {
        if (typeof window.ethereum !== 'undefined') {
            this.props.requestAccount();
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const network = await provider.getNetwork();
            let address = network.name === 'goerli' ? this.props.ethBridgeContractAddress : this.props.bscBridgeContractAddress;
            const contract = new ethers.Contract(address, this.props.bridgeAbi, signer);
            try {
                let sentMsg = await contract.getSentMessageBySender();
                this.setState({ messageSent: sentMsg });
                let receivedMsg = await contract.getReceivedMessageBySender();
                this.setState({ messageReceived: receivedMsg });
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
            this.setState({ network: network.name === 'goerli' ? 'Goerli' : 'Binance Testnet' });
        }
    };

    componentDidMount = () => {
        this.interval = setInterval(async () => {
            await this.updateNetwork();
            await this.getMessages();
        }, 2000);
    };

    componentWillUnmount = () => {
        clearInterval(this.interval);
    };

    render() {
        return (
            <>
                <h3>Messages Sent ({this.state.network}) </h3>
                <div className="messages">
                    {this.state.messageSent.map((msg, i) => {
                        return (
                            <MessageCard key={i} message={msg} />
                        );
                    })}
                </div>
                
                <h3>Messages Received ({this.state.network}) </h3>
                <div className="messages">
                    {this.state.messageReceived.map((msg, i) => {
                        return (
                            <MessageCard key={i} message={msg} />
                        );
                    })}
                </div>

                <Button onClick={() => this.getMessages()} variant="outline-dark">Refetch Messages</Button>
            </>
        );
    }
}

export default AllMessage;