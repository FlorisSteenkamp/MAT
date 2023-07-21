import { LlRbTree } from 'flo-ll-rb-tree';
import { getNeighbouringPoints } from '../../get-neighboring-cps.js';
import { getBoundaryPieceBeziers } from '../../get-boundary-piece-beziers.js';
import { BezierPiece  } from '../../bezier-piece.js';
import { Loop } from 'flo-boolean';
import { CpNode } from '../../../cp-node/cp-node.js';
import { PointOnShape } from '../../../point-on-shape/point-on-shape.js';
import { isPosDullCorner } from '../../../point-on-shape/is-pos-dull-corner.js';


/** @internal */
function getInitialBezierPieces(
        isHoleClosing: boolean,
        k: number,
        loops: Loop[],
        cpTrees: Map<Loop,LlRbTree<CpNode>>,
        y: PointOnShape) {

    let bezierPieces: BezierPiece[];
    let δ: CpNode[];

    if (isHoleClosing) {
        bezierPieces = [];
        for (let k2=0; k2<k; k2++) {
            const pieces: BezierPiece[] = loops[k2].curves
                .map(curve => ({ curve, ts: [0,1] }))
            bezierPieces.push(...pieces);
        }
    } else {
        //let order = PointOnShape.isDullCorner(y)
        const order = isPosDullCorner(y)
                ? y.t === 1 ? -1 : +1
                : 0;
        const loop = loops[k];
        const cpNode = getNeighbouringPoints(cpTrees.get(loop)!, y, order, 0)[0];
        δ = [cpNode, cpNode];
        if (!cpNode || 
            // The special case if there is only a single sharp corner or 
            // terminating 2-prong currently in the MAT. Don't remove!
            (cpNode === cpNode.next.next) 
        ) {
            bezierPieces = loop.curves
                .map(curve => ({ curve, ts: [0,1] }))
        } else {
            bezierPieces = getBoundaryPieceBeziers(δ);	
        }
    }

    return { bezierPieces, δ: δ! };
}


export { getInitialBezierPieces }
