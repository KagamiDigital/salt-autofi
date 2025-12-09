import { ethers, Contract } from "ethers";
import { askForInput } from "../../../helpers";
import { broadcasting_network_provider } from "../../../config";
import ERC20ContractABI from "../../../../contracts/ERC20/abi/ERC20.json";
import { chooseAccount, sendTransaction } from "../../../salt";

/**
 *  Facilitates  an ERC-20 token transfer
 * @param tokenAddress address of the token
 * @param to address of the recipient
 * @param value amount of token to transfer
 */
export async function transfer(
  {
    tokenAddress,
    accountAddress,
    to,
    value,
  }: {
    tokenAddress?: string;
    accountAddress?: string;
    to?: string;
    value?: string;
  } = {
    accountAddress: undefined,
    tokenAddress: undefined,
    to: undefined,
    value: undefined,
  }
) {
  tokenAddress = tokenAddress ?? (await askForInput("Token address: "));
  accountAddress = accountAddress ?? (await chooseAccount()).accountAddress;

  const erc20Contract = new Contract(
    tokenAddress,
    ERC20ContractABI,
    broadcasting_network_provider
  );
  const decimals = Number(await erc20Contract.decimals());
  const name = await erc20Contract.name();
  console.log(`Name: ${name}`);

  const meBalance = await erc20Contract.balanceOf(accountAddress);
  console.log(
    `The account's current balance: ${ethers.utils.formatUnits(
      meBalance,
      decimals
    )}`
  );

  to = to ?? (await askForInput("Recipient address: "));
  value =
    value ??
    (await askForInput("Transfer amount (accounting for ERC decimals): "));
  const valueNum = ethers.utils.parseUnits(value, decimals);

  const data = erc20Contract.interface.encodeFunctionData(
    "transfer(address, uint256)",
    [to, valueNum]
  );

  await sendTransaction({
    value: valueNum,
    recipient: to,
    data,
  });
}
