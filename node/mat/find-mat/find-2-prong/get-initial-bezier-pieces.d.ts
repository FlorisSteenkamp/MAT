import { LlRbTree } from 'flo-ll-rb-tree';
import { BezierPiece } from '../../bezier-piece.js';
import { Loop } from 'flo-boolean';
import { CpNode } from '../../../cp-node/cp-node.js';
import { PointOnShape } from '../../../point-on-shape/point-on-shape.js';
/** @internal */
declare function getInitialBezierPieces(isHoleClosing: boolean, k: number, loops: Loop[], cpTrees: Map<Loop, LlRbTree<CpNode>>, y: PointOnShape): {
    bezierPieces: BezierPiece[];
    δ: CpNode[];
};
export { getInitialBezierPieces };
