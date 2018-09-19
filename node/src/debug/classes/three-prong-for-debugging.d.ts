import { CpNode } from '../../cp-node';
import { PointOnShape } from '../../point-on-shape';
import { Circle } from '../../circle';
/**
 * Class used in debugging. A three-prong is a maximally inscribed circle that
 * touches the shape boundary (tangentially) at 3 points.
 */
declare class ThreeProngForDebugging {
    circle: Circle;
    poss: PointOnShape[];
    /** The 3 boundary pieces on which the three prong points were found. */
    cp3ss: CpNode[][];
    /** The boundary pieces that were used to search the three prong on. */
    cpss: CpNode[][];
    bestIndx: number;
    candidateThreeProngs: {
        circle: Circle;
        ps: PointOnShape[];
    }[];
    /** All contact points visited (starting from some progenitor ContactPoint)
     * before adding this 3-prong. */
    visitedCps: CpNode[];
    cpsSimple: string[][];
    /**
     * @param circle The best fit circle found for the 3-prong.
     * @param poss The best fit 3 points found for the 3-prong.
     * @param cp3s The 3 boundary pieces on which the three prong points were
     * found.
     * @param cps The boundary pieces that were used to search the three prong
     * on.
     * @param bestIndx
     * @param candidateThreeProngs An array of 3-prongs, each of which may be a
     * best fit 3-prong.
     */
    constructor(circle: Circle, poss: PointOnShape[], cp3s: CpNode[][], cps: CpNode[][], bestIndx: number, candidateThreeProngs?: {
        circle: Circle;
        ps: PointOnShape[];
    }[], visitedCps?: CpNode[]);
}
export { ThreeProngForDebugging };
