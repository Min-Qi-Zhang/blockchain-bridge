import React, { Component } from "react";
import Card from 'react-bootstrap/Card';

class MessageCard extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <Card style={{ width: '10rem', margin: '5px' }}>
                <Card.Body>
                    <Card.Title>ID: {this.props.message.messageId.toNumber()}</Card.Title>
                    {this.props.message.message}
                </Card.Body>
            </Card>
        );
    }
}

export default MessageCard;