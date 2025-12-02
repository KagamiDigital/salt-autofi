import { salt } from "../../../interactive";
import { broadcasting_network_provider, signer } from "../../../config";
import * as chorus_one from "./index";
import { NudgeListener, SaltAccount } from "salt-sdk";
import { printRectangle } from "../../../helpers";
import { BigNumber } from "ethers";

let nudgeListener: NudgeListener | undefined = undefined;
let managedAccounts: Record<string, SaltAccount> = {};

interface Deposit {
  accountAddress: string;
  accountId: string;
  depositAmount: BigNumber;
}

/**
 * Accept any pending invitation(s) to new Organisations
 */
const acceptPendingInvitations = async () => {
  const response = await salt.getOrganisationsInvitations();
  const invitations = response.invitations;

  console.log("invitations received", invitations);

  // accept new invitations
  for (let i = 0; i < invitations.length; i++) {
    await salt.acceptOrganisationInvitation(invitations[i]._id);
  }
};

/**
 * find accounts with the agent as one of the signers
 */
const findManagedAccounts = async () => {
  const signerAddress = await signer.getAddress();
  const organisations = await salt.getOrganisations();

  for (let i = 0; i < organisations.length; i++) {
    const orgAccounts = await salt.getAccounts(organisations[i]._id);

    orgAccounts.forEach(
      (acc) =>
        acc.publicKey !== null &&
        acc.signers.some(
          (s) => s.toLowerCase() === signerAddress.toLowerCase()
        ) &&
        (managedAccounts[acc.publicKey] = acc)
    );
  }
};

/**
 * Finds new deposits made to accounts managed by the agent
 * @returns an array of accounts for which deposits were made
 */
const findNewDeposits = async (): Promise<Deposit[]> => {
  const accountAddresses = Object.keys(managedAccounts);
  const deposits: Deposit[] = [];

  for (let i = 0; i < accountAddresses.length; i++) {
    try {
      const balance = await broadcasting_network_provider.getBalance(
        accountAddresses[i]
      );
      if (balance.gt(0)) {
        deposits.push({
          accountAddress: accountAddresses[i],
          accountId: managedAccounts[accountAddresses[i]].id,
          depositAmount: balance,
        });
      }
    } catch (error) {
      console.error(
        `Failed to get balance for account ${accountAddresses[i]}:`,
        error
      );
    }
  }

  return deposits;
};

/**
 * The strategy to be implemented by the chorus one agent
 */
const sweepNewDeposits = async () => {
  const deposits = await findNewDeposits();
  for (let i = 0; i < deposits.length; i++) {
    const isProcessingNudge = nudgeListener.getIsProcessingNudge();
    if (nudgeListener && isProcessingNudge) continue;

    nudgeListener.disableNudgeListener();
    try {
      await chorus_one.stakeDirect({
        accountAddress: deposits[i].accountAddress,
        accountId: deposits[i].accountId,
        amount: deposits[i].depositAmount,
      });
    } catch (err) {
      console.error("Funds could not be staked", err);
    } finally {
      nudgeListener.enableNudgeListener();
    }
  }
};

/**
 * Initializes the chorus-one agent.
 */
const initializeAgent = async () => {
  const publicAddress = await signer.getAddress();

  try {
    await salt.authenticate(signer);
  } catch (authError) {
    console.warn("Could not authenticate to Salt", authError);
  }

  printRectangle(
    `ASSET MANAGER ${publicAddress.toUpperCase()} CONNECTED to Salt`
  );

  await chorus_one.initStaker();
  nudgeListener = await salt.listenToAccountNudges(signer);
};

/**
 * run the chorus one staking agent's logic.
 */
const run = async () => {
  // 1. check invitations
  await acceptPendingInvitations();

  // 2. scan accounts
  await findManagedAccounts();

  //3. scanning for sweeps
  await sweepNewDeposits();
};

/**
 * runs the chorus-one agent staking logic once every 5 minutes
 */
export const chorusOneAgent = async () => {
  await initializeAgent();

  setInterval(async () => {
    await run();
  }, 5 * 60 * 1000);
};
