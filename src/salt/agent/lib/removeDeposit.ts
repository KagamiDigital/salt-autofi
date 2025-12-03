import { deposits } from "..";

/**
 *
 * @returns
 */
export function removeDeposit() {
  return deposits.shift();
}
