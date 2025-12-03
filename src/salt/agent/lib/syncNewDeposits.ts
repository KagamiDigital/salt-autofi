import { managedAccounts, MIN_BALANCE } from "..";
import { broadcasting_network_provider } from "../../../config";
import { handleNewDeposit } from "./handleNewDeposit";

/**
 * Finds new deposits made to accounts managed by the agent
 * @returns an array of accounts for which deposits were made
 */
export const syncNewDeposits = async (): Promise<void> => {
  const accountAddresses = Object.keys(managedAccounts);

  for (let i = 0; i < accountAddresses.length; i++) {
    try {
      const balance = await broadcasting_network_provider.getBalance(
        accountAddresses[i]
      );
      if (balance.gt(MIN_BALANCE)) {
        handleNewDeposit({
          accountAddress: accountAddresses[i],
          accountId: managedAccounts[accountAddresses[i]].id,
          balance: balance,
        });
      }
    } catch (error) {
      console.error(
        `Failed to get balance for account ${accountAddresses[i]}:`,
        error
      );
    }
  }
};
