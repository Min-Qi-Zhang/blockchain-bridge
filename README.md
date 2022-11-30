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

ORIGIN_CONTRACT_ADDRESS = `0x7aCa572e7DE1F380261F33528825E46Cc603B85e`

https://goerli.etherscan.io/address/0x7aCa572e7DE1F380261F33528825E46Cc603B85e

DEST_CONTRACT_ADDRESS = `0xef4c597986a2241D5fED9aadcb4E33a24e2D5483`

https://testnet.bscscan.com/address/0xef4c597986a2241D5fED9aadcb4E33a24e2D5483
