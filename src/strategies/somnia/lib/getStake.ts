import { BigNumber } from "ethers";
import { stakingContract } from "..";

/**
 * Returns the staking information for a given validator
 * @param validatorAddress
 * @returns validator the validator's address
 * @returns stakedAmount the total amount staked
 * @returns accumulatedRewards the total rewards accumulated
 * @delegatedStake the total delegated stake
 */
export async function getStake({
  validatorAddress,
}: {
  validatorAddress: string;
}): Promise<{
  validator: string;
  stakedAmount: BigNumber;
  accumulatedRewards: BigNumber;
  delegatedStake: BigNumber;
}> {
  return await stakingContract.getStake(validatorAddress);
}
