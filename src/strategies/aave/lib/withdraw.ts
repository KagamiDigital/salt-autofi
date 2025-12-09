import { formatEther } from "ethers/lib/utils";
import { aaveContract, aaveWETHContract, poolContractAddress } from "..";
import { sendTransaction } from "../../../salt";
import { BigNumber } from "ethers";

/**
 * Withdraw for equivalent of all approved LP tokens
 * @param accountAddress the address of the liquidity provider
 */
export async function withdraw({ accountAddress }: { accountAddress: string }) {
  const balance = await aaveWETHContract.balanceOf(accountAddress);

  const data = aaveContract.interface.encodeFunctionData(
    "withdrawETH(address, uint256 amount, address to)",
    [poolContractAddress, balance, accountAddress]
  );

  console.log(
    `withdrawing ${formatEther(balance)} aave WETH from ${accountAddress}`
  );
  await sendTransaction({
    value: BigNumber.from(0),
    recipient: aaveContract.address,
    data,
  });
}
