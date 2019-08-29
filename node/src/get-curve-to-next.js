"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_curve_between_1 = require("./get-curve/get-curve-between");
/**
 *
 * @param cpNode
 */
function getCurveToNext(cpNode) {
    return get_curve_between_1.getCurveBetween(cpNode, cpNode.next);
}
exports.getCurveToNext = getCurveToNext;
//# sourceMappingURL=get-curve-to-next.js.map