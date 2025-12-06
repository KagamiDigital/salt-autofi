import { salt } from "..";
import { broadcasting_network_provider, signer } from "../config";
import { askForInput } from "../helpers";
import { ethers, BigNumber } from "ethers";

export let orgIndex = undefined;
export let accIndex = undefined;
export let accountAddress = undefined;

/**
 * Interactively asks user for orgIndex and accIndex.
 *
 * @returns accountAddress The public address of the chosen account
 * @returns accountId The id of the chosen account, **internal** to Salt usage only
 */
export async function chooseAccount(): Promise<{
  accountId: string;
  accountAddress: string;
}> {
  const orgs = await salt.getOrganisations();
  if (!orgIndex) {
    for (let i = 0; i < orgs.length; i++) {
      console.log(`[${i}] ${orgs[i].name}`);
    }
    orgIndex = await askForInput(
      "Please choose one of the organisations above to fetch the accounts from: "
    );
  }

  const accounts = await salt.getAccounts((orgs[orgIndex] as any)._id);
  if (!accIndex) {
    for (let i = 0; i < accounts.length; i++) {
      console.log(`[${i}] ${accounts[i].name}`);
    }

    accIndex = await askForInput(
      "Please choose one of the accounts above to send a transaction from: "
    );
  }

  const ret = accounts[accIndex];
  if (!ret) {
    throw new Error("Invalid account index");
  }
  return { accountId: ret.id, accountAddress: ret.publicKey };
}

/**
 * interactive wrapper around Salt sdk.submitTx function.
 *
 * Will interactively ask for the organisation index and account index of the
 * desired Salt MPC account (if not provided) and save this information in `orgIndex` and `accIndex`
 * respectively.
 *
 * @param value Amount of native currency to transfer (e.g. ETH on chain-id = 1)
 * @param recipient Address of the recipient
 * @param gas Amount of gas to pass with transaction, if undefined Salt will try to run a gas estimate on the transaction
 * @param data transaction data
 */
export async function sendTransaction({
  value,
  recipient,
  data,
  gas,
}: {
  value?: BigNumber;
  recipient?: string;
  data?: string;
  gas?: string;
}) {
  const { accountId } = await chooseAccount();

  value =
    value && value.gte(0)
      ? value
      : ethers.utils.parseEther(
          await askForInput(
            "Please enter the amount you wish to transfer (in ETH): "
          )
        );

  recipient =
    recipient ?? (await askForInput("Please enter the recipient's address: "));

  recipient = ethers.utils.getAddress(recipient);

  console.log(
    `Transferring ${ethers.utils.formatEther(
      value
    )} to ${recipient} with data ${data}`
  );

  // gas is handled by SDK
  const transfer = await salt.submitTx({
    accountId: accountId,
    to: recipient,
    value: ethers.utils.formatEther(value),
    chainId: broadcasting_network_provider.network.chainId,
    signer: signer,
    sendingProvider: broadcasting_network_provider,
    data: data ?? undefined,
    gas: gas ?? undefined,
  });

  // A Promise wrapper around the salt-sdk internal state machine
  await new Promise((resolve, reject) => {
    //propose
    transfer.onPropose((data) => console.log("PROPOSE :", data));
    // sign
    transfer.onSign((data) => console.log(`SIGNING:`, data));
    //combine
    transfer.onCombine((data) => console.log("COMBINE:", data));
    //broadcast
    transfer.onBroadcast((data) => console.log("BROADCAST:", data));
    //end
    transfer.onEnd((data: { receipt: { transactionHash: string } }) => {
      console.log("Broadcased transaction:", data);
      // waiting here is just a sanity check, salt-sdk should already do this internally
      if (data?.receipt?.transactionHash) {
        broadcasting_network_provider
          .waitForTransaction(data.receipt.transactionHash)
          .then(resolve);
      } else {
        resolve(
          "Transaction successful, but didn't confirm it was broadcasted"
        );
      }
    });

    // Observe Errors states

    transfer.onTransition(0, 5, (data) => {
      const err = new Error(`IDLE->END Error starting transfer`);
      console.error(err, data);
      reject(err);
    });
    transfer.onTransition(1, 5, (data) => {
      const err = new Error(`PROPOSE->END Policy breach`);
      console.error(err, data);
      reject(err);
    });
    transfer.onTransition(2, 5, (data) => {
      const err = new Error(`SIGN->END Error signing`);
      console.error(err, data);
      reject(err);
    });
    transfer.onTransition(3, 5, (data) => {
      const err = new Error(`COMBINE->END Error combining`);
      console.error(err, data);
      reject(err);
    });
  });
}

