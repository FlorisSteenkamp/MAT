"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_curve_between_1 = require("./get-curve/get-curve-between");
/**
 * Returns the bezier curve from the maximal disk of the given [[CpNode]] to the
 * next [[CpNode]]'s maximal disk and thus directly represents a piece of the
 * medial axis.
 * @param cpNode
 */
function getCurveToNext(cpNode) {
    return get_curve_between_1.getCurveBetween(cpNode, cpNode.next);
}
exports.getCurveToNext = getCurveToNext;
//# sourceMappingURL=get-curve-to-next.js.map