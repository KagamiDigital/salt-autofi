import { BigNumber } from "ethers";
import { staker, validatorAddress } from "..";
import { sendTransaction } from "../../../salt/index";

/**
 *	Facilitate an unstake request, will always request to unstake all of the withdrawable amount
 * @param accountAddress the delegator's address
 */
export async function unstakeAll({
  accountAddress,
}: {
  accountAddress: string;
}) {
  const { maxUnstake } = await staker.getStake({
    delegatorAddress: accountAddress as `0x${string}`,
    validatorAddress,
  });

  if (BigNumber.from(maxUnstake).eq(BigNumber.from(0))) {
    console.warn(
      ` ${accountAddress} has no funds not available to unstake at the moment`
    );
    return;
  }

  const { tx: unstakeTx } = await staker.buildUnstakeTx({
    delegatorAddress: accountAddress as `0x${string}`,
    validatorAddress,
    amount: maxUnstake, // Passed as string, e.g. '1' - 1 ETH
  });

  await sendTransaction({
    recipient: unstakeTx.to,
    value: BigNumber.from(0),
    data: unstakeTx.data,
  });

  console.log(`Unstake request for ${maxUnstake} ETH successful`);
}
