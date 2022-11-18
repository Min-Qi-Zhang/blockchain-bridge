require("dotenv").config();
const GOERLI_WSS = process.env.GOERLI_WSS;
const ORIGIN_CONTRACT_ADDRESS = process.env.ORIGIN_CONTRACT_ADDRESS;
const DEST_CONTRACT_ADDRESS = process.env.DEST_CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const Web3 = require('web3');
const ethers = require("ethers");
const OriginContract = require("../artifacts/contracts/OriginContract.sol/OriginContract.json");
const DestContract = require("../artifacts/contracts/DestContract.sol/DestContract.json");

const eth_provider = new ethers.providers.WebSocketProvider(GOERLI_WSS);
const web3Bsc = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
const admin = web3Bsc.eth.accounts.wallet.add(PRIVATE_KEY);

const origin_contract = new ethers.Contract(ORIGIN_CONTRACT_ADDRESS, OriginContract.abi, eth_provider);
const dest_contract = new web3Bsc.eth.Contract(DestContract.abi, DEST_CONTRACT_ADDRESS);

console.log("Listening to UpdateMessage event...");
origin_contract.on("UpdateMessage", async (from, to, message, event) => {
    try {
        console.log("New message: ", message);
        console.log("From: ", from);
        console.log("To: ", to);

        console.log("Preparing for transaction...");
        const tx = dest_contract.methods.setMessage(message);

        const gasPrice = await web3Bsc.eth.getGasPrice();
        const gasCost = await tx.estimateGas({from: admin.address});
        console.log("gas price: ", gasPrice);
        console.log("gas cost: ", gasCost);
        
        const data = tx.encodeABI();
        console.log("data: ", data);

        const txData = {
            from: admin.address,
            to: DEST_CONTRACT_ADDRESS,
            data,
            gas: gasCost,
            gasPrice
        };

        console.log("Transaction ready to be sent");

        const receipt = await web3Bsc.eth.sendTransaction(txData);
        console.log(`Transaction hash: ${receipt.transactionHash}`);
        console.log(`
            Processed transfer:
            - from ${from}
            - to ${to}
            - message ${message}
        `);
    } catch (err) {
        console.log(err);
    }
    
});