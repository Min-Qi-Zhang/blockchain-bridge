# blockchain-bridge

Setup:
```
cd solidity && npm i
```

Compile the contracts:
```
cd solidity && npx hardhat compile
```

Create `.env` file under `/solidity` and copy content from `env_template`, fill in the values for those variables.

Run the bridge:
```
cd solidity && node scripts/eth_bsc_bridge.js
```

ORIGIN_CONTRACT_ADDRESS = `0xFe6FfEA2C7a01BEf648bb3A7182253e6e08eBd01`

https://goerli.etherscan.io/address/0x9198560bffaBb172cf50D762059F736033471bc2

DEST_CONTRACT_ADDRESS = `0xc7Ae499185328F9A3624B8630a58055C4Ee9C25B`

https://testnet.bscscan.com/address/0xD7b8f92cE6285A1a9B23fcbdCEC8Ff889Ce8bdDa
