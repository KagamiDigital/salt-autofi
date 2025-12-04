import { Salt } from "salt-sdk";
import { agentMode } from "./agent";
import { interactiveMode } from "./interactive";

export const salt = new Salt({ environment: "MAINNET" });

(() => agentMode())();
