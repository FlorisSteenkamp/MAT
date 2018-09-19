import { Loop } from '../../../loop';
import { Curve } from '../../../curve';
import { ILoopTree } from "./i-loop-tree";
import { IXInfo } from './i-x-info';
/**
 * Get initial intersection which is really a dummy intersection.
 * @param loop
 * @param parent
 */
declare function getInitialX(intersections: Map<Curve, IXInfo[]>, parent: ILoopTree, loop: Loop): IXInfo;
export { getInitialX };
