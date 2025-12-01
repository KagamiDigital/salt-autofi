import { formatEther } from "ethers/lib/utils";
import { salt } from "../../..";
import { broadcasting_network_provider, signer } from "../../../config";
import * as chorus_one from "./index";

let nudgeListener = undefined;
const accounts: Record<string, any> = {};

const scanInvitationsAndAccept = async () => {
  const response = await salt.getOrganisationsInvitations();
  const invitations = response.invitations;

  // accept new invitations
  for (let i = 0; i < invitations.length; i++) {
    await salt.acceptOrganisationInvitation(invitations[i]._id);
  }
};

const scanAccountsForSweeps = async () => {
  const accountAddresses = Object.keys(accounts);
  for (let i = 0; i < accountAddresses.length; i++) {
    const balance = await broadcasting_network_provider.getBalance(
      accounts[i].publicKey
    );
    if (formatEther(balance) > "0.001") {
      await chorus_one.stake({
        accountAddress: accountAddresses[i],
      });
    }
  }
};

const main = async () => {
  const signerAddress = await signer.getAddress();
  // 1. scan for invitations
  await scanInvitationsAndAccept();

  // 2. setup the nudge listener if
  if (!nudgeListener) nudgeListener = await salt.listenToAccountNudges(signer);

  const organisations = await salt.getOrganisations();

  for (let i = 0; i < organisations.length; i++) {
    const orgAccounts = await salt.getAccounts(organisations[i]._id);
    orgAccounts
      .filter((acc) =>
        acc.signers.some((s) => s.toLowerCase() === signerAddress)
      )
      .forEach((acc) => (accounts[acc.publicKey] = acc));
  }

  const setInterval(async () => {
    await scanAccountsForSweeps();
  }, 3 * 60000);
};
