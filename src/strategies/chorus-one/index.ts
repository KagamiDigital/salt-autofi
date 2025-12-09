import {
  EthereumStaker,
  CHORUS_ONE_ETHEREUM_VALIDATORS,
} from "@chorus-one/ethereum";

export const validatorAddress =
  CHORUS_ONE_ETHEREUM_VALIDATORS.hoodi.mevMaxVault;
export const staker = new EthereumStaker({
  network: "hoodi",
  rpcUrl: process.env.BROADCASTING_NETWORK_RPC_NODE_URL,
});

export const ETH_HOODI = 560048;

export { unstakeAll } from "./lib/unstakeAll";
export { stake } from "./lib/stake";
export { initStaker } from "./lib/initStaker";
export { getStakeInfo } from "./lib/getStakeInfo";
export { requestStatus } from "./lib/requestStatus";
export { withdraw } from "./lib/withdraw";
export { stakeDirect } from "./lib/stakeDirect";
