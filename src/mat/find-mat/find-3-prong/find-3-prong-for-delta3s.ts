/** @internal */
declare const _debug_: Debug;

import { 
    fromTo, circumCenter, len, distanceBetween, toUnitVector, rotate90Degrees,
    cross 
} from 'flo-vector2d';
import { tangent } from 'flo-bezier3';
import { Debug } from '../../../debug/debug.js';
import { CpNode } from '../../../cp-node.js';
import { BezierPiece } from '../../bezier-piece.js';
import { isPosDullCorner, IPointOnShape } from '../../../point-on-shape.js';
import { getClosestBoundaryPoint } from '../../closest-boundary-point/get-closest-boundary-point.js';
import { calcInitial3ProngCenter } from './calc-initial-3-prong-center.js';
import { getClosestPoints } from './get-closest-points.js';
import { calcBetterX } from './calc-better-x.js';
import { getCornerAtEnd } from '../../../curve.js';


/** @hidden */
const calcVectorToZeroV_StraightToIt = fromTo;


/**
 * @hidden
 * Finds a 3-prong using only the 3 given δs.
 * @param δs The boundary pieces
 * @param idx δ identifier
 * @param bezierPiecess
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function find3ProngForDelta3s(
        δs: CpNode[][], 
        idx: number, 
        k: number,
        bezierPiecess: BezierPiece[][],
        extreme: number) {

    const TOLERANCE = extreme * 1e-10;
    const MAX_ITERATIONS = 10;

    const δs_ = [
        δs[0], 
        δs[idx], 
        δs[δs.length-1]
    ];

    const bezierPieces_ = [
        bezierPiecess[0], 
        bezierPiecess[idx], 
        bezierPiecess[δs.length-1]
    ];

    const δ3ss = [
        [δs_[0], δs_[1], δs_[2]],
        [δs_[1], δs_[2], δs_[0]],
        [δs_[2], δs_[0], δs_[1]],
    ];

    const bezierPiecess_ = [
        [bezierPieces_[0], bezierPieces_[1], bezierPieces_[2]],
        [bezierPieces_[1], bezierPieces_[2], bezierPieces_[0]],
        [bezierPieces_[2], bezierPieces_[0], bezierPieces_[1]],
    ]


    const δ3s = δ3ss[k];
    const bezierPiece3s = bezierPiecess_[k];

    if (δ3s[0][0].isSharp()) { return undefined; }


    let ps: IPointOnShape[];
    let circumCenter_;
    let j = 0; // Safeguard for slow convergence
    let x = calcInitial3ProngCenter(δ3s, bezierPiece3s);

    if (typeof _debug_ !== 'undefined') { 
        const threeProngs = _debug_.generated.elems.threeProng;
        const d = threeProngs[threeProngs.length-1];
        const trace = d.traces[d.traces.length-1];
        trace.push(x);
    }

    let tolerance = Number.POSITIVE_INFINITY;
    while (tolerance > TOLERANCE && j < MAX_ITERATIONS) { 
        j++;
        
        ps = getClosestPoints(x, bezierPiece3s);
        if (!Number.isFinite(x[0]) || !Number.isFinite(x[1])) {

            // TODO - the code can be cleaned up and sped up a lot if we don't
            // use this function as is but instead use δs[0] and δs[2] as is
            // and make δs[1] include all the rest of the beziers around the 
            // loop. This check, for instance, would be eliminated completely.
            return undefined;
        }

        circumCenter_ = circumCenter(ps.map(x => x.p));

        const vectorToZeroV = calcVectorToZeroV_StraightToIt(x, circumCenter_);

        if (!Number.isFinite(vectorToZeroV[0]) || !Number.isFinite(vectorToZeroV[1])) {

            // TODO - the code can be cleaned up and sped up a lot if we don't
            // use this function as is but instead use δs[0] and δs[2] as is
            // and make δs[1] include all the rest of the beziers around the 
            // loop. This check, for instance, would be eliminated completely.
            return undefined;
        }
        const upds = calcBetterX(bezierPiece3s, x, vectorToZeroV);
        x = upds.newX;
        ps = upds.newPs;

        if (typeof _debug_ !== 'undefined') { 
            const threeProngs = _debug_.generated.elems.threeProng;
            const d = threeProngs[threeProngs.length-1];
            const trace = d.traces[d.traces.length-1];
            trace.push(x);
        }

        const V = len(vectorToZeroV); // The 'potential'
        
        tolerance = Math.abs(V - upds.newV);
    }

    const radius = (distanceBetween(x, ps[0].p) + 
                distanceBetween(x, ps[1].p) + 
                distanceBetween(x, ps[2].p)) / 3;

    const circle = { center: x, radius };

    //-------------------------------------------------------------------------
    // Calculate the unit tangent vector at 3-prong circle points - they should 
    // be very close to tangent to the boundary piece tangents at those points 
    // (up to sign). Sharp corners are a common special case.
    //-------------------------------------------------------------------------
    let totalAngleError = 0;
    for (let i=0; i<3; i++) {
        const p = ps[i];
        //----------------------------
        // Tangent of circle at point
        //----------------------------
        const v = toUnitVector(fromTo(p.p, x));
        const v1 = rotate90Degrees(v);
        
        
        //-----------------------------------
        // Check if point is on dull crorner
        //-----------------------------------
        //if (PointOnShape.isDullCorner(p)) {
        if (isPosDullCorner(p)) {
            //const corner = Curve.getCornerAtEnd(p.curve);
            const corner = getCornerAtEnd(p.curve);
            const tans = corner.tangents;
            const perps = tans.map( rotate90Degrees );
                
            const angleError1 = Math.asin( cross( perps[0], v ) );
            const angleError2 = Math.asin( cross( v, perps[1] ) );
            
            let angleError = 0;
            if (angleError1 > 0) { angleError += angleError1; }
            if (angleError2 > 0) { angleError += angleError2; }
            
            totalAngleError += angleError;
        } else {
            //---------------------------
            // Tangent of curve at point
            //---------------------------
            const v2 = toUnitVector( tangent(p.curve.ps, p.t) );
            
            // Cross is more numerically stable than Vector.dot at angles a
            // multiple of Math.PI **and** is close to the actual angle value
            // and can thus just be added to cone method of looking at 
            // tolerance.
            
            // Should be close to zero and is close to the actual angle.
            const cross_ = Math.abs( Math.asin( cross(v1, v2) ) );
            
            totalAngleError += cross_;
        }		
    }

    //-------------------------------------------------------------------------
    // Calculate radiusDelta, the difference between the radius and the closest
    // point to the 3-prong. It should be around 0. If not, this is not a good 
    // candidate for the 3-prong.
    //-------------------------------------------------------------------------
    const closestDs = [];
    for (let i=0; i<bezierPiecess.length; i++) {
        const p = getClosestBoundaryPoint(
            bezierPiecess[i], x, undefined, undefined
        );
        
        closestDs.push( distanceBetween(p.pos.p, x) );
    }
    const closestD = Math.min(...closestDs);
    const radiusDelta = Math.abs(radius - closestD);

    // Weights below still need to be optimized.
    const W1 = 1;
    const W2 = 1;
    const error = W1*radiusDelta + W2*totalAngleError;

    return { ps, circle, error, δ3s };
}


export { find3ProngForDelta3s }
