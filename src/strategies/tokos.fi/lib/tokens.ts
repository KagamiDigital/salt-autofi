import ERC20 from "../../../../contracts/ERC20/abi/ERC20.json";
import { ethers } from "ethers";
import { broadcasting_network_provider } from "../../../config";

const wSSTContractAddress = "0x4A3BC48C156384f9564Fd65A53a2f3D534D8f2b7";
export const wSSTContract = new ethers.Contract(
  wSSTContractAddress,
  ERC20,
  broadcasting_network_provider
);

const aSOMIWSSTContractAddress = "0x0A197587EE751237FfBE555568d9485e467da2A3";
export const aSOMIWSSTContract = new ethers.Contract(
  aSOMIWSSTContractAddress,
  ERC20,
  broadcasting_network_provider
);
