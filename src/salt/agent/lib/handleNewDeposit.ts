import { BigNumber } from "ethers";
import { Deposit, deposits, MIN_BALANCE } from "..";

/**
 *
 * @param param0
 */
export function handleNewDeposit({
  accountAddress,
  accountId,
  balance,
}: {
  accountAddress: string;
  accountId: string;
  balance: BigNumber;
}): void {
  const idx = deposits.findIndex((d) => d.accountId === accountId);
  if (idx !== -1) {
    deposits[idx].balance = balance;
    deposits[idx].depositAmount = balance.sub(MIN_BALANCE);
  } else {
    const deposit: Deposit = {
      accountAddress: accountAddress,
      accountId: accountId,
      balance: balance,
      depositAmount: balance.sub(MIN_BALANCE),
    };
    deposits.push(deposit);
    console.log(deposits);
  }
}
