import { BigNumber, ethers } from "ethers";
import { stakingContract, stakingContractAddress } from "..";
import { sendTransaction, sendTransactionDirect } from "../../../salt/index";

/**
 *
 * Stakes the supplied amount with the speciifed validator
 * Example tx: https://shannon-explorer.somnia.network/tx/0xefe52d003860d35622659ffe5f4ce4e5eee5366d0c8b7e506a3745a53849318f?tab=index
 * @params amount the amount to be staked (in unit of wei)
 * @params validatorAddress: the address of the validator
 *
 */
export async function delegateStake({
  amount,
  validatorAddress,
  accountId,
}: {
  amount: BigNumber;
  validatorAddress: string;
  accountId?: string;
}) {
  const txData = stakingContract.interface.encodeFunctionData(
    "delegateStake(address, uint256)",
    [validatorAddress, amount]
  );

  console.log(
    `Delegating ${ethers.utils.formatEther(
      amount
    )} STT to validator ${validatorAddress}`,
    txData
  );

  accountId === undefined
    ? await sendTransaction({
        value: amount,
        recipient: stakingContractAddress,
        data: txData,
      })
    : await sendTransactionDirect({
        value: amount,
        recipient: stakingContractAddress,
        data: txData,
        accountId: accountId,
      });
}
