/**
 * https://aave.com/docs/developers/smart-contracts/wrapped-token-gateway
 */

import { ethers } from "ethers";
import { broadcasting_network_provider } from "../../config";
import WrappedTokenGatewayV3 from "../../../contracts/Protocols/Aave/abi/WrappedTokenGatewayV3.json";
import ERC20 from "../../../contracts/ERC20/abi/ERC20.json";

// https://aave.com/docs/resources/addresses - only testnet that is supported it ethereum sepolia
// https://github.com/bgd-labs/aave-address-book/blob/main/src/AaveV3ArbitrumSepolia.sol

const aETHWETHContractAddress = "0x5b071b590a59395fE4025A0Ccc1FcC931AAc1830";
const WrappedTokenGatewayV3ContractAddress =
  "0x387d311e47e80b498169e6fb51d3193167d89F7D";
export const poolContractAddress = "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951";

export const aaveContract = new ethers.Contract(
  WrappedTokenGatewayV3ContractAddress,
  WrappedTokenGatewayV3,
  broadcasting_network_provider
);

export const aaveWETHContract = new ethers.Contract(
  aETHWETHContractAddress,
  ERC20,
  broadcasting_network_provider
);

export const ETH_SEPOLIA = 11155111;

export { deposit } from "./lib/deposit";
export { approve } from "./lib/approve";
export { withdraw } from "./lib/withdraw";
