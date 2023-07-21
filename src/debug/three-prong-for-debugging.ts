import { CpNode } from '../cp-node/cp-node.js';
import { PointOnShape } from '../point-on-shape/point-on-shape.js';
import { posToHumanString } from '../point-on-shape/pos-to-human-string.js';
import { Circle } from '../circle.js';
import { Generated } from './debug.js';


/**
 * @internal
 * Used for debugging only. A three-prong is a maximally inscribed circle that
 * touches the shape boundary (tangentially) at 3 points.
 */
interface ThreeProngForDebugging {
    generated  : Generated;
    /** The best fit circle found for the 3-prong. */
    circle     : Circle;
    /** The best fit 3 points found for the 3-prong. */
    poss       : PointOnShape[];
    /** The 3 boundary pieces on which the three prong points were found. */
    cp3ss      : CpNode[][];
    /** The boundary pieces that were used to search the three prong on. */
    cpss       : CpNode[][];                 
    bestIndx   : number; 
    /** An array of 3-prongs, each of which may be a best fit 3-prong. */
    candidateThreeProngs : { 
        circle: Circle; 
        ps: PointOnShape[]; 
    }[];
    visitedCps : CpNode[];
    boundaries : number[][][][];
    traces     : number[][][];
}


function createEmptyThreeProngForDebugging(): ThreeProngForDebugging {
    return {
        generated  : undefined!,
        circle     : undefined!,
        poss       : undefined!,
        cp3ss      : undefined!,
        cpss       : undefined!,
        bestIndx   : undefined!,
        candidateThreeProngs : undefined!,
        visitedCps : undefined!,
        boundaries : undefined!,
        traces     : undefined!,
    }
}

function cpsSimple(threeProngForDebugging: ThreeProngForDebugging) {
    return threeProngForDebugging.cpss.map(δ =>
        [posToHumanString( δ[0].cp.pointOnShape ),
         posToHumanString( δ[1].cp.pointOnShape )] 
    );
}


export { ThreeProngForDebugging, createEmptyThreeProngForDebugging }
