import { NudgeListener } from "salt-sdk";
import { syncInvitations, syncManagedAccounts } from "..";
import { salt } from "../../..";
import { signer } from "../../../config";
import { printRectangle } from "../../../helpers";

export let nudgeListener: NudgeListener | undefined = undefined;
/**
 * Initializes generic account and invitations watching for an agent
 */
export const initializeAgent = async () => {
  const publicAddress = await signer.getAddress();

  try {
    await salt.authenticate(signer);
  } catch (authError) {
    console.warn("Could not authenticate to Salt", authError);
  }

  printRectangle(
    `ASSET MANAGER ${publicAddress.toUpperCase()} CONNECTED to Salt`
  );

  nudgeListener = await salt.listenToAccountNudges(signer);

  setInterval(async () => {
    try {
      syncInvitations();
      syncManagedAccounts();
    } catch (error) {
      console.error("error fetching API information", error);
    }
  }, 60 * 1000);
};
