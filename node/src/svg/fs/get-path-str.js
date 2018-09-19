"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_path_str_from_beziers_1 = require("../fs/get-path-str-from-beziers");
/**
 * Returns a string representation of the given beziers linked loop.
 * @param beziers - A linked loop of cubic beziers.
 */
function getPathStr(loop, decimalPlaces = 10) {
    return get_path_str_from_beziers_1.getPathStrFromBeziers(loop.items, decimalPlaces);
}
exports.getPathStr = getPathStr;
