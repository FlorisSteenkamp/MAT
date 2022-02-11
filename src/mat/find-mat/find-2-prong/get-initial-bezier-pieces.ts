import { LlRbTree } from 'flo-ll-rb-tree';
import { getNeighbouringPoints } from '../../get-neighboring-cps.js';
import { getBoundaryPieceBeziers } from '../../get-boundary-piece-beziers.js';
import { BezierPiece  } from '../../bezier-piece.js';
import { Loop } from '../../../loop.js';
import { CpNode } from '../../../cp-node.js';
import { isPosDullCorner, IPointOnShape } from '../../../point-on-shape.js';


/** @hidden */
function getInitialBezierPieces(
        isHoleClosing: boolean,
        k: number,
        loops: Loop[],
        cpTrees: Map<Loop,LlRbTree<CpNode>>,
        y: IPointOnShape) {

    let bezierPieces: BezierPiece[];
    let δ: CpNode[];

    if (isHoleClosing) {
        bezierPieces = [];
        for (let k2=0; k2<k; k2++) {
            let pieces: BezierPiece[] = loops[k2].curves
                .map(curve => ({ curve, ts: [0,1] }))
            bezierPieces.push(...pieces);
        }
    } else {
        //let order = PointOnShape.isDullCorner(y)
        let order = isPosDullCorner(y)
                ? y.t === 1 ? -1 : +1
                : 0;
        let loop = loops[k];
        let cpNode = getNeighbouringPoints(cpTrees.get(loop), y, order, 0)[0];
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

    return { bezierPieces, δ };
}


export { getInitialBezierPieces }
