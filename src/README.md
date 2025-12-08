## General programming guide

[`salt-sdk`](https://npmjs.com/package/salt-sdk) is a publically available `npm`
package that you can use today!

### src/salt

[`index.ts`](./salt/index.ts) provides
a higher-level API for using Salt's software interactively.

This folder should be really helpful for readers wondering how to perform basic actions like sending a transaction with the salt sdk.

### src/agent

[`saltAgent.ts`](./agent/saltAgent.ts) is a class based implementation of an agent built using the salt sdk.

Agents execute strategies, such as sweeping funds from a salt account into a yield bearing protocol.

An Agent is a signer on salt account, it has just enough permissions to be able to initiate transactions for accounts it is a signer on. Therefore, one can write code similar to the one in this repository to run an agent 24/7 constantly watching your accounts for new deposits.

This folder should be really helpful for readers wondering how to build a agent on Salt, as well as the extent to which actions can be automated using the salt-sdk.

### src/strategies

Every subfolder in the `/strategies` folder contains examples of how to use Salt with other protocols.

Integrating Salt with another protocol is straightforward.In the case of this repository, it mainly consists in passing the needed inputs to `sendTransaction` which takes care of the rest.

### config.ts

Reads in process.env including `process.env.PRIVATE_KEY` and exports the ethersjs networks and wallet

### interactive.ts

When run, starts a TUI.

## How to run this project

1. populate the .env file appropriately by referring to .env.sample
2. npm ci
3. npm start

NB: this repository can be ran in either agent or interactive mode. To run it in agent mode just set the AGENT environment variable to one of the valid values in .env.sample, otherwise just leave this variable empty for interactive mode.

## How to use the agent mode

If you have successfully ran the project in agent mode.

Then,

1. Go to testnet.salt.space
2. Log into the organisation of your choice (or create one).
3. Navigate to the collaborators tab and invite your agent (just enter its address in the form and submit).
4. Your agent will join the organisation in the next 60 seconds (refresh the page to see the change).
5. Start and complete a new account and invite your agent to it (your agent will join the huddle automatically).
6. Based on the strategy you are running, send at least 0.01 of the currency native to the strategy to that account
7. wait for your funds to be swept (~ 3/5 minutes)
