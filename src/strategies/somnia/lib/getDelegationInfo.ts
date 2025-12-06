import { BigNumber } from "ethers";
import { stakingContract } from "..";

/**
 * returns the delegation information for (delegator,validator) pair
 * @param address the delegator's address
 * @param validatorAddress the address of the validator
 * @returns amount the amount delegated with the validator
 * @returns pendingRewards the pending rewards
 */
export async function getDelegationInfo({
  address,
  validatorAddress,
}: {
  address: string;
  validatorAddress: string;
}): Promise<{ amount: BigNumber; pendingRewards: BigNumber }> {
  return await stakingContract.getDelegationInfo(address, validatorAddress);
}
