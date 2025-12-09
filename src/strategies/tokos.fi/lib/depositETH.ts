import { BigNumber } from "ethers";
import { sendTransaction } from "../../../salt";
import { formatEther } from "ethers/lib/utils";
import { tokosContract } from "..";

/**
 * Deposit native SST tokens to get aSOMIWSST tokens from the tokos pool
 *
 * Example tx: https://shannon-explorer.somnia.network/tx/0x7cf04ed6721e5e83fe08b15d328cfffa30a5b50bb83a559bb232467dfb093cc7
 */
export async function depositETH({
  me,
  amount,
}: {
  me: string;
  amount: BigNumber;
}) {
  console.log(`depositETH({ me: ${me}, amount: ${formatEther(amount)})`);

  const poolAddress = "0x7Cb9df1bc191B16BeFF9fdEC2cd1ef91Cac18176";
  const data = tokosContract.interface.encodeFunctionData(
    "depositETH(address arg0, address onBehalfOf, uint16 referralCode)",
    [poolAddress, me, 0]
  );

  await sendTransaction({
    recipient: tokosContract.address,
    data: data,
    value: amount,
  });
}
