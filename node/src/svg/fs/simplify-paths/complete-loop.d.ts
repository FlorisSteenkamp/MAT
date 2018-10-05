import { Curve } from '../../../curve';
import { X } from '../../../x';
import { ILoopTree } from './i-loop-tree';
declare function completeLoop(intersections: Map<Curve, X[]>, takenXs: Set<X>, xStack: X[], loopTree: ILoopTree, x: X): number[][][];
export { completeLoop };
