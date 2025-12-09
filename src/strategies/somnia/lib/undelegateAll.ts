import { ethers } from "ethers";
import * as somnia from "../index";

const log = console.log;

/**
 * undelegate all stakes from all validators
 * @param accountAddressthe delegator's address
 */
export async function undelegateAll({
  accountAddress,
}: {
  accountAddress: string;
}) {
  const { delegatedStake } = await somnia.delegatedStakes({
    address: accountAddress,
  });
  if (delegatedStake.isZero()) {
    log(`No need to undelegate, ${accountAddress} has nothing delegated`);
    return;
  } else {
    log(
      `Undelegating all your stake, for a total of ${ethers.utils.formatEther(
        delegatedStake
      )}`
    );
  }
  const { delegatedValidators: existingDelegations } =
    await somnia.getDelegations({
      address: accountAddress,
    });
  for (const validatorAddress of existingDelegations) {
    const amount = (
      await somnia.getDelegationInfo({
        address: accountAddress,
        validatorAddress,
      })
    ).amount;
    await somnia.undelegateStake({ validatorAddress, amount });
  }

  const { delegatedStake: totalStaked } = await somnia.delegatedStakes({
    address: accountAddress,
  });
  if (!totalStaked.isZero()) {
    throw new Error(`Failed to unstake everything from ${accountAddress}`);
  }
  log(`Unstaked everything from ${accountAddress}`);
}
