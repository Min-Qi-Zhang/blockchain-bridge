# blockchain-bridge

## Bridge Setup
### Install dependencies:
```
cd solidity && npm i
```

### Compile the contracts:
```
cd solidity && npx hardhat compile
```

### Create .env file
Create `.env` file under `/solidity` and copy content from `env_template`, fill in the values for those variables.

### Run the bridge
```
cd solidity && node scripts/eth_bsc_bridge.js
```

## Frontend Setup
### Install dependencies:
```
cd frontend && npm i
```

### Add `/artifacts` to frontend. 
2 ways:
1. Copy `/solidity/artifacts` folder under to `/frontend/src/`. Or,
2. Uncomment the lines 8-10 in `/solidity/hardhat.config.js` then run the following command in `/solidity`:
```
npx hardhat compile
```
If the command line above does not work, you might want to run `npm i` in `/solidity` first.

### Start frontend
```
npm start
```
Go to `localhost:3000` to see the frontend.

Once both bridge and frontend are running, you can start sending messages using frontend.


## Addresses
ORIGIN_CONTRACT_ADDRESS = `0x7aCa572e7DE1F380261F33528825E46Cc603B85e`

https://goerli.etherscan.io/address/0x7aCa572e7DE1F380261F33528825E46Cc603B85e

DEST_CONTRACT_ADDRESS = `0xef4c597986a2241D5fED9aadcb4E33a24e2D5483`

https://testnet.bscscan.com/address/0xef4c597986a2241D5fED9aadcb4E33a24e2D5483
