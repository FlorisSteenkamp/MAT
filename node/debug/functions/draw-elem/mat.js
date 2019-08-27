"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const traverse_edges_1 = require("../../../traverse-edges");
const flo_draw_1 = require("flo-draw");
const smoothen_1 = require("../../../mat/smoothen/smoothen");
function drawMat(type) {
    let classes = type === 'mat'
        ? 'thin5 purple nofill'
        : 'thin10 red nofill';
    return (g, mat) => {
        let cpNode = mat.cpNode;
        if (!cpNode) {
            return undefined;
        }
        // TODO - remove - testing
        /*while (!cpNode.isTerminating()) {
            cpNode = cpNode.next;
        }*/
        /*
        drawFs.dot(g, cpNode.cp.pointOnShape.p, 1)
        drawFs.dot(g, cpNode.cp.circle.center, 2)
        */
        let $svgs = [];
        let i = 0;
        traverse_edges_1.traverseEdges(cpNode, cpNode => {
            if (cpNode.isTerminating()) {
                return;
            }
            //let bezier = cpNode.matCurveToNextVertex;
            let bezier = smoothen_1.getCurveToNext(cpNode);
            if (!bezier) {
                return;
            }
            i++;
            $svgs.push(...flo_draw_1.drawFs.bezier(g, bezier, classes /*, i*100*/));
        });
        return $svgs;
    };
}
exports.drawMat = drawMat;
//# sourceMappingURL=mat.js.map