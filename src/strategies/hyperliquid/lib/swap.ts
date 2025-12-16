import { BigNumber, ethers } from "ethers";
import { routerContract, TOKEN_IN, TOKEN_OUT, tokenContract } from "..";
import { approve } from "./approve";
import { sendTransaction, sendTransactionDirect } from "../../../salt";
import { encodePath, FEE_TIERS } from "./path";
import { broadcasting_network_provider } from "../../../config";
import { formatEther, parseEther } from "ethers/lib/utils";

const HYPE_CONSTANT = "0xadcb2f358eae6492f61a5f87eb8893d09391d160";

/**
 * swap TOKEN_IN FOR TOKEN_OUT
 * @param accountAddress the address of the liquidity provider
 * @param amount the amount to deposit
 */
export async function swap({
  accountAddress,
  accountId,
}: {
  accountAddress: string;
  accountId?: string;
}) {
  let balance = undefined;
  if (TOKEN_IN.toLowerCase() === HYPE_CONSTANT.toLowerCase()) {
    balance = await broadcasting_network_provider.getBalance(TOKEN_IN);
    balance = parseEther("0.001");
  } else {
    // Check tokenIn balance
    balance = await tokenContract.balanceOf(accountAddress);
    balance = BigNumber.from(balance);

    console.log(`TokenIn Balance: ${balance.toString()}`);

    // Check tokenIn allowance
    const allowance = await tokenContract.allowance(
      accountAddress,
      routerContract.address
    );
    console.log(`TokenIn Allowance:`, allowance.toString());

    if (allowance.lt(balance)) {
      console.log(`Approving TokenIn for Router...`);

      await approve({ accountId, accountAddress, amount: balance });

      console.log(`TokenIn approved successfully.`);
    } else {
      console.log(`Sufficient TokenIn allowance already exists.`);
    }
  }

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
          amountIn: balance,
          amountOutMinimum: BigNumber.from(1),
          sqrtPriceLimitX96: BigNumber.from(0),
        }
      : {
          path: path,
          recipient: accountAddress,
          deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from now
          amountIn: balance, // Pass BigNumber directly
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
            ? balance
            : BigNumber.from(0),
        data: data,
        accountId: accountId,
      })
    : await sendTransaction({
        recipient: routerContract.address,
        data: data,
        value:
          TOKEN_IN.toLowerCase() === HYPE_CONSTANT.toLowerCase()
            ? balance
            : BigNumber.from(0),
      });
}
