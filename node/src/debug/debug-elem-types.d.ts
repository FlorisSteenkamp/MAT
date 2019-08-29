import { PointOnShape } from "../point-on-shape";
import { TwoProngForDebugging } from "./two-prong-for-debugging";
import { ThreeProngForDebugging } from "./three-prong-for-debugging";
import { Curve } from "../curve";
import { Mat } from "../mat";
import { CpNode } from "../../cp-node";
import { Loop } from "../loop";
import { Circle } from "../circle";
import { X } from "../x/x";
import { CpNodeForDebugging } from "./cp-node-for-debugging";
/** @hidden */
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
    sharpCorner: Curve;
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
export { IDebugElems };
