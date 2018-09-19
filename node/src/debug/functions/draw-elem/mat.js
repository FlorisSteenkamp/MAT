"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const traverse_edges_1 = require("../../../mat/traverse-edges");
function mat(type, smooth) {
    let classes = type === 'mat'
        ? 'thin5 purple nofill'
        : 'thin5 red nofill';
    return f;
    function f(g, cpNode) {
        if (!cpNode) {
            return undefined;
        }
        let draw = _debug_.fs.draw;
        let $svgs = [];
        //const DRAW_CLASS_LINE = 'thin20 blue1 nofill';
        //const DRAW_CLASS_QUAD = 'thin20 blue2 nofill';
        //const DRAW_CLASS_CUBE = 'thin20 blue3 nofill';
        traverse_edges_1.traverseEdges(cpNode, function (cpNode) {
            if (cpNode.isTerminating()) {
                return;
            }
            if (!smooth) {
                let p1 = cpNode.cp.circle.center;
                let p2 = cpNode.next.cp.circle.center;
                $svgs.push(...draw.line(g, [p1, p2], classes));
                return;
            }
            let bezier = cpNode.matCurve;
            if (!bezier) {
                return;
            }
            let fs = [, , draw.line, draw.quadBezier, draw.bezier];
            $svgs.push(...fs[bezier.length](g, bezier, classes));
        });
        return $svgs;
    }
}
exports.mat = mat;
