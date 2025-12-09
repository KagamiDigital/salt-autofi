import { staker, validatorAddress } from "..";

/**
 * returns the status of unstake request
 * @param accountAddress the delegator's address
 */
export async function requestStatus({
  accountAddress,
}: {
  accountAddress: string;
}) {
  const getUnstakeQueue = await staker.getUnstakeQueue({
    delegatorAddress: accountAddress as `0x${string}`,
    validatorAddress,
  });

  console.log(getUnstakeQueue);
}
