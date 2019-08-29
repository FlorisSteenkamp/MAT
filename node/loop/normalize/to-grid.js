"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_numerical_1 = require("flo-numerical");
/**
 * @hidden
 * Sends a onto a fixed-spacing grid with 2**12 divisions.
 * @param a
 * @param expMax Max extent of grid in positive and negative directions - given
 * as 2^expMax
 */
function toGrid(a, expMax, significantFigures) {
    let expA = Math.floor(Math.log2(Math.abs(a)));
    let expDif = expMax - expA;
    let newSig = significantFigures - expDif + 1;
    if (newSig <= 0) {
        return 0;
    }
    let res = flo_numerical_1.reduceSignificand(a, newSig);
    return res;
}
exports.toGrid = toGrid;
//# sourceMappingURL=to-grid.js.map