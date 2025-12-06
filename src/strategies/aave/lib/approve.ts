import { formatEther } from "ethers/lib/utils";
import { aaveContract, aaveWETHContract } from "..";
import { sendTransaction } from "../../../salt";
import { BigNumber } from "ethers";

/**
 * approve LP tokens for withdrawal
 * @param accountAddress the address of the liquidity provider
 */
export async function approve({ accountAddress }: { accountAddress: string }) {
  const balance = await aaveWETHContract.balanceOf(accountAddress);
  const data = aaveWETHContract.interface.encodeFunctionData(
    "approve(address, uint256)",
    [aaveContract.address, balance]
  );

  console.log(
    `approving ${formatEther(balance)} aave WETH from ${accountAddress}`
  );

  await sendTransaction({
    recipient: aaveWETHContract.address,
    value: BigNumber.from(0),
    data: data,
  });
}
