import { getNeighbouringPoints } from '../../get-neighboring-cps.js';
import { getBoundaryPieceBeziers } from '../../get-boundary-piece-beziers.js';
import { isPosDullCorner } from '../../../point-on-shape/is-pos-dull-corner.js';
/** @internal */
function getInitialBezierPieces(isHoleClosing, k, loops, cpTrees, y) {
    let bezierPieces;
    let δ;
    if (isHoleClosing) {
        bezierPieces = [];
        for (let k2 = 0; k2 < k; k2++) {
            const pieces = loops[k2].curves
                .map(curve => ({ curve, ts: [0, 1] }));
            bezierPieces.push(...pieces);
        }
    }
    else {
        //let order = PointOnShape.isDullCorner(y)
        const order = isPosDullCorner(y)
            ? y.t === 1 ? -1 : +1
            : 0;
        const loop = loops[k];
        const cpNode = getNeighbouringPoints(cpTrees.get(loop), y, order, 0)[0];
        δ = [cpNode, cpNode];
        if (!cpNode ||
            // The special case if there is only a single sharp corner or 
            // terminating 2-prong currently in the MAT. Don't remove!
            (cpNode === cpNode.next.next)) {
            bezierPieces = loop.curves
                .map(curve => ({ curve, ts: [0, 1] }));
        }
        else {
            bezierPieces = getBoundaryPieceBeziers(δ);
        }
    }
    return { bezierPieces, δ: δ };
}
export { getInitialBezierPieces };
//# sourceMappingURL=get-initial-bezier-pieces.js.map