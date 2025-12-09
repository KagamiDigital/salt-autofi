import { BigNumber, ethers } from "ethers";
import * as somnia from "../index";
import { broadcasting_network_provider } from "../../../config";
/**
 * the complete delegation report
 * @param accountAddressthe delegator's address
 * @returns balance the current balance of the delegator
 * @returns totalDelegated the total amount that was delegated so far
 * @returns totalPendingRetwards the total amount of rewards so far
 * @delegatedByValidator the amount delegated per validator
 */
export async function getInfo({
  accountAddress,
}: {
  accountAddress: string;
}): Promise<{
  balance: string;
  totalDelegated: string;
  totalPendingRewards: string;
  delegatedByValidator: {};
}> {
  const { delegatedStake } = await somnia.delegatedStakes({
    address: accountAddress,
  });

  const delegatedStakeFormatted = ethers.utils.formatEther(delegatedStake ?? 0);

  let totalPendingRewards = BigNumber.from(0);
  const { delegatedValidators: delegationsRaw } = await somnia.getDelegations({
    address: accountAddress,
  });

  const delegations = {};
  for (const validatorAddress of delegationsRaw ?? []) {
    const info = await somnia.getDelegationInfo({
      address: accountAddress,
      validatorAddress,
    });
    delegations[validatorAddress] = {
      amount: ethers.utils.formatEther(info.amount),
      pendingRewards: ethers.utils.formatEther(info.pendingRewards),
    };
    totalPendingRewards = totalPendingRewards.add(info.pendingRewards);
  }
  const balance = ethers.utils.formatEther(
    await broadcasting_network_provider.getBalance(accountAddress)
  );
  return {
    balance,
    totalDelegated: delegatedStakeFormatted,
    totalPendingRewards: ethers.utils.formatEther(totalPendingRewards),
    delegatedByValidator: delegations,
  };
}
