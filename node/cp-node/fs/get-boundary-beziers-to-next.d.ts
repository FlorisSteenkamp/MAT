import type { CpNode } from '../cp-node.js';
/**
//  * Returns the boundary beziers between this `CpNode` and the next
//  * one.
//  *
//  * * returns `[]` if the next `CpNode` is on a different loop,
//  * as this is a hole-closer and there are no boundary beziers between them.
//  *
//  * @param cpNode
//  */
declare function getBoundaryBeziersToNext(cpNode: CpNode): number[][][];
export { getBoundaryBeziersToNext };
