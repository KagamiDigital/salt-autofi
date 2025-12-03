import { parseEther } from "ethers/lib/utils";
import {
  acceptPendingInvitations,
  findManagedAccounts,
  findNewDeposits,
  initializeAgent,
  nudgeListener,
} from "../../salt";
import * as somnia from "../somnia/index";

/**
 * The strategy to be implemented by the chorus one agent
 */
const sweepNewDeposits = async () => {
  const deposits = await findNewDeposits();
  for (let i = 0; i < Math.min(5, deposits.length); i++) {
    const isProcessingNudge = nudgeListener.getIsProcessingNudge();
    if (nudgeListener && isProcessingNudge) {
      console.log("signer is currently busy");
      continue;
    }

    nudgeListener.disableNudgeListener();
    try {
      await somnia.delegateStakeToFirst({
        accountAddress: deposits[i].accountAddress,
        accountId: deposits[i].accountId,
        amount: parseEther("0.0001"), // deposits[i].depositAmount,
      });
      deposits[i].processed = true;
    } catch (err) {
      console.error("Funds could not be staked", err);
    } finally {
      nudgeListener.enableNudgeListener();
    }
  }
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
 * Initializes the chorus-one agent and its strategy to run periodically.
 * @param the period at which the strategy should be run at.
 */
export const somniaAgent = async (period: number) => {
  // 1. initialize the agent
  await initializeAgent();

  // 2. run the strategy in an interval
  setInterval(async () => {
    await run();
  }, period);
};
