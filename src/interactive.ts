import { broadcasting_network_provider, signer } from "./config";
import { askForInput, networkSanityCheck, printRectangle, rl } from "./helpers";
import * as chorus_one from "./strategies/chorus-one";
import * as aave from "./strategies/aave";
import * as somnia from "./strategies/somnia";
import * as hyperliquid from "./strategies/hyperliquid";
import { chooseAccount, sendTransaction } from "./salt";
import { ethers } from "ethers";
import { formatEther, formatUnits } from "ethers/lib/utils";
import { Salt } from "salt-sdk";
import { SOMNIA_SHANON } from "./strategies/somnia";
import { transfer } from "./strategies/erc20";
import { salt } from ".";

// A basic TUI to demonstrate usage
export async function interactiveMode() {
  const publicAddress = await signer.getAddress();

  try {
    await salt.authenticate(signer);
  } catch (authError) {
    console.warn("Could not authenticate to Salt", authError);
  }

  printRectangle(
    `ASSET MANAGER ${publicAddress.toUpperCase()} CONNECTED to Salt`
  );

  let done = false;

  while (!done) {
    const input = await askForInput(
      "Do you wish to: \n [1] Make a Native Currency Transfer \n [2] Make an ERC-20 transfer  \n [3] Execute a strategy \n [4] Exit \n Please choose one of the options listed above: "
    );
    if (input === "1") {
      await sendTransaction({}).catch((error) => {
        console.error("Error:", error);
      });
    } else if (input === "2") {
      await transfer({}).catch((error) => {
        console.error("Error:", error);
      });
    } else if (input === "3") {
      const input = await askForInput(
        "Which strategy: \n [1] Chorus One Staking \n [2] Somnia Staking \n [3] Aave \n [4] HyperSwap \n [5] Exit \n Please choose one of the options listed above: "
      );

      if (input === "1") {
        // Chorous One
        const networkMatch = await networkSanityCheck(chorus_one.ETH_HOODI);
        if (!networkMatch) {
          console.error(
            `\n(Warning: Switch your orchestration network to Ethereum Hoodi (${chorus_one.ETH_HOODI}) (.env) and reload the project to use Chrorus One staking)\n`
          );
          return;
        }

        const msg = `In Chorus One Do you wish to: \n [1] Stake \n [2] Unstake \n [3] See Request status \n [4] Withdraw \n [5] Exit \n Please choose one of the options listed above: `;
        const input = await askForInput(msg);
        const { accountAddress: accountAddress } = await chooseAccount();

        await chorus_one.initStaker();

        // helpful information
        const nativeBalance = formatEther(
          await broadcasting_network_provider.getBalance(accountAddress)
        );
        const { maxUnstake, balance } = await chorus_one.getStakeInfo({
          accountAddress,
        });
        console.info(
          `Your native balance: ${nativeBalance}, your balance staked with Chorus One: ${balance}, the withdrawable amount is ${maxUnstake}`
        );

        if (input === "1") {
          await chorus_one.stake({ accountAddress }).catch((error) => {
            console.error("Error:", error);
          });
        } else if (input === "2") {
          await chorus_one.unstakeAll({ accountAddress }).catch((error) => {
            console.log("Error:", error);
          });
        } else if (input === "3") {
          await chorus_one.requestStatus({ accountAddress }).catch((error) => {
            console.log("Error:", error);
          });
        } else if (input === "4") {
          await chorus_one.withdraw({ accountAddress }).catch((error) => {
            console.log("Error:", error);
          });
        } else if (input === "5") {
          done = true;
        } else {
          console.log(`Please enter a valid choice`);
        }
      } else if (input === "2") {
        // Somnia staking
        const networkMatch = await networkSanityCheck(SOMNIA_SHANON);
        if (!networkMatch) {
          console.error(
            `\n(Warning: Switch your orchestration network to Somnia Shanon (${SOMNIA_SHANON}) (.env) and reload the project to use Somnia Staking)\n`
          );
          return;
        }
        const { accountAddress } = await chooseAccount();
        console.log(
          `Printing information about your current Somnia staking delegations`
        );
        const info = await somnia.getInfo({ accountAddress });
        console.log(
          `Your Salt wallet currently at ${accountAddress} has ${
            info.balance
          } SST, and you have delegated ${info.totalDelegated} \
SST already with ${info.totalPendingRewards} pending rewards across ${
            Object.keys(info.delegatedByValidator).length
          } different validators`,
          info.delegatedByValidator
        );

        const msg = `In Somnia staking, do you wish to: \n [1] Delegate stake \n [2] Collect rewards \n [3] Undelegate stake \n [4] Exit \n Please enter one of the options listed above: `;
        const input = await askForInput(msg);

        if (input === "1") {
          const amount = ethers.utils.parseEther(
            await askForInput("How much SST do you want to stake?: ")
          );
          await somnia
            .delegateStakeToFirst({ amount, accountAddress })
            .catch((error) => {
              console.log(`Error: `, error);
            });
        } else if (input === "2") {
          await somnia.claimAllRewards({ accountAddress }).catch((error) => {
            console.log(`Error:`, error);
          });
        } else if (input === "3") {
          const input = await askForInput(
            `Are you sure you want to undelegate all your stake? (y/N): `
          );
          if (input.toLowerCase() === "y") {
            await somnia.undelegateAll({ accountAddress }).catch((error) => {
              console.log(`Error: ${error}`);
            });
          } else {
            console.log("Undelegation cancelled");
          }
        } else if (input === "4") {
          done = true;
        } else {
          console.log(`Please enter a valid choice`);
        }
      } else if (input === "3") {
        // AAVE
        const networkMatch = await networkSanityCheck(aave.ETH_SEPOLIA);
        if (!networkMatch) {
          console.error(
            `\n(Warning: Switch your orchestration network to Ethereum Sepolia (${aave.ETH_SEPOLIA}) (.env) and reload the project to use Aave)\n`
          );
          return;
        }
        const msg = `In Aave, do you wish to \n [1] Deposit \n [2] Approve \n [3] Withdraw \n [4] Exit \n Please choose one of the options listed above: `;
        const input = await askForInput(msg);
        const { accountAddress: accountAddress } = await chooseAccount();

        // helpful information
        const nativeBalance = formatEther(
          await broadcasting_network_provider.getBalance(accountAddress)
        );
        const aaveWETHBalance = formatUnits(
          await aave.aaveWETHContract.balanceOf(accountAddress),
          await aave.aaveWETHContract.decimals()
        );
        console.info(
          `Your native balance: ${nativeBalance}, your aave WETH balance: ${aaveWETHBalance}`
        );

        if (input === "1") {
          await aave.deposit({ accountAddress }).catch((error) => {
            console.log(`Error: ${error}`);
          });
        } else if (input === "2") {
          await aave.approve({ accountAddress }).catch((error) => {
            console.log(`Error: ${error}`);
          });
        } else if (input === "3") {
          await aave.withdraw({ accountAddress }).catch((error) => {
            console.log(`Error: ${error}`);
          });
        } else if (input === "4") {
          done = true;
        } else {
          console.log(`Please enter a valid choice`);
        }
      } else if (input === "4") {
        //const input = await askForInput(msg);
        const { accountAddress: accountAddress } = await chooseAccount();

        await hyperliquid.swap({ accountAddress }).catch((error) => {
          console.log(`Error: ${error}`);
        });
      } else if (input === "5") {
        done = true;
      } else {
        console.log("Please enter a valid choice");
      }
    } else if (input === "4") {
      done = true;
    } else {
      console.log("Please enter a valid choice");
    }
  }
  rl.close();
}
