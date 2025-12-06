import { ethers } from "ethers";
import { depositETH } from "./lib/depositETH";
import { aSOMIWSSTContract } from "./lib/tokens";

import WrappedTokenGatewayV3ABI from "../../../contracts/tokos.fi/abi/WrappedTokenGatewayV3.json";
import { broadcasting_network_provider } from "../../config";

const tokosContractAddress = "0x29edCCDB3aE8CDF0ea6077cd3E682BfA6dD53f19";
export const tokosContract = new ethers.Contract(
  tokosContractAddress,
  WrappedTokenGatewayV3ABI,
  broadcasting_network_provider
);

export { depositETH, aSOMIWSSTContract };
