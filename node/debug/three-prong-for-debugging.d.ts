import { CpNode } from '../cp-node/cp-node.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { Circle } from '../circle.js';
import { Generated } from './debug.js';
/**
 * @internal
 * Used for debugging only. A three-prong is a maximally inscribed circle that
 * touches the shape boundary (tangentially) at 3 points.
 */
interface ThreeProngForDebugging {
    generated: Generated;
    /** The best fit circle found for the 3-prong. */
    circle: Circle;
    /** The best fit 3 points found for the 3-prong. */
    poss: PointOnShape[];
    /** The 3 boundary pieces on which the three prong points were found. */
    cp3ss: CpNode[][];
    /** The boundary pieces that were used to search the three prong on. */
    cpss: CpNode[][];
    bestIndx: number;
    /** An array of 3-prongs, each of which may be a best fit 3-prong. */
    candidateThreeProngs: {
        circle: Circle;
        ps: PointOnShape[];
    }[];
    visitedCps: CpNode[];
    boundaries: number[][][][];
    traces: number[][][];
}
declare function createEmptyThreeProngForDebugging(): ThreeProngForDebugging;
export { ThreeProngForDebugging, createEmptyThreeProngForDebugging };
