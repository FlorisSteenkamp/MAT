"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Splits a double into 2 26-bit significand floats.
 * See https://pdfs.semanticscholar.org/3203/34c5719faa1a60ff751fbfa9f557e0245107.pdf
 * @param a
 */
function split(a) {
    // s === Math.ceil(significand bits / 2) === Math.ceil(53 / 2) === 27
    const s = 27;
    let factor = Math.pow(2, s) + 1;
    let c = factor * a;
    let a1 = c - (c - a);
    let a2 = a - a1;
    return [a1, a2];
}
exports.split = split;
//# sourceMappingURL=split.js.map