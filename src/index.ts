import { AGENT } from "./config";
import { interactiveMode } from "./interactive";
import { chorusOneAgent } from "./salt/strategies/chorus-one";

(async () => {
  if (AGENT === "CHORUS-ONE") {
    chorusOneAgent();
  } else {
    console.info(
      `unrecognized value for AGENT: ${AGENT}, running interactive mode`
    );
    interactiveMode();
  }
})();
