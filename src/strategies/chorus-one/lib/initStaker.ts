import { staker } from "..";

/**
 * initializes the staker
 */
export async function initStaker() {
  await staker.init();
}
