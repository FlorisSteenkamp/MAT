import { Mat } from '../mat/mat.js';
import { CpNode } from '../cp-node/cp-node.js';
type DebugElemKey = keyof typeof emptyDebugElems;
declare const emptyDebugElems: {
    readonly oneProng: CpNode[][];
    readonly twoProng: CpNode[];
    readonly threeProng: CpNode[];
    readonly looseBoundingBox: number[][][];
    readonly tightBoundingBox: number[][][];
    readonly boundingHull: number[][][];
    readonly vertex: CpNode[];
    readonly mat: Mat[];
    readonly maxVertex: CpNode[];
    readonly leaves: CpNode[][];
    readonly cull: number[][];
    readonly cpNode: CpNode[];
    readonly branch: CpNode[][];
    readonly holeCloser: CpNode[];
    readonly speed: CpNode[];
};
declare const debugElemNames: Array<keyof typeof emptyDebugElems>;
/** @internal */
type DebugElems = typeof emptyDebugElems;
type DebugElem = {
    [T in keyof DebugElems]: DebugElems[T][number];
};
export { DebugElems, DebugElemKey, DebugElem, emptyDebugElems, debugElemNames, };
