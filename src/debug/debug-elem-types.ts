import { Mat } from '../mat/mat.js';
import { CpNode } from '../cp-node/cp-node.js';


type DebugElemKey = keyof typeof emptyDebugElems;


const emptyDebugElems = {
    oneProng: [] as CpNode[][],
    // oneProngAtDullCorner: [] as PointOnShape[],
    twoProng: [] as CpNode[],
    threeProng: [] as CpNode[],
    looseBoundingBox: [] as number[][][],
    tightBoundingBox: [] as number[][][],
    boundingHull: [] as number[][][],
    // sharpCorner: [] as Curve[],
    // dullCorner: [] as Curve[],
    vertex: [] as CpNode[],
    mat: [] as Mat[],
    maxVertex: [] as CpNode[],
    leaves: [] as CpNode[][],
    cull: [] as number[][],
    cpNode: [] as CpNode[],
    branch: [] as CpNode[][],
    holeCloser: [] as CpNode[],
    speed: [] as CpNode[]
} as const;


const debugElemNames = 
    Object.keys(emptyDebugElems) as Array<keyof typeof emptyDebugElems>;


/** @internal */
type DebugElems = typeof emptyDebugElems;

type DebugElem = { [T in keyof DebugElems]: DebugElems[T][number]; }


export {
    DebugElems, DebugElemKey, DebugElem,
    emptyDebugElems, debugElemNames,
}

