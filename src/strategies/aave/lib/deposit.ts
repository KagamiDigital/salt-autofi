import { BigNumber } from "ethers";
import { aaveContract, poolContractAddress } from "..";
import { formatEther, parseEther } from "ethers/lib/utils";
import { askForInput } from "../../../helpers";
import { sendTransaction, sendTransactionDirect } from "../../../salt";

/**
 * deposit into an Aave liquidity pool
 * @param accountAddress the address of the liquidity provider
 * @param amount the amount to deposit
 */
export async function deposit({
  accountAddress,
  amount,
  accountId,
}: {
  accountAddress: string;
  amount?: BigNumber;
  accountId?: string;
}) {
  console.log(poolContractAddress, accountAddress);
  const data = aaveContract.interface.encodeFunctionData("depositETH", [
    poolContractAddress,
    accountAddress,
    0,
  ]);

  const value =
    amount ?? parseEther(await askForInput("Deposit amount (ETH): "));

  console.log(`Depositing ${formatEther(value)} ETH from ${accountAddress}`);

  accountId
    ? await sendTransactionDirect({
        recipient: aaveContract.address,
        value: value,
        data: data,
        accountId: accountId,
      })
    : await sendTransaction({
        recipient: aaveContract.address,
        value,
        data,
      });
}
