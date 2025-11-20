import { salt } from ".";
import { signer } from "./config";
import { printRectangle } from "./helpers";
import { sweep } from "./salt/agents/chorusOne";
import * as chorus_one from "./salt/strategies/chorus-one";

export const agentMode = async () => {
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

  setInterval(async () => {
    await sweep({
      accountAddress: "0x1BA908CD82C8Bc34F162C8A84d31A00ee300Dc5E",
    });
  }, 60000);
};
