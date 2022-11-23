require("dotenv").config();
const GOERLI_WSS = process.env.GOERLI_WSS;
const ORIGIN_CONTRACT_ADDRESS = process.env.ORIGIN_CONTRACT_ADDRESS;
const DEST_CONTRACT_ADDRESS = process.env.DEST_CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const Web3 = require('web3');
const ethers = require("ethers");
const BridgeContract = require("../artifacts/contracts/Bridge.sol/Bridge.json");

const eth_provider = new ethers.providers.WebSocketProvider(GOERLI_WSS);
const web3Bsc = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
const admin = web3Bsc.eth.accounts.wallet.add(PRIVATE_KEY);

const origin_contract = new ethers.Contract(ORIGIN_CONTRACT_ADDRESS, BridgeContract.abi, eth_provider);
const dest_contract = new web3Bsc.eth.Contract(BridgeContract.abi, DEST_CONTRACT_ADDRESS);

merkleTreeSize = 3;
messageSent = [];
merkleRoot = "";

const recordMessageSent = async (messageId, sender, message, hash, event) => {
    try {
        console.log("New message on source chain: ", JSON.stringify({ messageId, sender, message, hash}));
        messageSent.push({ messageId, sender, message, hash})
        if (messageSent.length == merkleTreeSize - 1) {
            messageSent.forEach((message, messageIndex) => {
                sendMessage(messageIndex, message.messageId, message.sender, message.message, message.hash);
            });
            messageSent = []
        }
    } catch (err) {
        console.log(err);
    }
}

const recordMerkleRoot = async (messageId, merkleTreeSize, rootHash, event) => {
    try {
        console.log("New merkleRoot: ", JSON.stringify({ messageId, merkleTreeSize, rootHash}));
        merkleRoot = rootHash
    } catch (err) {
        console.log(err);
    }
}

const sendMessage = async (messageIndex, messageId, sender, message, hash, event) => {
    try {
        console.log("Sending new message to target chain: ", JSON.stringify({ messageId, sender, message, hash}));

        console.log("Preparing for transaction...");
        const tx = dest_contract.methods.receiveMessage(messageSent, merkleRoot, messageIndex, messageId, sender, message);

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
}

console.log("Listening to SendMessage event...");
origin_contract.on("MessageSent", recordMessageSent);
origin_contract.on("MerkleRoot", recordMerkleRoot);