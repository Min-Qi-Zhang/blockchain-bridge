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

ORIGIN_CONTRACT_ADDRESS = `0x9b477Ab8CeF01aCdEFF06f964Eb9E3ECb6F902F1`

https://goerli.etherscan.io/address/0x233873344995F93dd637047EafE779fe401096a4

DEST_CONTRACT_ADDRESS = `0x79cD479A0Cd06A3871F008e76CAb3aE298E4D147`

https://testnet.bscscan.com/address/0xcF82Bf294cCC277cb37C4a7F1933A4a6322505ef
