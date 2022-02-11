import { LlRbTree } from 'flo-ll-rb-tree';
import { BezierPiece } from '../../bezier-piece.js';
import { Loop } from '../../../loop.js';
import { CpNode } from '../../../cp-node.js';
import { IPointOnShape } from '../../../point-on-shape.js';
/** @hidden */
declare function getInitialBezierPieces(isHoleClosing: boolean, k: number, loops: Loop[], cpTrees: Map<Loop, LlRbTree<CpNode>>, y: IPointOnShape): {
    bezierPieces: BezierPiece[];
    δ: CpNode[];
};
export { getInitialBezierPieces };
