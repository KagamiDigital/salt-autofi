import { AGENT, signer } from "./config";
import { interactiveMode } from "./interactive";
import * as chorus_one from "./strategies/chorus-one/index";
import * as somnia from "./strategies/somnia/index";
import * as aave from "./strategies/aave/index";
import * as hyperSwap from "./strategies/hyperliquid/index";
import { parseEther } from "ethers/lib/utils";
import { SaltAgent, Strategy } from "./agent/index";
import { Salt } from "salt-sdk";

export const salt = new Salt({ environment: "TESTNET" });

(async () => {
  if (AGENT === "CHORUS-ONE") {
    const strategy: Strategy = {
      sweepFunction: chorus_one.stakeDirect,
    };
    const agent = new SaltAgent(signer, strategy, parseEther("0.1"));
    agent.init();
  } else if (AGENT === "SOMNIA") {
    const strategy: Strategy = {
      sweepFunction: somnia.delegateStakeToFirst,
    };
    const agent = new SaltAgent(signer, strategy, parseEther("0.1"));
    agent.init();
  } else if (AGENT === "AAVE") {
    const strategy: Strategy = {
      sweepFunction: aave.deposit,
    };
    const agent = new SaltAgent(signer, strategy, parseEther("0.1"));
    agent.init();
  } else if (AGENT === "HYPERSWAP") {
    const strategy: Strategy = {
      sweepFunction: hyperSwap.swap,
    };
    const agent = new SaltAgent(signer, strategy, parseEther("0.1"));
    agent.init();
  } else {
    console.info(
      `unrecognized value for AGENT: ${AGENT}, running interactive mode`,
    );
    interactiveMode();
  }
})();
