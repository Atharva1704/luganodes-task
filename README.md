# luganodes-task

# Ethereum Deposit Tracker Application

This project is an Ethereum deposit tracker application using the MERN stack, Web3.js library, Alchemy API, and Telegram API. It monitors Ethereum deposits on the Beacon Chain Deposit Contract, logs relevant deposit details, and sends alerts through Telegram. 

## Tech Stack

- **Frontend**: React, Material UI
- **Backend**: Node.js, Express, MongoDB
- **Blockchain Interaction**: Web3.js, Alchemy API
- **Notifications**: Telegram API
- **Optional**: Grafana for alerts and Docker for containerization

## Features

- **Real-time Ethereum Deposit Tracking**: Monitors deposits to the Beacon Chain Deposit Contract.
- **Telegram Alerts**: Sends alerts to a specified Telegram chat for each new deposit (optional).
- **Error Handling & Logging**: Built-in mechanisms to log errors and handle issues during runtime.
- **Docker Support**: (Partial) Containerize the app for easier deployment.

## Deliverables

1. **ETH Deposit Tracker Application**: (Partially implemented)
2. **Private Repository**: Complete source code, structured and documented. ✔️
3. **Comprehensive README**: Setup, usage instructions, and examples. ✔️
4. **Error Handling & Logging**: Integrated mechanisms. ✔️
5. **Alerting System**: Telegram alerts implemented (partial).
6. **DockerFile**: Partial support for containerization. 

## Setup Instructions

### Frontend

1. Copy the code to your local machine:
    ```bash
    git clone https://github.com/Atharva1704/luganodes-task.git
    cd frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the frontend server:
    ```bash
    npm start
    ```

### Backend

1. Copy the code to your local machine:
    ```bash
    git clone https://github.com/Atharva1704/luganodes-task.git
    cd backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Configure environment variables. Create a `.env` file in the root of the backend project with the following variables:
    ```env
    PORT = "YOUR_PORT"
    MONGO_URL = "MONGO_URL"
    ALCHEMY_LINK = "ALCHEMY_WSS(WEBSOCKETS)_LINK"
    BEACON_CONTRACT = "0x00000000219ab540356cBB839Cbe05303d7705Fa"
    TELEGRAM_TOKEN = "TELEGRAM_TOKEN_USING_BOTFATHER"
    ```

4. Start the backend server:
    ```bash
    node index.js
    ```

## Docker Support (Partial)

To run the application with Docker (in progress):

1. Ensure Docker is installed on your system.
2. Build and run the container (partial Docker implementation).

## Error Handling & Logging

The application includes comprehensive error handling mechanisms. All logs and errors are recorded for troubleshooting purposes. Key events (like deposits) are also logged for reference.

## Telegram Alerts (Partial)

Telegram integration is implemented to send alerts when deposits are detected. Configure your `TELEGRAM_TOKEN` in the `.env` file.

- **Bot Setup**: Use [BotFather](https://core.telegram.org/bots#botfather) to create your bot and obtain the token.
  
## Optional Grafana Alerts (Partial)

- The alerting system with Grafana is partially integrated. Use it for real-time monitoring and alerting on deposit events.

