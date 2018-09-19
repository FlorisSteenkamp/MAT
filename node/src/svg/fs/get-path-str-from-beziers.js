"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns a string representation of the given array of beziers.
 * @param loop
 * @param decimalPlaces
 */
function getPathStrFromBeziers(loop, decimalPlaces = 10) {
    const D = decimalPlaces;
    let str = '';
    for (let curve of loop.curves) {
        let ps = curve.ps;
        if (ps === loop.curves[0].ps) {
            str = 'M ' +
                ps[0][0].toFixed(D) + ' ' +
                ps[0][1].toFixed(D) + '\n';
        }
        str += 'C ' +
            ps[1][0].toFixed(D) + ' ' +
            ps[1][1].toFixed(D) + ' ' +
            ps[2][0].toFixed(D) + ' ' +
            ps[2][1].toFixed(D) + ' ' +
            ps[3][0].toFixed(D) + ' ' +
            ps[3][1].toFixed(D) + ' ' + '\n';
    }
    return str;
}
exports.getPathStrFromBeziers = getPathStrFromBeziers;
