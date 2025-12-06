/** All validators that the delegator has delegated to */

import { stakingContract } from "..";

/**
 * Returns all the validators that the delegator has already delegated to
 * @params address the delegator's address
 * @returns validators[] the array of validators with delegations from delegator
 */
export async function getDelegations({
  address,
}: {
  address: string;
}): Promise<{ delegatedValidators: string[] }> {
  return await stakingContract.getDelegations(address);
}
