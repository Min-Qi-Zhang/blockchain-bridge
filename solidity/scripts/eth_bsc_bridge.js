require("dotenv").config();
const GOERLI_WSS = process.env.GOERLI_WSS;
const ORIGIN_CONTRACT_ADDRESS = process.env.ORIGIN_CONTRACT_ADDRESS;
const DEST_CONTRACT_ADDRESS = process.env.DEST_CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const ethers = require("ethers");
const BridgeContract = require("../artifacts/contracts/Bridge.sol/Bridge.json");

const ethProvider = new ethers.providers.WebSocketProvider(GOERLI_WSS);
const bscProvider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545');
const ethWallet = new ethers.Wallet(PRIVATE_KEY, ethProvider);
const bscWallet = new ethers.Wallet(PRIVATE_KEY, bscProvider);

const originContract = new ethers.Contract(ORIGIN_CONTRACT_ADDRESS, BridgeContract.abi, ethProvider);
const destContract = new ethers.Contract(DEST_CONTRACT_ADDRESS, BridgeContract.abi, bscProvider);
const origContractWithSigner = originContract.connect(ethWallet);
const destContractWithSigner = destContract.connect(bscWallet);

let messageSentByOrig = [];
let messageSentByDest = [];
let messageBatchSize = 4;

/**
 * Record every message sent by origin
 */
const recordMessageSentByOrig = async (messageId, sender, message, messageIndex, proof, rootHash, event) => {
    try {
        console.log("New message on source chain: ", JSON.stringify({ messageId, sender, message }));
        messageSentByOrig.push({proof, rootHash, messageIndex, messageId, sender, message})
        if (messageSentByOrig.length == messageBatchSize) {
            for (let messageIndex = 0; messageIndex < messageSentByOrig.length; messageIndex++) {
                await sendMessage(destContractWithSigner, messageSentByOrig[messageIndex]);
            }
            messageSentByOrig = [];
        }
    } catch (err) {
        console.log(err);
    }
}

/**
 * Record every message sent by destination
 */
 const recordMessageSentByDest = async (messageId, sender, message, messageIndex, proof, rootHash, event) => {
    try {
        console.log("New message on dest chain: ", JSON.stringify({ messageId, sender, message }));
        messageSentByDest.push({proof, rootHash, messageIndex, messageId, sender, message})
        if (messageSentByDest.length == messageBatchSize) {
            for (let messageIndex = 0; messageIndex < messageSentByDest.length; messageIndex++) {
                await sendMessage(origContractWithSigner, messageSentByDest[messageIndex]);
            }
            messageSentByDest = [];
        }
    } catch (err) {
        console.log(err);
    }
}

const sendMessage = async (contractWithSigner, {proof, rootHash, messageIndex, messageId, sender, message}) => {
    try {
        console.log("Sending new message to target chain: ", JSON.stringify({ proof, rootHash, messageIndex, messageId, sender, message}));

        console.log("Preparing for transaction...");
        const tx = await contractWithSigner.receiveMessage(proof, rootHash, messageIndex, messageId, sender, message);
        await tx.wait();

        console.log(tx);

    } catch (err) {
        console.log(err);
    }
}

console.log("Listening to SendMessage event...");
originContract.on("MessageSent", recordMessageSentByOrig);
destContract.on("MessageSent", recordMessageSentByDest);