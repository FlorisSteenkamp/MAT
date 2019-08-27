import LlRbTree from 'flo-ll-rb-tree';
import { BezierPiece } from '../../../bezier-piece';
import { Loop } from '../../../loop/loop';
import { CpNode } from '../../../cp-node/cp-node';
import { PointOnShape } from '../../../point-on-shape';
declare function getInitialBezierPieces(isHoleClosing: boolean, k: number, loops: Loop[], cpTrees: Map<Loop, LlRbTree<CpNode>>, y: PointOnShape): {
    bezierPieces: BezierPiece[];
    δ: CpNode[];
};
export { getInitialBezierPieces };
