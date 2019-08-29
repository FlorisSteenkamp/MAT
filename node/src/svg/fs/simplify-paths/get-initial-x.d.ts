import { Loop } from '../../../loop';
import { Curve } from '../../../curve';
import { ILoopTree } from "./i-loop-tree";
import { X } from '../../../x/x';
/**
 * @hidden
 * Get initial intersection which is really a dummy intersection.
 * @param loop
 * @param parent
 */
declare function getInitialX(intersections: Map<Curve, X[]>, parent: ILoopTree, loop: Loop): X;
export { getInitialX };
