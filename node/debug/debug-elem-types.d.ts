import { IPointOnShape } from '../point-on-shape.js';
import { TwoProngForDebugging } from './two-prong-for-debugging.js';
import { ThreeProngForDebugging } from './three-prong-for-debugging.js';
import { Curve } from '../curve.js';
import { Mat } from '../mat.js';
import { CpNode } from '../cp-node.js';
import { Circle } from '../circle.js';
import { ICpNodeForDebugging } from './cp-node-for-debugging.js';
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
    sharpCorner: Curve;
    dullCorner: Curve;
    vertex: CpNode;
    mat: Mat;
    sat: Mat;
    maxVertex: CpNode;
    leaves: CpNode[];
    culls: Circle[];
    cpNode: ICpNodeForDebugging;
}
export { IDebugElems };
