"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaves = void 0;
const draw_circle_percent_1 = require("./draw-circle-percent");
/** @hidden */
function leaves(g, leaves) {
    let $elems = [];
    for (let cpNode of leaves) {
        let cp = cpNode.cp;
        let p = cp.circle.center;
        $elems.push(draw_circle_percent_1.drawCirclePercent(g, p, 0.5, 'pinker thin5 nofill'));
    }
    return $elems;
}
exports.leaves = leaves;
//# sourceMappingURL=leaves.js.map