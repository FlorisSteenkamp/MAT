import { CpNode } from '../cp-node/cp-node';
import { PointOnShape } from '../point-on-shape';
import { Circle } from '../circle';
import { Generated } from './debug';
/**
 * @hidden
 * Class used in debugging. A three-prong is a maximally inscribed circle that
 * touches the shape boundary (tangentially) at 3 points.
 */
declare class ThreeProngForDebugging {
    generated: Generated;
    circle: Circle;
    poss: PointOnShape[];
    cp3ss: CpNode[][];
    cpss: CpNode[][];
    bestIndx: number;
    candidateThreeProngs: {
        circle: Circle;
        ps: PointOnShape[];
    }[];
    visitedCps: CpNode[];
    boundaries: number[][][][];
    traces: number[][][];
    /**
     * @param circle The best fit circle found for the 3-prong.
     * @param poss The best fit 3 points found for the 3-prong.
     * @param cp3ss The 3 boundary pieces on which the three prong points were
     * found.
     * @param cpss The boundary pieces that were used to search the three prong
     * on.
     * @param bestIndx
     * @param candidateThreeProngs An array of 3-prongs, each of which may be a
     * best fit 3-prong.
     */
    constructor();
    readonly cpsSimple: string[][];
}
export { ThreeProngForDebugging };
