import { managedAccounts } from "..";
import { salt } from "../../..";
import { signer } from "../../../config";

/**
 * find accounts with the agent as one of the signers
 */
export const syncManagedAccounts = async () => {
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
