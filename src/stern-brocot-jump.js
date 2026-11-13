/**
 * Jump-target parsing for the Stern-Brocot explorer.
 *
 * Uses Core's `R` tag, the same exact-expression reader as RatCalc and the
 * webcalc RatTree page, in place of the legacy `@ratmath/parser`.
 */
import { Fraction, R } from "@ratmath/core";

/** Read a jump target such as 3/4, 0.75, 1..2/3, 0.#3 or 3.~7~15 as a reduced Fraction. */
export function fractionFromInput(input) {
  const value = R([String(input)]);
  const rational = value?.toRational ? value.toRational() : value;
  if (!(rational?.numerator !== undefined && rational?.denominator !== undefined)) {
    throw new Error("Enter a single exact number, not an interval");
  }
  return new Fraction(rational.numerator, rational.denominator).reduce();
}