/**
 * interactive wrapper around Salt sdk.submitTx function.
 *
 * Will interactively ask for the organisation index and account index of the
 * desired Salt MPC account (if not provided) and save this information in `orgIndex` and `accIndex`
 * respectively.
 *
 * @param value Amount of native currency to transfer (e.g. ETH on chain-id = 1)
 * @param recipient Address of the recipient
 * @param gas Amount of gas to pass with transaction, if undefined Salt will try to run a gas estimate on the transaction
 * @param data transaction data
 */
export async function sendTransactionDirect({
  value,
  recipient,
  data,
  gas,
  accountId,
  timeoutSeconds = 59,
}: {
  value?: BigNumber;
  recipient?: string;
  data?: string;
  gas?: string;
  accountId?: string;
  timeoutSeconds?: number;
}) {
  value =
    value && value.gte(0)
      ? value
      : ethers.utils.parseEther(
          await askForInput(
            "Please enter the amount you wish to transfer (in ETH): "
          )
        );

  recipient =
    recipient ?? (await askForInput("Please enter the recipient's address: "));

  recipient = ethers.utils.getAddress(recipient);

  console.log(
    `Transferring ${ethers.utils.formatEther(
      value
    )} to ${recipient} with data ${data}`
  );

  // gas is handled by SDK
  const transfer = await salt.submitTx({
    accountId: accountId,
    to: recipient,
    value: ethers.utils.formatEther(value),
    chainId: broadcasting_network_provider.network.chainId,
    signer: signer,
    sendingProvider: broadcasting_network_provider,
    data: data ?? undefined,
    gas: gas ?? undefined,
  });

  // A Promise wrapper around the salt-sdk internal state machine
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(
        `The transaction is taking more than ${timeoutSeconds} seconds to complete, resolving the promise`
      );
    }, timeoutSeconds * 1000);
    //propose
    transfer.onPropose((data) => console.log("PROPOSE :", data));
    // sign
    transfer.onSign((data) => console.log(`SIGNING:`, data));
    //combine
    transfer.onCombine((data) => console.log("COMBINE:", data));
    //broadcast
    transfer.onBroadcast((data) => console.log("BROADCAST:", data));
    //end
    transfer.onEnd((data: { receipt: { transactionHash: string } }) => {
      console.log("Broadcased transaction:", data);
      // waiting here is just a sanity check, salt-sdk should already do this internally
      if (data?.receipt?.transactionHash) {
        broadcasting_network_provider
          .waitForTransaction(data.receipt.transactionHash)
          .then(resolve);
      } else {
        resolve(
          "Transaction successful, but didn't confirm it was broadcasted"
        );
      }
    });

    // Observe Errors states

    transfer.onTransition(0, 5, (data) => {
      const err = new Error(`IDLE->END Error starting transfer`);
      console.error(err, data);
      reject(err);
    });
    transfer.onTransition(1, 5, (data) => {
      const err = new Error(`PROPOSE->END Policy breach`);
      console.error(err, data);
      reject(err);
    });
    transfer.onTransition(2, 5, (data) => {
      const err = new Error(`SIGN->END Error signing`);
      console.error(err, data);
      reject(err);
    });
    transfer.onTransition(3, 5, (data) => {
      const err = new Error(`COMBINE->END Error combining`);
      console.error(err, data);
      reject(err);
    });
  });
}
