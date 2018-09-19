
import { CpNode       } from '../cp-node';
import { PointOnShape } from '../point-on-shape';
import { Circle       } from '../circle';
import { Generated } from './debug';


/**
 * Class used in debugging. A three-prong is a maximally inscribed circle that
 * touches the shape boundary (tangentially) at 3 points.
 */
class ThreeProngForDebugging {

    public generated  : Generated;
    public circle     : Circle;
    public poss       : PointOnShape[];
    public cp3ss      : CpNode[][];
    public cpss       : CpNode[][];                 
    public bestIndx   : number; 
    public candidateThreeProngs : { 
        circle: Circle; 
        ps: PointOnShape[]; 
    }[];
    public visitedCps : CpNode[];
    public boundaries : number[][][][];
    public traces     : number[][][];


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
    constructor() { }


    get cpsSimple() {
        return this.cpss.map(δ =>
            [PointOnShape.toHumanString( δ[0].cp.pointOnShape ),
             PointOnShape.toHumanString( δ[1].cp.pointOnShape )] 
        );
    }
}


export { ThreeProngForDebugging }
