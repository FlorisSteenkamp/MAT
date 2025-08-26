import { LlRbTree } from 'flo-ll-rb-tree';
import { Loop } from 'flo-boolean';
import { CurvePiece } from '../mat/bezier-piece.js';
import { CpNode } from '../cp-node/cp-node.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { Circle } from '../geometry/circle.js';
/** @internal */
declare function getInitialBezierPieces(angle: number, isHoleClosing: boolean, loop: Loop, loops: Loop[], cpTrees: Map<Loop, LlRbTree<CpNode>>, y: PointOnShape, circle: Circle): CurvePiece[];
export { getInitialBezierPieces };
