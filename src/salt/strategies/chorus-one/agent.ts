import { formatEther } from "ethers/lib/utils";
import { salt } from "../../..";
import { broadcasting_network_provider, signer } from "../../../config";
import * as chorus_one from "./index";
import { NudgeListener, SaltAccount } from "salt-sdk";

let nudgeListener: NudgeListener | undefined = undefined;
let isListenerEnabled = false;
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
      .forEach((acc) => accounts.push(acc));
  }
};

const scanAccountsForSweeps = async () => {
  for (let i = 0; i < accounts.length; i++) {
    const balance = await broadcasting_network_provider.getBalance(
      accounts[i].publicKey
    );
    if (formatEther(balance) > "0.001") {
      await chorus_one.stake({
        accountAddress: accounts[i].publicKey,
      });
    }
  }
};

const startNudgeListener = async () => {
  if (!nudgeListener) {
    isListenerEnabled = true;
    nudgeListener = await salt.listenToAccountNudges(signer);
  } else {
    isListenerEnabled = true;
    nudgeListener.enableNudgeListener();
  }
};

const main = async () => {
  await startNudgeListener();
};

const interval = async () => {
  // 1. check invitations
  await scanInvitationsAndAccept();

  //2
};
