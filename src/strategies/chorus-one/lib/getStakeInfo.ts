import { staker, validatorAddress } from "..";

/**
 * Returns staking information: the total staked balance, and the available balance for withdrawal
 * @param accountAddressthe delegator's address
 */
export async function getStakeInfo({
  accountAddress,
}: {
  accountAddress: string;
}) {
  try {
    const { maxUnstake, balance } = await staker.getStake({
      delegatorAddress: accountAddress as `0x${string}`,
      validatorAddress,
    });
    return { maxUnstake, balance };
  } catch (err) {
    return { maxUnstake: 0, balance: 0 };
  }
}
