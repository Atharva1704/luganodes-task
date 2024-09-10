import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import depositRoutes from "./routes/deposit.js";
import 'dotenv/config';
import { depositABI } from "./abi.js";
import Web3 from "web3";

const app = express();

app.use(cors());

var web3 = new Web3(
    new Web3.providers.WebsocketProvider(
        process.env.ALCHEMY_LINK
    )
)

function setupWebSocket() {
    web3.currentProvider.on('connect', () => {
        console.log("WebSocket connected successfully.");
    });

    web3.currentProvider.on('end', (error) => {
        console.error("WebSocket connection closed.", error);
        reconnectWebSocket(); // Attempt reconnection
    });

    web3.currentProvider.on('error', (error) => {
        console.error("WebSocket error occurred.", error);
    });
}

function reconnectWebSocket() {
    console.log("Attempting to reconnect WebSocket...");
    web3.setProvider(new Web3.providers.WebsocketProvider(process.env.ALCHEMY_LINK));
    setupWebSocket();
}

setupWebSocket();



const beaconContract = process.env.BEACON_CONTRACT;
const contract = new web3.eth.Contract(depositABI, beaconContract);

web3.eth.subscribe('logs', {
    address: beaconContract
}, async (error, log) => {
    console.log("logs Subscribed");
    if (!error) {
        const event = web3.eth.abi.decodeLog(depositABI[0].inputs, log.data, log.topics);
        const block = await web3.eth.getBlock(log.blockNumber);
        const depositData = {
            blockNumber: log.blockNumber,
            blockTimestamp: block.timestamp,
            fee: event.amount,  // You may need to convert this from bytes
            hash: log.transactionHash,
            pubkey: event.pubkey
        };
        console.log(depositData);  // Replace with logic to store data in your database
    } else {
        console.error(error);
    }
});

contract.events.DepositEvent({
    fromBlock: 0
}, async (error, event) => {
    console.log("Hi");
    if (!error) {
        const block = await web3.eth.getBlock(event.blockNumber);
        const depositData = {
            blockNumber: event.blockNumber,
            blockTimestamp: block.timestamp,
            fee: event.returnValues.amount,  // You may need to convert this from bytes
            hash: event.transactionHash,
            pubkey: event.returnValues.pubkey
        };
        console.log(depositData);  // Replace with logic to store data in your database
    } else {
        console.error(error);
    }
});

// const HEARTBEAT_INTERVAL = 1000; // 30 seconds
// let isConnectionAlive = false;


// // Check if the WebSocket is still alive
// setInterval(() => {
//     if (isConnectionAlive) {
//         console.log("WebSocket is alive.");
//         isConnectionAlive = false;  // Reset flag for the next check
//     } else {
//         console.error("WebSocket might be down.");
//         console.log("Conncetion Lost");
//         reconnectWebSocket();
//     }
// }, HEARTBEAT_INTERVAL);

// Use 'data' or 'block' events to check if WebSocket is alive
web3.eth.subscribe('newBlockHeaders', (error, blockHeader) => {
    if (!error) {
        isConnectionAlive = true;  // If a block header is received, connection is alive
    }
});


// web3.eth
//     .getBalance(BeaconDepositContractAddress).then((balance) => {
//         console.log(`Balance: ${web3.utils.fromWei(balance, "ether")} ETH`);
//     })

// const contract = new web3.eth.Contract(contractABI, BeaconDepositContractAddress);



app.get("/", (req, res) => {
    res.status(200).send("hii");
});

app.use("/track", depositRoutes);

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(process.env.PORT, () => console.log(`Server running at ${process.env.PORT}.`))
    }).catch((error) => console.log(`${error} did not connect`))

// ------------------------------------------------------------------------
// import express from 'express';
// import cors from 'cors';
// import mongoose from 'mongoose';
// import depositRoutes from './routes/deposit.js';
// import 'dotenv/config';
// import Web3 from 'web3';

// const app = express();
// app.use(cors());

// const ALCHEMY_LINK = process.env.ALCHEMY_LINK;
// const beaconContract = process.env.BEACON_CONTRACT;

