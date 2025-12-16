import { formatEther } from "ethers/lib/utils";
import { routerContract, tokenContract } from "..";
import { sendTransaction, sendTransactionDirect } from "../../../salt";
import { BigNumber } from "ethers";

/**
 * approve tokens for swap
 */
export async function approve({
  accountId,
  accountAddress,
  amount,
}: {
  accountId: string;
  accountAddress: string;
  amount: string;
}) {
  const data = tokenContract.interface.encodeFunctionData(
    "approve(address, uint256)",
    [routerContract.address, amount]
  );

  console.log(`approving ${formatEther(amount)} from ${accountAddress}`);

  accountId
    ? await sendTransactionDirect({
        recipient: tokenContract.address,
        value: BigNumber.from(0),
        data: data,
        accountId: accountId,
      })
    : await sendTransaction({
        recipient: tokenContract.address,
        value: BigNumber.from(0),
        data: data,
      });
}
