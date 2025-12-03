import { Salt } from "salt-sdk";
import { AGENT } from "./config";
import { interactiveMode } from "./interactive";
import { startChorusOneAgent } from "./salt/strategies/chorus-one";
import { startSomniaAgent } from "./salt/strategies/somnia/agent";
import { initializeAgent } from "./salt/agent";

export const salt = new Salt({ environment: "TESTNET" });

let period = 3 * 60 * 1000;

(async () => {
  if (AGENT === "CHORUS-ONE") {
    await initializeAgent();
    startChorusOneAgent(period);
  } else if (AGENT === "SOMNIA") {
    await initializeAgent();
    startSomniaAgent(period);
  } else {
    console.info(
      `unrecognized value for AGENT: ${AGENT}, running interactive mode`
    );
    interactiveMode();
  }
})();
