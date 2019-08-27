/**
 * Splits a double into 2 26-bit significand floats.
 * See https://pdfs.semanticscholar.org/3203/34c5719faa1a60ff751fbfa9f557e0245107.pdf
 * @param a
 */
declare function split(a: number): number[];
export { split };
