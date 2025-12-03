import { AGENT } from "./config";
import { interactiveMode } from "./interactive";
import { chorusOneAgent } from "./salt/strategies/chorus-one";
import { somniaAgent } from "./salt/strategies/somnia/agent";

let period = 5 * 60 * 1000;

(async () => {
  if (AGENT === "CHORUS-ONE") {
    chorusOneAgent(period);
  } else if (AGENT === "SOMNIA") {
    somniaAgent(period);
  } else {
    console.info(
      `unrecognized value for AGENT: ${AGENT}, running interactive mode`
    );
    interactiveMode();
  }
})();
