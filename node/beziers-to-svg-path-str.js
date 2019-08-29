"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns an SVG path string representation of the given cubic bezier loop.
 * @param beziers An array of cubic bezier curves each given as an array of
 * control points.
 * @param decimalPlaces The number of decimal places in the returned path
 * string.
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
        if (ps.length === 4) {
            str += 'C ' +
                ps[1][0].toFixed(D) + ' ' +
                ps[1][1].toFixed(D) + ' ' +
                ps[2][0].toFixed(D) + ' ' +
                ps[2][1].toFixed(D) + ' ' +
                ps[3][0].toFixed(D) + ' ' +
                ps[3][1].toFixed(D) + ' ' + '\n';
        }
        else if (ps.length === 3) {
            str += 'Q ' +
                ps[1][0].toFixed(D) + ' ' +
                ps[1][1].toFixed(D) + ' ' +
                ps[2][0].toFixed(D) + ' ' +
                ps[2][1].toFixed(D) + ' ' + '\n';
        }
        else if (ps.length === 2) {
            str += 'L ' +
                ps[1][0].toFixed(D) + ' ' +
                ps[1][1].toFixed(D) + ' ' + '\n';
        }
    }
    return str + ' z' + '\n';
}
exports.beziersToSvgPathStr = beziersToSvgPathStr;
//# sourceMappingURL=beziers-to-svg-path-str.js.map