// const depositABI = [{
//     "anonymous": false,
//     "inputs": [
//         { "indexed": false, "internalType": "bytes", "name": "pubkey", "type": "bytes" },
//         { "indexed": false, "internalType": "bytes", "name": "withdrawal_credentials", "type": "bytes" },
//         { "indexed": false, "internalType": "bytes", "name": "amount", "type": "bytes" },
//         { "indexed": false, "internalType": "bytes", "name": "signature", "type": "bytes" },
//         { "indexed": false, "internalType": "bytes", "name": "index", "type": "bytes" }
//     ],
//     "name": "DepositEvent",
//     "type": "event"
// }];

// let web3;
// let contract;
// let logBuffer = [];
// const LOG_INTERVAL = 3000; // 3 seconds

// function initializeWeb3() {
//     web3 = new Web3(new Web3.providers.WebsocketProvider(ALCHEMY_LINK, {
//         timeout: 10000, // 10 seconds timeout
//         reconnect: {
//             auto: true,
//             delay: 5000, // Initial delay for reconnection
//             maxAttempts: 10 // Maximum reconnection attempts
//         }
//     }));
//     setupWebSocket();
//     setupSubscriptions();
// }

// function setupWebSocket() {
//     const provider = web3.currentProvider;

//     provider.on('connect', () => {
//         console.log("WebSocket connected successfully.");
//         startLogOutput(); // Start outputting logs every 3 seconds
//     });

//     provider.on('end', (error) => {
//         console.error("WebSocket connection closed.", error);
//         setTimeout(() => reconnectWebSocket(), 5000); // Wait before reconnecting
//     });

//     provider.on('error', (error) => {
//         console.error("WebSocket error occurred.", error);
//     });
// }

// function reconnectWebSocket() {
//     console.log("Attempting to reconnect WebSocket...");
//     initializeWeb3(); // Reinitialize Web3
// }

// function setupSubscriptions() {
//     // console.log();
//     if (!web3 || !beaconContract) {
//         console.error("Web3 or contract address is not initialized.");
//         return;
//     }

//     contract = new web3.eth.Contract(depositABI, beaconContract);
//     console.log("Contract initialized:", contract.options.address);

//     web3.eth.subscribe('logs', { address: beaconContract })

//     // Subscribe to logs
//     // web3.eth.subscribe('logs', { address: beaconContract })
//     //     .on('data', (log) => {
//     //         logBuffer.push({
//     //             type: 'log',
//     //             data: log
//     //         });
//     //     })
//     //     .on('error', (error) => {
//     //         console.error("Error subscribing to logs:", error);
//     //     });

//     // Subscribe to DepositEvent
//     // contract.events.DepositEvent({
//     //     fromBlock: 'latest'
//     // })
//     //     .on('data', (event) => {
//     //         logBuffer.push({
//     //             type: 'event',
//     //             data: event
//     //         });
//     //     })
//     //     .on('error', (error) => {
//     //         console.error("Error subscribing to DepositEvent:", error);
//     //     });
// }

// function startLogOutput() {
//     setInterval(() => {
//         if (logBuffer.length > 0) {
//             console.log("Buffered Logs/Events:");
//             logBuffer.forEach(entry => {
//                 console.log(`Type: ${entry.type}`);
//                 console.log(entry.data);
//             });
//             logBuffer = []; // Clear the buffer after logging
//         } else {
//             console.log("No new logs/events.");
//         }
//     }, LOG_INTERVAL);
// }

// initializeWeb3(); // Initialize Web3 and setup subscriptions

// app.get("/", (req, res) => {
//     res.status(200).send("hii");
// });

// app.use("/track", depositRoutes);

// mongoose.connect(process.env.MONGO_URL)
//     .then(() => {
//         app.listen(process.env.PORT, () => console.log(`Server running at ${process.env.PORT}.`));
//     })
//     .catch((error) => console.error("MongoDB connection error:", error));


// ------------------------------------------------------------



// import express from "express";
// import cors from "cors";
// import mongoose from "mongoose";
// import depositRoutes from "./routes/deposit.js";
// import 'dotenv/config';
// import Web3 from "web3";
// import { depositABI } from './abi.js';


// const app = express();
// app.use(cors());

