import { formatEther } from "ethers/lib/utils";
import { salt } from "../../..";
import { broadcasting_network_provider, signer } from "../../../config";
import * as chorus_one from "./index";
import { NudgeListener, SaltAccount } from "salt-sdk";

let nudgeListener: NudgeListener | undefined = undefined;
let managedAccounts: Record<string, SaltAccount> = {};

const scanInvitationsAndAccept = async () => {
  const response = await salt.getOrganisationsInvitations();
  const invitations = response.invitations;

  // accept new invitations
  for (let i = 0; i < invitations.length; i++) {
    await salt.acceptOrganisationInvitation(invitations[i]._id);
  }
};

const scanNewManagedAccounts = async () => {
  const signerAddress = await signer.getAddress();
  const organisations = await salt.getOrganisations();

  for (let i = 0; i < organisations.length; i++) {
    const orgAccounts = await salt.getAccounts(organisations[i]._id);
    orgAccounts
      .filter((acc) =>
        acc.signers.some((s) => s.toLowerCase() === signerAddress.toLowerCase())
      )
      .forEach(
        (acc) =>
          !managedAccounts[acc.publicKey] &&
          (managedAccounts[acc.publicKey] = acc)
      );
  }
};

const scanAccountsForSweeps = async () => {
  const accountAddresses = Object.keys(managedAccounts);
  for (let i = 0; i < accountAddresses.length; i++) {
    const balance = await broadcasting_network_provider.getBalance(
      accountAddresses[i]
    );
    if (formatEther(balance) > "25") {
      await chorus_one.stake({
        accountAddress: accountAddresses[i],
        amount: balance,
      });
    } else {
      console.log("Insuccient balance to sweep", balance);
    }
  }
};

export const setup = async () => {
  nudgeListener = await salt.listenToAccountNudges(signer);
};

export const intervalWork = async () => {
  // 1. check invitations
  await scanInvitationsAndAccept();

  // 2. scan accounts
  await scanNewManagedAccounts();

  if (!nudgeListener) {
    await scanAccountsForSweeps();
  } else {
    if (!nudgeListener.getIsProcessingNudge()) {
      // disable nudge responses
      nudgeListener.disableNudgeListener();
      // do sweep work
      await scanAccountsForSweeps();
      // enable nudgeListener again
      nudgeListener.enableNudgeListener();
    }
  }
};
