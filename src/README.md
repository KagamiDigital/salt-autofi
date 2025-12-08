## General programming guide

[`salt-sdk`](https://npmjs.com/package/salt-sdk) is a publically available `npm`
package that you can use today!

### salt/

[`index.ts`](./salt/index.ts) provides
a higher-level API for using Salt's software interactively.

This folder should be really helpful for readers wondering how to perform basic actions like sending a transaction with the salt sdk.

### agent/

[`saltAgent.ts`](./agent/saltAgent.ts) is a class based implementation of an agent built using the salt sdk.

Agents execute strategies, such as sweeping funds from a salt account into a yield bearing protocol.

An Agent is a signer on salt account, it has just enough permissions to be able to initiate transactions for accounts it is a signer on. Therefore, one can write code similar to the one in this repository to run an agent 24/7 constantly watching your accounts for new deposits.

This folder should be really helpful for readers wondering how to build a agent on Salt, as well as the extent to which actions can be automated using the salt-sdk.

### strategies/

Every subfolder in the `/strategies` folder contains examples of how to use Salt with other protocols.

Integrating Salt with another protocol is straightforward.In the case of this repository, it mainly consists in passing the needed inputs to `sendTransaction` which takes care of the rest.

### config.ts

Reads in process.env including `process.env.PRIVATE_KEY` and exports the ethersjs networks and wallet

### interactive.ts

When run, starts a TUI.
