import { ethers } from "ethers";
import routerABI from "../../../contracts/hyperliquid/swapRouter.json";
import { broadcasting_network_provider } from "../../config";

// Router Contract Address
export const ROUTER_ADDRESS = "0xD81F56576B1FF2f3Ef18e9Cc71Adaa42516fD990";

//export const TOKEN_IN = "0x24ac48bf01fd6CB1C3836D08b3EdC70a9C4380cA"; //USDC
//export const TOKEN_OUT = "0xC003D79B8a489703b1753711E3ae9fFDFC8d1a82"; //PURR

export const TOKEN_IN = "0xadcb2f358eae6492f61a5f87eb8893d09391d160"; //HYPE
export const TOKEN_OUT = "0x24ac48bf01fd6CB1C3836D08b3EdC70a9C4380cA"; //USDC

export const routerContract = new ethers.Contract(
  ROUTER_ADDRESS,
  routerABI.abi,
  broadcasting_network_provider
);

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) public view returns (uint256)",
  "function balanceOf(address account) public view returns (uint256)",
];

export const tokenContract = new ethers.Contract(
  TOKEN_IN,
  ERC20_ABI,
  broadcasting_network_provider
);

export { swap } from "./lib/swap";
