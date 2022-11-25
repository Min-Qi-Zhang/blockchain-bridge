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

ORIGIN_CONTRACT_ADDRESS = `0x52511503180D06F2cf18B5E67894E4eC13589c9A`

https://goerli.etherscan.io/address/0x52511503180D06F2cf18B5E67894E4eC13589c9A

DEST_CONTRACT_ADDRESS = `0xc4734cb14d6d40f1d190acA53A2c38EC335B8bD9`

https://testnet.bscscan.com/address/0xc4734cb14d6d40f1d190acA53A2c38EC335B8bD9
