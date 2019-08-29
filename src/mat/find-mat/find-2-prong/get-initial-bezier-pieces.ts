
import LlRbTree from 'flo-ll-rb-tree';
import { getNeighbouringPoints   } from '../../get-neighboring-cps';
import { getBoundaryPieceBeziers } from '../../get-boundary-piece-beziers';
import { BezierPiece  } from '../../bezier-piece';
import { Loop } from '../../../loop';
import { CpNode } from '../../../cp-node';
import { PointOnShape } from '../../../point-on-shape';


/** @hidden */
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
            let pieces = loops[k2].curves
                .map(curve => new BezierPiece(curve, [0,1]))
            bezierPieces.push(...pieces);
        }
    } else {
        let order = PointOnShape.isDullCorner(y)
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
                .map(curve => new BezierPiece(curve, [0,1]))
        } else {
            bezierPieces = getBoundaryPieceBeziers(δ);	
        }
    }

    return { bezierPieces, δ };
}


export { getInitialBezierPieces }
