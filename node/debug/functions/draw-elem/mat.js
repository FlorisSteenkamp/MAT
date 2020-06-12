"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawMat = void 0;
const traverse_edges_1 = require("../../../traverse-edges");
const flo_draw_1 = require("flo-draw");
const get_curve_to_next_1 = require("../../../get-curve-to-next");
/** @hidden */
function drawMat(type) {
    let classes = type === 'mat'
        ? 'thin5 purple nofill'
        : 'thin10 red nofill';
    return (g, mat) => {
        let cpNode = mat.cpNode;
        if (!cpNode) {
            return undefined;
        }
        let $svgs = [];
        let i = 0;
        traverse_edges_1.traverseEdges(cpNode, cpNode => {
            if (cpNode.isTerminating()) {
                return;
            }
            let bezier = get_curve_to_next_1.getCurveToNext(cpNode);
            if (!bezier) {
                return;
            }
            i++;
            $svgs.push(...flo_draw_1.drawFs.bezier(g, bezier, classes /*, i*500*/));
        });
        return $svgs;
    };
}
exports.drawMat = drawMat;
//# sourceMappingURL=mat.js.map