import { getCpNodeToLeftOrSame } from '../mat/get-cp-node-to-left-or-same.js';
import { getBoundaryPieceBeziers } from '../mat/get-boundary-piece-beziers.js';
import { calcPosOrder } from '../point-on-shape/calc-pos-order.js';
import { isPosCorner } from '../point-on-shape/is-pos-corner.js';
import { getPosCorner } from '../point-on-shape/get-pos-corner.js';
/** @internal */
function getInitialBezierPieces(angle, isHoleClosing, loop, loops, cpTrees, y, circle) {
    if (isHoleClosing) {
        return loops
            .filter(_loop => _loop !== loop)
            .flatMap(loop => loop.curves
            .map(curve => ({ curve, ts: [0, 1] })));
    }
    const order = isPosCorner(y) && getPosCorner(y).isDull
        ? y.t === 1 && angle === 0
            ? -1
            : y.t === 0
                ? +1
                : calcPosOrder(circle, y)
        : 0;
    const cpNode = getCpNodeToLeftOrSame(cpTrees.get(loop), y, order, 0);
    if (!cpNode ||
        // The special case if there is only a single sharp corner or 
        // two-way terminating 2-prong currently in the MAT. Don't remove!
        (cpNode === cpNode.next.next)) {
        return loop.curves
            .map(curve => ({ curve, ts: [0, 1] }));
    }
    return getBoundaryPieceBeziers([cpNode, cpNode]);
}
export { getInitialBezierPieces };
//# sourceMappingURL=get-initial-bezier-pieces.js.map