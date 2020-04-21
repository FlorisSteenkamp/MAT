
import { IPointOnShape } from "../point-on-shape";
import { TwoProngForDebugging } from "./two-prong-for-debugging";
import { ThreeProngForDebugging } from "./three-prong-for-debugging";
import { Curve } from "../curve";
import { Mat } from "../mat";
import { CpNode } from "../cp-node";
import { Loop } from "../loop";
import { Circle } from "../circle";
import { ICpNodeForDebugging } from "./cp-node-for-debugging";


/** @hidden */
interface IDebugElems {
    oneProng: IPointOnShape;
    oneProngAtDullCorner: IPointOnShape;
    twoProng_regular: TwoProngForDebugging;
	twoProng_failed: TwoProngForDebugging;
	twoProng_notAdded: TwoProngForDebugging;
	twoProng_deleted: TwoProngForDebugging;
    twoProng_holeClosing: TwoProngForDebugging;
    threeProng: ThreeProngForDebugging;
    looseBoundingBox: number[][];
    tightBoundingBox: number[][];
    boundingHull: number[][];
    sharpCorner: Curve
    dullCorner: Curve;
    vertex: CpNode;
    mat: Mat;
    sat: Mat;
    maxVertex: CpNode;
    leaves: CpNode[];
    culls: Circle[];
    cpNode: ICpNodeForDebugging;
}


export { IDebugElems }
