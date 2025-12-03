import { SaltAccount } from "salt-sdk";
import { parseEther } from "ethers/lib/utils";
import { BigNumber } from "ethers";

export const managedAccounts: Record<string, SaltAccount> = {};
export const deposits: Deposit[] = [];
export const MIN_BALANCE = parseEther("0.01");

export interface Deposit {
  accountAddress: string;
  accountId: string;
  balance: BigNumber;
  depositAmount: BigNumber;
}

export { syncInvitations } from "./lib/syncInvitations";
export { syncManagedAccounts } from "./lib/syncManagedAccounts";
export { syncNewDeposits } from "./lib/syncNewDeposits";
export { initializeAgent } from "./lib/initializeAgent";
export { syncSweeps } from "./lib/syncSweeps";
