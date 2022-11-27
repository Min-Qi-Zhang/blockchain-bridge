require("dotenv").config();
const GOERLI_WSS = process.env.GOERLI_WSS;
const ORIGIN_CONTRACT_ADDRESS = process.env.ORIGIN_CONTRACT_ADDRESS;
const DEST_CONTRACT_ADDRESS = process.env.DEST_CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const ethers = require("ethers");
const BridgeContract = require("../artifacts/contracts/Bridge.sol/Bridge.json");

const ethProvider = new ethers.providers.WebSocketProvider(GOERLI_WSS);
const bscProvider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545');
const wallet = new ethers.Wallet(PRIVATE_KEY, bscProvider);

const originContract = new ethers.Contract(ORIGIN_CONTRACT_ADDRESS, BridgeContract.abi, ethProvider);
const destContract = new ethers.Contract(DEST_CONTRACT_ADDRESS, BridgeContract.abi, bscProvider);
const destContractWithSigner = destContract.connect(wallet);

messageSent = []
messageBatchSize = 4
/**
 * Record every message sent
 */
const recordMessageSent = async (messageId, sender, message, messageIndex, proof, rootHash, event) => {
    try {
        console.log("New message on source chain: ", JSON.stringify({ messageId, sender, message }));
        messageSent.push({proof, rootHash, messageIndex, messageId, sender, message})
        if (messageSent.length == messageBatchSize) {
            for (let messageIndex = 0; messageIndex < messageSent.length; messageIndex++) {
                await sendMessage(messageSent[messageIndex]);
            }
            messageSent = []
        }
    } catch (err) {
        console.log(err);
    }
}

const sendMessage = async ({proof, rootHash, messageIndex, messageId, sender, message}) => {
    try {
        console.log("Sending new message to target chain: ", JSON.stringify({ proof, rootHash, messageIndex, messageId, sender, message}));

        console.log("Preparing for transaction...");
        const tx = await destContractWithSigner.receiveMessage(proof, rootHash, messageIndex, messageId, sender, message);
        await tx.wait();

        console.log(tx);

    } catch (err) {
        console.log(err);
    }
}

console.log("Listening to SendMessage event...");
originContract.on("MessageSent", recordMessageSent);