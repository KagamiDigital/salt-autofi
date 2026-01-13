/**
 * Encodes a swap path for Uniswap V3 exactInput
 * @param tokens - Array of token addresses in order [tokenIn, intermediate(s), tokenOut]
 * @param fees - Array of fee tiers between each token pair (length = tokens.length - 1)
 * @returns Encoded path as hex string
 *
 * @example
 * // Direct swap: TOKEN_A -> TOKEN_B (fee: 3000)
 * encodePath(
 *   ['0xTokenA...', '0xTokenB...'],
 *   [3000]
 * )
 *
 * @example
 * // Multi-hop: TOKEN_A -> TOKEN_B -> TOKEN_C (fees: 100, 500)
 * encodePath(
 *   ['0xTokenA...', '0xTokenB...', '0xTokenC...'],
 *   [100, 500]
 * )
 */
export function encodePath(tokens: string[], fees: number[]): string {
  // Validate input
  if (tokens.length !== fees.length + 1) {
    throw new Error("Fees array must be exactly one less than tokens array");
  }

  let encoded = "0x";

  for (let i = 0; i < tokens.length; i++) {
    // Remove 0x prefix and add token address (20 bytes = 40 hex chars)
    const tokenAddress = tokens[i].toLowerCase().replace("0x", "");

    if (tokenAddress.length !== 40) {
      throw new Error(`Invalid token address at index ${i}: ${tokens[i]}`);
    }

    encoded += tokenAddress;

    // Add fee if not the last token (3 bytes = 6 hex chars)
    if (i < fees.length) {
      const feeHex = fees[i].toString(16).padStart(6, "0");
      encoded += feeHex;
    }
  }

  return encoded;
}

// Type-safe fee tier constants
export const FEE_TIERS = {
  LOWEST: 100, // 0.01% - Stablecoins, HYPE pairs
  LOW: 500, // 0.05% - Correlated assets
  MEDIUM: 3000, // 0.3% - Most pairs
  HIGH: 10000, // 1% - Exotic pairs
} as const;

export type FeeTier = (typeof FEE_TIERS)[keyof typeof FEE_TIERS];