// const ALCHEMY_LINK = process.env.ALCHEMY_LINK;
// const beaconContract = process.env.BEACON_CONTRACT;

// var web3 = new Web3(new Web3.providers.WebsocketProvider(ALCHEMY_LINK)
// let contract;
// let heartbeatInterval;
// let isConnectionAlive = false;

// function initializeWeb3() {
//     // web3 = new Web3(new Web3.providers.WebsocketProvider(ALCHEMY_LINK, {
//     //     timeout: 10000, // 10 seconds timeout
//     //     reconnect: {
//     //         auto: true,
//     //         delay: 5000, // Initial delay for reconnection
//     //         maxAttempts: 10 // Maximum reconnection attempts
//     //     }
//     // }));
//     setupWebSocket();
//     setupSubscriptions();
// }
// console.log(web3);

// function setupWebSocket() {
//     web3.currentProvider.on('connect', () => {
//         console.log("WebSocket connected successfully.");
//         startHeartbeat();
//     });

//     web3.currentProvider.on('end', (error) => {
//         console.error("WebSocket connection closed.", error);
//         stopHeartbeat();
//         setTimeout(() => reconnectWebSocket(), 5000); // Wait before reconnecting
//     });

//     web3.currentProvider.on('error', (error) => {
//         console.error("WebSocket error occurred.", error);
//     });
// }

// function reconnectWebSocket() {
//     console.log("Attempting to reconnect WebSocket...");
//     initializeWeb3(); // Reinitialize Web3
// }

// function setupSubscriptions() {
//     contract = new web3.eth.Contract(depositABI, beaconContract);

//     // Subscribe to logs
//     web3.eth.subscribe('logs', {
//         address: beaconContract
//     }, async (error, log) => {
//         if (!error) {
//             const event = web3.eth.abi.decodeLog(depositABI[0].inputs, log.data, log.topics);
//             const block = await web3.eth.getBlock(log.blockNumber);
//             const depositData = {
//                 blockNumber: log.blockNumber,
//                 blockTimestamp: block.timestamp,
//                 fee: web3.utils.hexToNumberString(event.amount), // Convert from bytes
//                 hash: log.transactionHash,
//                 pubkey: web3.utils.hexToBytes(event.pubkey) // Convert from bytes
//             };
//             console.log(depositData);
//         } else {
//             console.error(error);
//         }
//     });

//     // Subscribe to DepositEvent
//     contract.events.DepositEvent({
//         fromBlock: 'latest'
//     }, async (error, event) => {
//         if (!error) {
//             const block = await web3.eth.getBlock(event.blockNumber);
//             const depositData = {
//                 blockNumber: event.blockNumber,
//                 blockTimestamp: block.timestamp,
//                 fee: web3.utils.hexToNumberString(event.returnValues.amount), // Convert from bytes
//                 hash: event.transactionHash,
//                 pubkey: web3.utils.hexToBytes(event.returnValues.pubkey) // Convert from bytes
//             };
//             console.log(depositData);
//         } else {
//             console.error(error);
//         }
//     });
// }

// function startHeartbeat() {
//     heartbeatInterval = setInterval(() => {
//         if (isConnectionAlive) {
//             console.log("WebSocket is alive.");
//             isConnectionAlive = false; // Reset flag for the next check
//         } else {
//             console.error("WebSocket might be down.");
//             reconnectWebSocket();
//         }
//     }, 30000); // Check every 30 seconds
// }

// function stopHeartbeat() {
//     clearInterval(heartbeatInterval);
// }

// initializeWeb3(); // Initialize Web3 and setup subscriptions

// web3.eth.subscribe('newBlockHeaders', (error, blockHeader) => {
//     if (!error) {
//         isConnectionAlive = true; // If a block header is received, connection is alive
//     }
// });

// app.get("/", (req, res) => {
//     res.status(200).send("hii");
// });

// app.use("/track", depositRoutes);

// mongoose.connect(process.env.MONGO_URL)
//     .then(() => {
//         app.listen(process.env.PORT, () => console.log(`Server running at ${process.env.PORT}.`));
//     })
//     .catch((error) => console.log(`${error} did not connect`));


// // --------------------------------------------------