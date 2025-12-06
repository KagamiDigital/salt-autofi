import { BigNumber } from "ethers";

export interface Deposit {
  accountAddress: string;
  accountId: string;
  balance: BigNumber;
  depositAmount: BigNumber;
}

export interface Strategy {
  sweepFunction: ({
    accountAddress,
    accountId,
    amount,
  }: {
    accountAddress: string;
    accountId?: string;
    amount?: BigNumber;
  }) => Promise<void>;
}

export type AgentState = "watching" | "sweeping" | "sleeping";
