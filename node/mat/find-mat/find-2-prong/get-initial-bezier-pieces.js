"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_neighboring_cps_1 = require("../../get-neighboring-cps");
const get_boundary_piece_beziers_1 = require("../../get-boundary-piece-beziers");
const bezier_piece_1 = require("../../../bezier-piece");
const point_on_shape_1 = require("../../../point-on-shape");
function getInitialBezierPieces(isHoleClosing, k, loops, cpTrees, y) {
    let bezierPieces;
    let δ;
    if (isHoleClosing) {
        bezierPieces = [];
        for (let k2 = 0; k2 < k; k2++) {
            //let pieces = getBoundaryBeziers(loops[k2]);
            let pieces = loops[k2].curves
                .map(curve => new bezier_piece_1.BezierPiece(curve, [0, 1]));
            bezierPieces.push(...pieces);
        }
    }
    else {
        let order = point_on_shape_1.PointOnShape.isDullCorner(y)
            ? y.t === 1 ? -1 : +1
            : 0;
        let loop = loops[k];
        let cpNode = get_neighboring_cps_1.getNeighbouringPoints(cpTrees.get(loop), y, order, 0)[0];
        δ = [cpNode, cpNode];
        if (!cpNode ||
            // The special case if there is only a single sharp corner or 
            // terminating 2-prong currently in the MAT. Don't remove!
            (cpNode === cpNode.next.next)) {
            bezierPieces = loop.curves
                .map(curve => new bezier_piece_1.BezierPiece(curve, [0, 1]));
        }
        else {
            bezierPieces = get_boundary_piece_beziers_1.getBoundaryPieceBeziers(δ);
        }
    }
    return { bezierPieces, δ };
}
exports.getInitialBezierPieces = getInitialBezierPieces;
//# sourceMappingURL=get-initial-bezier-pieces.js.map