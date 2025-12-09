import { BigNumber } from "ethers";
import * as somnia from "../index";
import validators from "../../../../contracts/somnia/validators.json";

/**
 * delegate stake to the first available validator
 * @param accountAddress the delegator's address
 * @param amount the amount to delegate
 */
export async function delegateStakeToFirst({
  accountAddress,
  amount,
  accountId,
}: {
  accountAddress: string;
  amount: BigNumber;
  accountId?: string;
}) {
  let emptyValidator = undefined;
  for (const validatorAddress of Object.keys(validators)) {
    const info = await somnia.getDelegationInfo({
      address: accountAddress,
      validatorAddress,
    });
    if (info.amount.isZero()) {
      emptyValidator = validatorAddress;
      break;
    }
  }
  if (!emptyValidator) {
    throw new Error(`All the validators are already delegated too!`);
  }

  await somnia.delegateStake({
    amount,
    validatorAddress: emptyValidator,
    accountId: accountId,
  });
}
