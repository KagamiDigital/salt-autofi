import { ethers } from "ethers";
import { broadcasting_network_provider } from "../../config";
import { stake } from "../strategies/chorus-one";

export const getBalance = async (address: string) => {
  const balance = await broadcasting_network_provider.getBalance(address);
  return balance;
};

export const sweep = async ({ accountAddress }: { accountAddress: string }) => {
  const balance = await getBalance(accountAddress);
  const threshold = ethers.utils.parseEther("0.005");
  const sweepAmount = ethers.utils.parseEther("0.002");
  if (balance.gt(threshold)) {
    await stake({
      accountAddress,
      amount: sweepAmount,
      accountId: "68b6f11adf4903ed684402d6",
    });
  } else {
    console.log(
      `not enough funds available for sweep ${ethers.utils.formatEther(
        balance
      )}`
    );
  }
};
