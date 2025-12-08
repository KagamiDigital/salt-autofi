# Salt-Autofi Repository

## Introduction

salt-autofi is a starter pack for asset managers and enthusiasts.
By using our software, you can propose transactions to Salt accounts where you are an authorized signer.
Instructions are for testnet access (testnet.salt.space). Production (app.salt.space) access is available on request.

## Pre-requisites

### Technical pre-requisites

Node.js is a required dependency to be able to install and run salt-autofi. [Install Node.js](https://nodejs.org/en/download/package-manager).

### Other pre-requisites

1. A completely set up organisation on [testnet.salt.space](https://testnet.salt.space) with a funded account.
2. One of the account's signers private key (add private key in .env file).

## Set up the project

1. clone the repo to your local machine
2. npm install
3. rename .env.sample to .env and set the private key variable to the private key of the account you want to manage assets from. You must be a signer on this account.
4. set BROADCASTING_NETWORK_RPC_NODE_URL, and BROADCASTING_NETWORK_ID to the broadcasting network of your choice from the [supported networks list](#supported-broadcasting-networks) below.

## Run the project

1. Populate the .env file appropriately by referring to .env.sample
2. npm ci
3. npm start

NB: This repository can be ran in either agent or interactive mode. To run it in agent mode just set the AGENT environment variable to one of the valid values in .env.sample, otherwise just leave this variable empty for interactive mode.

## Use an Agent

If you have successfully ran the project in agent mode.

Then,

1. Go to testnet.salt.space
2. Log into the organisation of your choice (or create one).
3. Navigate to the collaborators tab and invite your agent (just enter its address in the form and submit).
4. Your agent will join the organisation in the next 60 seconds (refresh the page to see the change).
5. Start and complete a new account and invite your agent to it (your agent will join the huddle automatically).
6. Based on the strategy you are running, send at least 0.01 of the currency native to the strategy to that account
7. Wait for your funds to be swept (~ 3/5 minutes)

## ORCHESTRATION VS BROADCASTING (please read)

You might have seen the terms "orchestration network" or "broadcasting network" being thrown around in this doc, below is the explanation:

### Orchestration Network

Salt's software is built on top of an dMPC protocol, due to the protocol's decentralized nature, account signers need to coordinate their actions together.
Thus, the need for a storage layer to act as an intermediary between the different signers. In the case of Salt the intermediary is a smart contract, it "orchestrates" signing activities for an account.

Orchestration smart contracts (1 per account) live on Arbitrum Sepolia (in production contracts live on Arbitrum One however these instructions relate to testnet).

### Broadcasting Network

The broadcasting network simply refers to the network on which you wish to execute the transaction.

## Supported Broadcasting Networks

As of now Salt supports the following networks to broadcast transactions:

- Ethereum Sepolia
- Base Sepolia
- Moonbase Alpha
- Polygon Amoy
- Somnia Shannon
- HyperEVM Testnet

## Important Considerations

The orchestration network cannot be changed. Salt uses Arbitrum Sepolia for testnet account orchestration (in production contracts live on Arbitrum One however these instructions relate to testnet).

The RPC nodes supplied by default in the .env.sample file are free nodes. The repository has been tested using these nodes. You may want to switch to paid nodes to improve your experience.

If you wish to broadcast on a test EVM network that is not supported in the list, please contact the Salt team on [Discord](https://discord.gg/UhDUBW9ymM).

## Notes

This repository is meant to serve as a starter pack for testing purposes, we encourage you to try the code, improve it, and propose changes.
Production access is available on request.
