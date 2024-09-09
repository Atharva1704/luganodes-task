import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import depositRoutes from "./routes/deposit.js";
import 'dotenv/config';
import Web3 from "web3";

const app = express();

app.use(cors());

var web3 = new Web3(
    new Web3.providers.WebsocketProvider(
        process.env.ALCHEMY_LINK
    )
)
web3.currentProvider.on('connect', () => {
    console.log("WebSocket connection established successfully.");
});

web3.currentProvider.on('error', (error) => {
    console.error("WebSocket connection error:", error);
});

web3.currentProvider.on('end', (error) => {
    console.error("WebSocket connection ended:", error);
    console.log("Attempting to reconnect...");
    web3.setProvider(new Web3.providers.WebsocketProvider(process.env.ALCHEMY_LINK));
});
const BeaconDepositContractAddress = "0x00000000219ab540356cBB839Cbe05303d7705Fa";

// web3.eth
//     .getBalance(BeaconDepositContractAddress).then((balance) => {
//         console.log(`Balance: ${web3.utils.fromWei(balance, "ether")} ETH`);
//     })

// const contract = new web3.eth.Contract(contractABI, BeaconDepositContractAddress);
web3.eth.subscribe('newBlockHeaders', async (error, blockHeader) => {
    // console.log("Hi");
    if (error) {
        console.error('Error subscribing to newBlockHeaders:', error);
        return;
    }
    const blockNumber = blockHeader.number;
    const blockTransactions = await web3.eth.getBlock(blockNumber, true);

    const filteredTransactions = blockTransactions.transactions.filter(tx => {
        return tx.to === BeaconDepositContractAddress;
    });

    for (const transaction of filteredTransactions) {
        const block = await web3.eth.getBlock(blockNumber);
        const blockTimestamp = block.timestamp;
        const fee = web3.utils.toBN(transaction.gasPrice).mul(web3.utils.toBN(transaction.gasUsed));
        const hash = transaction.hash;
        const pubkey = transaction.input; // Assuming pubkey is in the input data

        console.log(blockTimestamp);
        const deposit = new Deposit({
            blockNumber,
            blockTimestamp,
            fee,
            hash,
            pubkey
        });

        const result = await deposit.save();
        console.log(`Deposit stored: ${result._id}`);
        // Store the deposit information in MongoDB

    }
});

app.get("/", (req, res) => {
    res.status(200).send("hii");
});

app.use("/track", depositRoutes);

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(process.env.PORT, () => console.log(`Server running at ${process.env.PORT}.`))
    }).catch((error) => console.log(`${error} did not connect`))
