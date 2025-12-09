import * as dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

export const orchestration_network_provider =
  new ethers.providers.StaticJsonRpcProvider({
    url: process.env.ORCHESTRATION_NETWORK_RPC_NODE_URL || "",
    skipFetchSetup: true,
  });
export const broadcasting_network_provider =
  new ethers.providers.StaticJsonRpcProvider({
    url: process.env.BROADCASTING_NETWORK_RPC_NODE_URL || "",
    skipFetchSetup: true,
  });

broadcasting_network_provider.getNetwork().then((network) => {
  const envChainId = Number(process.env.BROADCASTING_NETWORK_ID);
  if (network.chainId !== envChainId) {
    throw new Error(
      `Broadcasting network chain ID mismatch: ${network.chainId} doesn't match expected ${envChainId}`
    );
  }
});

export const AGENT = process.env.AGENT;

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);

export const signer = wallet.connect(orchestration_network_provider);
