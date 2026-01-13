import { BigNumber } from "ethers";
import { routerContract, TOKEN_IN, TOKEN_OUT } from "..";

import { sendTransaction, sendTransactionDirect } from "../../../salt";
import { encodePath, FEE_TIERS } from "./path";

const HYPE_CONSTANT = "0xadcb2f358eae6492f61a5f87eb8893d09391d160";

/**
 * swap TOKEN_IN FOR TOKEN_OUT
 * @param accountAddress the address of the liquidity provider
 * @param amount the amount to deposit
 */
export async function swap({
  accountAddress,
  accountId,
  amount,
}: {
  accountAddress: string;
  accountId?: string;
  amount?: BigNumber;
}) {
  const path =
    TOKEN_IN.toLowerCase() === HYPE_CONSTANT.toLowerCase()
      ? encodePath([TOKEN_IN, TOKEN_OUT], [FEE_TIERS.LOWEST])
      : encodePath(
          [TOKEN_IN, HYPE_CONSTANT, TOKEN_OUT],
          [FEE_TIERS.LOWEST, FEE_TIERS.LOW]
        );

  const params =
    TOKEN_IN.toLowerCase() === HYPE_CONSTANT.toLowerCase()
      ? {
          tokenIn: TOKEN_IN,
          tokenOut: TOKEN_OUT,
          fee: FEE_TIERS.LOWEST, // 100 = 0.01%
          recipient: accountAddress,
          deadline: Math.floor(Date.now() / 1000) + 60 * 20,
          amountIn: amount,
          amountOutMinimum: BigNumber.from(1),
          sqrtPriceLimitX96: BigNumber.from(0),
        }
      : {
          path: path,
          recipient: accountAddress,
          deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from now
          amountIn: amount, // Pass BigNumber directly
          amountOutMinimum: BigNumber.from(1), // Pass BigNumber directly
        };

  const data =
    TOKEN_IN.toLowerCase() === HYPE_CONSTANT.toLowerCase()
      ? routerContract.interface.encodeFunctionData("exactInputSingle", [
          params,
        ])
      : routerContract.interface.encodeFunctionData("exactInput", [params]);

  accountId
    ? await sendTransactionDirect({
        recipient: routerContract.address,
        value:
          TOKEN_IN.toLowerCase() === HYPE_CONSTANT.toLowerCase()
            ? amount
            : BigNumber.from(0),
        data: data,
        accountId: accountId,
      })
    : await sendTransaction({
        recipient: routerContract.address,
        data: data,
        value:
          TOKEN_IN.toLowerCase() === HYPE_CONSTANT.toLowerCase()
            ? amount
            : BigNumber.from(0),
      });
}
