import { salt } from "../../..";

/**
 * Accept any pending invitation(s) to new Organisations
 */
export const syncInvitations = async () => {
  const response = await salt.getOrganisationsInvitations();
  const invitations = response.invitations;

  console.log("new invitations received", invitations);

  // accept new invitations
  for (let i = 0; i < invitations.length; i++) {
    await salt.acceptOrganisationInvitation(invitations[i]._id);
  }
};
