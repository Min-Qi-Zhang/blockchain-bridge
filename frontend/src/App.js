import { Component } from 'react';
import Bridge from './artifacts/contracts/Bridge.sol/Bridge.json';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import AllMessage from './components/AllMessage';

const ethBridgeContractAddress = "0x828143b0Fa95204b9E7EFd956fdA85de054C3DB0";
const bscBridgeContractAddress = "0x5c866850131346c878183d938572950dBB2d193B";

class App extends Component {
  requestAccount = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  };

  render() {
    return (
      <div className="App">
        <AllMessage ethBridgeContractAddress={ethBridgeContractAddress} bscBridgeContractAddress={bscBridgeContractAddress} bridgeAbi={Bridge.abi} requestAccount={this.requestAccount} />
      </div>
    );
  }
}

export default App;
