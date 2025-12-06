import { ethers } from "ethers";
import { broadcasting_network_provider } from "../../../config";
import * as somnia from "../index";

const log = console.log;
/**
 * claim all the rewards from all validators
 * @param address the delegator's address
 */
export async function claimAllRewards({
  accountAddress,
}: {
  accountAddress: string;
}) {
  const initialBalance = await broadcasting_network_provider.getBalance(
    accountAddress
  );

  const { delegatedValidators: delegations } = await somnia.getDelegations({
    address: accountAddress,
  });
  for (const validatorAddress of delegations) {
    const expected = (
      await somnia.getDelegationInfo({
        validatorAddress,
        address: accountAddress,
      })
    ).pendingRewards;

    if (expected.isZero()) {
      log(`Skipped claiming rewards for ${validatorAddress}`);
      continue;
    }

    const preBalance = await broadcasting_network_provider.getBalance(
      accountAddress
    );
    await somnia.claimDelegatorRewards({ validatorAddress });
    const newBalance = await broadcasting_network_provider.getBalance(
      accountAddress
    );

    const diff = newBalance.sub(preBalance);
    log(
      `Claimed ${ethers.utils.formatEther(
        diff
      )} (including gas fees) and expected ${ethers.utils.formatEther(
        expected
      )} (without gas) from ${validatorAddress}`
    );
  }

  const finalBalance = await broadcasting_network_provider.getBalance(
    accountAddress
  );
  const diff = finalBalance.sub(initialBalance);
  log(`Claimed all rewards for a total of ${ethers.utils.formatEther(diff)} `);
}
