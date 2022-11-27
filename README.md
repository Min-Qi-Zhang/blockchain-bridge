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

ORIGIN_CONTRACT_ADDRESS = `0x837b2ccBCBD124fad4f75F5242911643572CA00A`

https://goerli.etherscan.io/address/0x837b2ccBCBD124fad4f75F5242911643572CA00A

DEST_CONTRACT_ADDRESS = `0x36b94B0B476f362dd69d9b70dA708462bE4017F7`

https://testnet.bscscan.com/address/0x36b94B0B476f362dd69d9b70dA708462bE4017F7
