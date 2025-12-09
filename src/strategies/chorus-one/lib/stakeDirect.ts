import { BigNumber } from "ethers";
import { askForInput } from "../../../helpers";
import { formatEther, parseEther } from "ethers/lib/utils";
import { staker, validatorAddress } from "..";
import { sendTransactionDirect } from "../../../salt/index";

/**
 * Stake ethereum with Chorus one validator
 * @param accountAddress the delegator's address
 * @param accountId the delegator's accountId
 * @param amount amount of ETH to stake
 */
export async function stakeDirect({
  accountAddress,
  accountId,
  amount,
}: {
  accountAddress: string;
  accountId: string;
  amount?: BigNumber;
}) {
  const value =
    amount ?? parseEther(await askForInput("Deposit amount (ETH): "));

  console.log(`Depositing ${formatEther(value)} ETH from ${accountAddress}`);

  const { tx: stakeTx } = await staker.buildStakeTx({
    delegatorAddress: accountAddress as `0x${string}`,
    validatorAddress,
    amount: value.toString(), // Passed as string, e.g. '1' - 1 ETH
  });

  await sendTransactionDirect({
    recipient: stakeTx.to,
    accountId: accountId,
    value,
    data: stakeTx.data,
  });
}
