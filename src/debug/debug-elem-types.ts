
import { ElemType_TwoProng } from "../mat/elem-type-two-prong";
import { PointOnShape } from "../point-on-shape";
import { TwoProngForDebugging } from "./two-prong-for-debugging";
import { ThreeProngForDebugging } from "./three-prong-for-debugging";
import { Curve } from "../curve";
import { Mat } from "../mat";
import { CpNode } from "../cp-node/cp-node";
import { Loop } from "../loop/loop";
import { Circle } from "../circle";
import { X } from "../x/x";
import { CpNodeForDebugging } from "./cp-node-for-debugging";


interface IDebugElems {
    oneProng: PointOnShape;
    oneProngAtDullCorner: PointOnShape;
    twoProng_regular: TwoProngForDebugging;
	twoProng_failed: TwoProngForDebugging;
	twoProng_notAdded: TwoProngForDebugging;
	twoProng_deleted: TwoProngForDebugging;
    twoProng_holeClosing: TwoProngForDebugging;
    threeProng: ThreeProngForDebugging;
    minY: PointOnShape;
    looseBoundingBox: number[][];
    tightBoundingBox: number[][];
    boundingHull: number[][];
    sharpCorner: Curve
    dullCorner: Curve;
    vertex: CpNode;
    mat: Mat;
    sat: Mat;
    loop: Loop;
    loops: Loop[];
    maxVertex: CpNode;
    leaves: CpNode[];
    culls: Circle[];
    intersection: X;
    cpNode: CpNodeForDebugging;
}

/*
type DebugElemType = ElemType_TwoProng 
    | 'oneProng'  
    | 'minY'  
    | 'looseBoundingBox' 
    | 'tightBoundingBox' 
    | 'sharpCorner' 
    | 'dullCorner' 
    | 'oneProng' 
    | 'oneProngAtDullCorner' 
    | 'threeProng' 
    | 'boundingHull' 
    | 'mat' 
    | 'sat'
    | 'loop'
    | 'loops'
    | 'maxVertex'
    | 'leaves'
    | 'culls'
    | 'intersection'
*/

export { /*DebugElemType,*/ IDebugElems }

/* TODO - remove - was checking something :)
type T_A = { a: number; }
type T_B = { b: number; }
type T_C = { c: number; }

interface IA {
    a: T_A;
    b: T_B;
    c: T_C;
}

type IB = { [T in keyof IA]: (p: IA[T]) => number }

let b: IB = {
    a: (a: T_A) => 3,
    b: (b: T_B) => 3,
    c: (c: T_C) => 3,
}
*/
