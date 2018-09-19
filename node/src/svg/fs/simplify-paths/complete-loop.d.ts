import { Curve } from '../../../curve';
import { IXInfo } from './i-x-info';
import { ILoopTree } from './i-loop-tree';
/**
 * Make a complete loop thus finding one componentLoop
 * @param intersections
 * @param takenXs
 * @param xStack
 * @param loop
 * @param xInfo
 */
declare function completeLoop(intersections: Map<Curve, IXInfo[]>, takenXs: Set<IXInfo>, xStack: IXInfo[], loop: ILoopTree, xInfo: IXInfo): number[][][];
export { completeLoop };
