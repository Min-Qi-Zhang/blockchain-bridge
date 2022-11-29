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

ORIGIN_CONTRACT_ADDRESS = `0x828143b0Fa95204b9E7EFd956fdA85de054C3DB0`

https://goerli.etherscan.io/address/0x0x828143b0Fa95204b9E7EFd956fdA85de054C3DB0

DEST_CONTRACT_ADDRESS = `0x5c866850131346c878183d938572950dBB2d193B`

https://testnet.bscscan.com/address/0x5c866850131346c878183d938572950dBB2d193B
