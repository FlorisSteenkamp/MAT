"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const point_on_shape_1 = require("../../point-on-shape");
let i = 0;
/** Name the given object - for debugging purposes only */
function nameObj(o, pre = '') {
    o.name = '' + pre + i++;
}
/**
 * Transforms a boundary piece (δ) into a human readable string.
 * @param cpNodes A boundary piece given by two CpNodes.
 */
function δToString(cpNodes) {
    return cpNodes.map(cpNode => point_on_shape_1.PointOnShape.toHumanString(cpNode.cp.pointOnShape));
}
/**
 * Transforms an array of boundary pieces (δs) into a human readable string.
 * @param cpNodes An array of boundary pieces.
 */
function δsToString(cpNodes) {
    return cpNodes.map(δToString);
}
/**
 * Convert the given points into a human readable string.
 * @param ps
 */
function pointsToStr(ps, decimalPlaces = 3) {
    return ps.map(p => pointToStr(p, decimalPlaces));
}
/**
 * Converts the given point into a human readable string.
 * @param p - The point
 * @param decimalPlaces - number of decimal places
 */
function pointToStr(p, decimalPlaces = 3) {
    return p[0].toFixed(decimalPlaces) + ', ' + p[1].toFixed(decimalPlaces);
}
let generalDebugFunctions = {
    δToString,
    δsToString,
    pointToStr,
    pointsToStr,
    nameObj,
};
exports.generalDebugFunctions = generalDebugFunctions;
