import "dotenv/config";
import { defineChain } from "viem";

export const rpcUrl =
  process.env.RPC_URL ?? "https://rpc.mainnet.chain.robinhood.com";
export const chainId = Number(process.env.CHAIN_ID ?? 4663);

export const robinhoodChain = defineChain({
  id: chainId,
  name: "Robinhood Chain",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [rpcUrl],
    },
  },
});

export const config = {
  rpcUrl,
  chainId,
  chain: robinhoodChain,
  ponsFactory: process.env.PONS_FACTORY as `0x${string}` | undefined,
  ponsLocker: process.env.PONS_LOCKER as `0x${string}` | undefined,
  creatorFeeWallet: process.env.CREATOR_FEE_WALLET as `0x${string}` | undefined,
  privateKey: process.env.PRIVATE_KEY as `0x${string}` | undefined,
  xBearerToken: process.env.X_BEARER_TOKEN,
  openaiApiKey: process.env.OPENAI_API_KEY,
};
