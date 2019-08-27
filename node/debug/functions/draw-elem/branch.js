"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_draw_1 = require("flo-draw");
const smoothen_1 = require("../../../mat/smoothen/smoothen");
function drawBranch(g, branch, delay) {
    let classes = 'thin5 purple nofill';
    let $svgs = [];
    let i = 0;
    for (let cpNode of branch) {
        if (cpNode.isTerminating()) {
            continue;
        }
        //let bezier = cpNode.matCurveToNextVertex;
        let bezier = smoothen_1.getCurveToNext(cpNode);
        if (!bezier) {
            continue;
        }
        i++;
        $svgs.push(...flo_draw_1.drawFs.bezier(g, bezier, classes, delay));
    }
    return $svgs;
}
exports.drawBranch = drawBranch;
//# sourceMappingURL=branch.js.map