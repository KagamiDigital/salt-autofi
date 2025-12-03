import { deposits } from "..";
import { nudgeListener } from "./initializeAgent";
import { BigNumber } from "ethers"; // or wherever BigNumber comes from

/**
 * The strategy to be implemented by the chorus one agent
 */
export const syncSweeps = async ({
  sweepFunction,
}: {
  sweepFunction: ({
    accountAddress,
    accountId,
    amount,
  }: {
    accountAddress: string;
    accountId?: string;
    amount?: BigNumber;
  }) => Promise<void>;
}) => {
  for (let i = 0; i < Math.min(3, deposits.length); i++) {
    const isProcessingNudge = nudgeListener.getIsProcessingNudge();
    if (nudgeListener && isProcessingNudge) {
      console.log("signer is currently busy");
      continue;
    }

    nudgeListener.disableNudgeListener();
    try {
      await sweepFunction({
        accountAddress: deposits[i].accountAddress,
        accountId: deposits[i].accountId,
        amount: deposits[i].depositAmount,
      });
      deposits.shift();
    } catch (err) {
      console.error("Funds could not be staked", err);
    } finally {
      nudgeListener.enableNudgeListener();
    }
  }
};
