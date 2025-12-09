import { Contract } from "ethers";
import { broadcasting_network_provider } from "../../config";
import ABI from "../../../contracts/somnia/STAKER.json";

export const stakingContractAddress =
  "0xBe367d410D96E1cAeF68C0632251072CDf1b8250";
export const stakingContractABI = ABI;

export const stakingContract = new Contract(
  stakingContractAddress,
  stakingContractABI,
  broadcasting_network_provider
);

export const SOMNIA_SHANON = 50312;

export { delegateStake } from "./lib/delegateStake";
export { delegatedStakes } from "./lib/delegatedStakes";
export { getStake } from "./lib/getStake";
export { getDelegations } from "./lib/getDelegations";
export { getDelegationInfo } from "./lib/getDelegationInfo";
export { undelegateStake } from "./lib/undelegateStake";
export { claimDelegatorRewards } from "./lib/claimDelegatorRewards";
export { getInfo } from "./lib/getInfo";
export { claimAllRewards } from "./lib/claimAllRewards";
export { undelegateAll } from "./lib/undelegateAll";
export { delegateStakeToFirst } from "./lib/delegateStakeToFirst";
