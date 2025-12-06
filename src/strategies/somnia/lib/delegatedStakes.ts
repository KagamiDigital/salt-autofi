import { BigNumber } from "ethers";
import { stakingContract } from "..";

/**
 * Returns the total amount staked with validators
 *
 * @param address the address for which to get the total delegated stake
 * @returns delegatedStake the total delegated amount
 */
export async function delegatedStakes({
  address,
}: {
  address: string;
}): Promise<{ delegatedStake: BigNumber }> {
  return await stakingContract.delegatedStakes(address);
}
