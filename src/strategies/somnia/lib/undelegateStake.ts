import { BigNumber, ethers } from "ethers";
import { stakingContract, stakingContractAddress } from "..";
import { sendTransaction } from "../../../salt/index";

/**
 * Undelegate some or all of your stake with a validator
 * Example tx: https://shannon-explorer.somnia.network/tx/0x676bd44018af5da348e5607361b316c7712bb0c0511f74a4219e7f44d170d122?tab=index
 *
 * @param validatorAddress the address of the validator
 * @amount the amount to unstake
 */
export async function undelegateStake({
  validatorAddress,
  amount,
}: {
  validatorAddress: string;
  amount: BigNumber;
}) {
  const txData = stakingContract.interface.encodeFunctionData(
    "undelegateStake(address, uint256)",
    [validatorAddress, amount]
  );

  await sendTransaction({
    value: BigNumber.from(0),
    recipient: stakingContractAddress,
    data: txData,
  });

  console.info(
    `Just unstaked ${ethers.utils.formatEther(amount)} from ${validatorAddress}`
  );
}
