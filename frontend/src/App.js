import { Component } from 'react';
import Bridge from './artifacts/contracts/Bridge.sol/Bridge.json';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import AllMessage from './components/AllMessage';
import SendMessage from './components/SendMessage';

const ethBridgeContractAddress = "0x7aCa572e7DE1F380261F33528825E46Cc603B85e";
const bscBridgeContractAddress = "0xef4c597986a2241D5fED9aadcb4E33a24e2D5483";

class App extends Component {
  requestAccount = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  };

  render() {
    return (
      <div className="App">
        <SendMessage ethBridgeContractAddress={ethBridgeContractAddress} bscBridgeContractAddress={bscBridgeContractAddress} bridgeAbi={Bridge.abi} requestAccount={this.requestAccount} />
        <AllMessage ethBridgeContractAddress={ethBridgeContractAddress} bscBridgeContractAddress={bscBridgeContractAddress} bridgeAbi={Bridge.abi} requestAccount={this.requestAccount} />
      </div>
    );
  }
}

export default App;
