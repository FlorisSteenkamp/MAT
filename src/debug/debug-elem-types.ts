import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { TwoProngForDebugging } from './two-prong-for-debugging.js';
import { ThreeProngForDebugging } from './three-prong-for-debugging.js';
import { Curve } from '../curve/curve.js';
import { Mat } from '../mat/mat.js';
import { CpNode } from '../cp-node/cp-node.js';
import { Circle } from '../geometry/circle.js';
import { ICpNodeForDebugging } from './cp-node-for-debugging.js';


/** @internal */
interface IDebugElems {
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
