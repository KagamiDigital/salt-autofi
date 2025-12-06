import { BigNumber } from "ethers";
import { askForInput } from "../../../helpers";
import { formatEther, parseEther } from "ethers/lib/utils";
import { staker, validatorAddress } from "..";
import { sendTransaction } from "../../../salt/index";

/**
 * Stake ethereum with Chorus one validator
 * @param accountAddressthe delegator's address
 * @param amount amount of ETH to stake
 */
export async function stake({
  accountAddress,
  amount,
}: {
  accountAddress: string;
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

  await sendTransaction({
    recipient: stakeTx.to,
    value,
    data: stakeTx.data,
  });

  console.log(
    `Deposit of ${formatEther(value)} ETH from ${accountAddress} successful`
  );
}
