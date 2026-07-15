import { LlRbTree } from 'flo-ll-rb-tree';
import { Loop } from 'flo-boolean';
import { getCpNodeToLeftOrSame } from '../mat/get-cp-node-to-left-or-same.js';
import { getBoundaryPieceBeziers } from '../mat/get-boundary-piece-beziers.js';
import { CurvePiece  } from '../mat/curve-piece.js';
import { CpNode } from '../cp-node/cp-node.js';
import { PointOnShape, PrePointOnShape } from '../point-on-shape/point-on-shape.js';
import { calcPosOrder } from '../point-on-shape/calc-pos-order.js';
import { Circle } from '../geometry/circle.js';
import { isPosCorner } from '../point-on-shape/is-pos-corner.js';
import { getPosCorner } from '../point-on-shape/get-pos-corner.js';
import { MatMeta } from '../index.js';


/** @internal */
function getInitialCurvePieces(
        angle: number,
        isHoleClosing: boolean,
        loop: Loop,
        loops: Loop[],
        meta: MatMeta,
        yPos: PrePointOnShape,
        xO: number[],
        test: boolean): (CurvePiece | undefined)[] {

    const { cpTrees } = meta;

    if (isHoleClosing) {
        return loops
        .filter(_loop => _loop !== loop)
        .flatMap(loop => loop.curves
            .map(curve => ({ curve, ts: [0,1] })));
    }

    const order =
        isPosCorner(yPos) && getPosCorner(yPos).isDull
            ? yPos.t === 1 && angle === 0
                ? -1 
                : yPos.t === 0
                ? +1
                : calcPosOrder(xO, yPos)
            : 0;

    const cpNode = getCpNodeToLeftOrSame(cpTrees.get(loop)!, yPos, order, 0);
    if (!cpNode || 
        // The special case if there is only a single sharp corner or 
        // two-way terminating 2-prong currently in the MAT. Don't remove!
        (cpNode === cpNode.next.next)) {

        return loop.curves.map(curve => ({ curve, ts: [0,1] }));
    }

    return getBoundaryPieceBeziers([cpNode, cpNode], test);
}


export { getInitialCurvePieces }
