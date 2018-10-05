import { Curve } from '../../../curve';
import { Loop } from '../../../loop';
import { X } from '../../../x';
import { ILoopTree } from './i-loop-tree';
/**
 *
 * @param intersections
 * @param loopsTaken
 * @param loop
 * @param parent
 */
declare function completePath(intersections: Map<Curve, X[]>, loopsTaken: Set<Loop>, parent: ILoopTree, loop: Loop): void;
export { completePath };
