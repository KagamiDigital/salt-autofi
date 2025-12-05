import { AGENT, signer } from "./config";
import { interactiveMode } from "./interactive";
import * as chorus_one from "./salt/strategies/chorus-one/index";
import * as somnia from "./salt/strategies/somnia/index";
import { parseEther } from "ethers/lib/utils";
import { SaltAgent, Strategy } from "./salt/agent/index";

(async () => {
  if (AGENT === "CHORUS-ONE") {
    const strategy: Strategy = {
      sweepFunction: chorus_one.stakeDirect,
    };
    const agent = new SaltAgent(signer, strategy, parseEther("0.01"));
    agent.init();
  } else if (AGENT === "SOMNIA") {
    const strategy: Strategy = {
      sweepFunction: somnia.delegateStakeToFirst,
    };
    const agent = new SaltAgent(signer, strategy, parseEther("0.01"));
    agent.init();
  } else {
    console.info(
      `unrecognized value for AGENT: ${AGENT}, running interactive mode`
    );
    interactiveMode();
  }
})();
