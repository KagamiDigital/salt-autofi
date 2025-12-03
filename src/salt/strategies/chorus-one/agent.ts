import { syncNewDeposits } from "../../agent";
import { syncSweeps } from "../../agent/lib/syncSweeps";
import * as chorus_one from "./index";

/**
 * run the chorus one staking agent's logic.
 */
const run = async () => {
  //1. sync for new deposits
  await syncNewDeposits();
  // sync sweeps
  await syncSweeps({ sweepFunction: chorus_one.stakeDirect });
};

/**
 * Initializes the chorus-one agent and its strategy to run periodically.
 * @param the period at which the strategy should be run at.
 */
export const startChorusOneAgent = async (period: number) => {
  // 1. initialize the staker
  await chorus_one.initStaker();
  // 2. run the strategy in an interval
  setInterval(async () => {
    await run();
  }, period);
};
