import { salt } from "../../..";
import { broadcasting_network_provider, signer } from "../../../config";

let nudgeListener = undefined;
const accounts: Record<string, any> = {};

const scanForNewInvitations = async () => {
  const response = await salt.getOrganisationsInvitations();
  const invitations = response.invitations;

  // accept new invitations
  for (let i = 0; i < invitations.length; i++) {
    await salt.acceptOrganisationInvitation(invitations[i]._id);
  }
};

const main = async () => {
  const signerAddress = await signer.getAddress();
  // 1. scan new invitations
  const response = await salt.getOrganisationsInvitations();
  const invitations = response.invitations;

  // accept new invitations
  for (let i = 0; i < invitations.length; i++) {
    await salt.acceptOrganisationInvitation(invitations[i]._id);
  }

  // 2. setup the nudge listener if
  if (!nudgeListener) nudgeListener = await salt.listenToAccountNudges(signer);

  const organisations = await salt.getOrganisations();

  for (let i = 0; i < organisations.length; i++) {
    const orgAccounts = await salt.getAccounts(organisations[i]._id);
    orgAccounts
      .filter((acc) =>
        acc.signers.some((s) => s.toLowerCase() === signerAddress)
      )
      .forEach((acc) => (accounts[acc.id] = acc));
  }

  for (let i = 0; i < Object.keys(accounts).length; i++) {
    const balance = await broadcasting_network_provider.getBalance(
      accounts[i].publicKey
    );
  }
};
