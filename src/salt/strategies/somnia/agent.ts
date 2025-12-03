import { syncNewDeposits } from "../../agent";
import { syncSweeps } from "../../agent/lib/syncSweeps";
import * as somnia from "../somnia/index";

/**
 * run the chorus one staking agent's logic.
 */
const run = async () => {
  //1. scanning for new deposits
  await syncNewDeposits();
  //2. scanning for sweeps
  await syncSweeps({ sweepFunction: somnia.delegateStakeToFirst });
};

/**
 * Initializes the chorus-one agent and its strategy to run periodically.
 * @param the period at which the strategy should be run at.
 */
export const startSomniaAgent = async (period: number) => {
  setInterval(async () => {
    await run();
  }, period);
};
