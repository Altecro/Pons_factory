/** Pons Factory contract on Robinhood Chain */
export const PONS_FACTORY =
  "0xA5aAb3F0c6EeadF30Ef1D3Eb997108E976351feB" as const;

/** Pons Locker contract on Robinhood Chain */
export const PONS_LOCKER =
  "0x736D76699C26D0d966744cAe304C000d471f7F35" as const;

/** Launch fee: 0.0005 ETH */
export const LAUNCH_FEE_WEI = 500_000_000_000_000n; // 0.0005 * 10^18

/**
 * Typical memecoin total supply note:
 * Many launches use 1_000_000_000e18 (1B tokens with 18 decimals).
 * Confirm on-chain / factory defaults before launching.
 */
export const SUPPLY_NOTE =
  "Typical supply: 1_000_000_000 tokens (18 decimals). Confirm factory defaults.";
