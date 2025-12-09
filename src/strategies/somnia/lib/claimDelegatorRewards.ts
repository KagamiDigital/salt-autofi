import { BigNumber } from "ethers";
import { stakingContract, stakingContractAddress } from "..";
import { sendTransaction } from "../../../salt/index";

/**
 * claim your rewards from a validator
 * @param validatorAddress
 */
export async function claimDelegatorRewards({
  validatorAddress,
}: {
  validatorAddress: string;
}) {
  console.log(`claimDelegatorRewards(${validatorAddress})`);
  const txData = stakingContract.interface.encodeFunctionData(
    "claimDelegatorRewards(address)",
    [validatorAddress]
  );
  await sendTransaction({
    value: BigNumber.from(0),
    recipient: stakingContractAddress,
    data: txData,
  });
  console.info(`Just claimed rewards from ${validatorAddress}`);
}
