"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_path_str_from_beziers_1 = require("../fs/get-path-str-from-beziers");
/**
 * Returns a string representation of the given beziers linked loop.
 * @param beziers - A linked loop of cubic beziers.
 */
function getPathStrFromBezierLoop(bezierLoop) {
    let beziers = bezierLoop.items.map(x => x.item);
    return get_path_str_from_beziers_1.getPathStrFromBeziers(beziers);
}
exports.getPathStrFromBezierLoop = getPathStrFromBezierLoop;
