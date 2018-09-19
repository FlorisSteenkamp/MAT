"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns an SVG string representation of the given loop.
 * @param loop
 * @param decimalPlaces
 */
function beziersToSvgPathStr(beziers, decimalPlaces = 10) {
    const D = decimalPlaces;
    let str = '';
    for (let i = 0; i < beziers.length; i++) {
        let ps = beziers[i];
        if (i === 0) {
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
    return str + ' z' + '\n';
}
exports.beziersToSvgPathStr = beziersToSvgPathStr;
