import { BigNumber } from "ethers";
import { staker, validatorAddress } from "..";
import { sendTransaction } from "../../../salt/index";

/**
 * withdraw stake from chorus one validator
 * @param accountAddress the delegator's address
 */
export async function withdraw({ accountAddress }: { accountAddress: string }) {
  const { tx: withdrawTx } = await staker.buildWithdrawTx({
    delegatorAddress: accountAddress as `0x${string}`,
    validatorAddress,
  });

  await sendTransaction({
    recipient: withdrawTx.to,
    value: BigNumber.from(0),
    data: withdrawTx.data,
  });
}
