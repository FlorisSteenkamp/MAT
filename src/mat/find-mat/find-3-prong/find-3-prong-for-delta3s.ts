declare var _debug_: MatDebug;

import { MatDebug } from '../../../debug/debug';

import { 
    fromTo, circumCenter, len, distanceBetween, toUnitVector, rotate90Degrees,
    cross
} from 'flo-vector2d';
import { tangent } from 'flo-bezier3';

import { CpNode     } from '../../../cp-node/cp-node';

import { Circle       } from '../../../circle';
import { BezierPiece  } from '../../../bezier-piece';
import { PointOnShape } from '../../../point-on-shape';

import { getClosestBoundaryPoint } from 
    '../../closest-boundary-point/get-closest-boundary-point';

import { calcInitial3ProngCenter } from './calc-initial-3-prong-center';
import { getClosestPoints } from './get-closest-points';
import { calcBetterX      } from './calc-better-x';
import { Curve } from '../../../curve';


const calcVectorToZeroV_StraightToIt = fromTo;


/**
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

    let δs_ = [
        δs[0], 
        δs[idx], 
        δs[δs.length-1]
    ];

    let bezierPieces_ = [
        bezierPiecess[0], 
        bezierPiecess[idx], 
        bezierPiecess[δs.length-1]
    ];

    let δ3ss = [
        [δs_[0], δs_[1], δs_[2]],
        [δs_[1], δs_[2], δs_[0]],
        [δs_[2], δs_[0], δs_[1]],
    ];

    let bezierPiecess_ = [
        [bezierPieces_[0], bezierPieces_[1], bezierPieces_[2]],
        [bezierPieces_[1], bezierPieces_[2], bezierPieces_[0]],
        [bezierPieces_[2], bezierPieces_[0], bezierPieces_[1]],
    ]


    let δ3s = δ3ss[k];
    let bezierPiece3s = bezierPiecess_[k];

    if (δ3s[0][0].isSharp()) { return undefined; }


    let ps: PointOnShape[];
    let circumCenter_;
    let j = 0; // Safeguard for slow convergence
    //console.log(bezierPieces_)
    let x = calcInitial3ProngCenter(δ3s, bezierPiece3s);

    if (typeof _debug_ !== 'undefined') { 
        let threeProngs = _debug_.generated.elems.threeProng;
        let d = threeProngs[threeProngs.length-1];
        let trace = d.traces[d.traces.length-1];
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

        let vectorToZeroV = calcVectorToZeroV_StraightToIt(x, circumCenter_);

        //console.log('' + x[0] + ' ' + x[1])
        //console.log('' + vectorToZeroV[0] + ' ' + vectorToZeroV[1]);

        if (!Number.isFinite(vectorToZeroV[0]) || !Number.isFinite(vectorToZeroV[1])) {

            // TODO - the code can be cleaned up and sped up a lot if we don't
            // use this function as is but instead use δs[0] and δs[2] as is
            // and make δs[1] include all the rest of the beziers around the 
            // loop. This check, for instance, would be eliminated completely.
            return undefined;
        }
        let upds = calcBetterX(bezierPiece3s, x, vectorToZeroV);
        x = upds.newX;
        ps = upds.newPs;

        if (typeof _debug_ !== 'undefined') { 
            let threeProngs = _debug_.generated.elems.threeProng;
            let d = threeProngs[threeProngs.length-1];
            let trace = d.traces[d.traces.length-1];
            trace.push(x);
        }

        let V = len(vectorToZeroV); // The 'potential'
        
        tolerance = Math.abs(V - upds.newV);
    }

    //_debug_.fs.draw.dot(_debug_.generated.g, x, 0.05);

    let radius = (distanceBetween(x, ps[0].p) + 
                distanceBetween(x, ps[1].p) + 
                distanceBetween(x, ps[2].p)) / 3;

    let circle = new Circle(x, radius);


    
    //-------------------------------------------------------------------------
    // Calculate the unit tangent vector at 3-prong circle points - they should 
    // be very close to tangent to the boundary piece tangents at those points 
    // (up to sign). Sharp corners are a common special case.
    //-------------------------------------------------------------------------
    let totalAngleError = 0;
    for (let i=0; i<3; i++) {
        let p = ps[i];
        //----------------------------
        // Tangent of circle at point
        //----------------------------
        let v = toUnitVector(fromTo(p.p, x));
        let v1 = rotate90Degrees(v);
        
        
        //-----------------------------------
        // Check if point is on dull crorner
        //-----------------------------------
        if (PointOnShape.isDullCorner(p)) {
            let corner = Curve.getCornerAtEnd(p.curve);
            let tans = corner.tangents;
            let perps = tans.map( rotate90Degrees );
                
            let angleError1 = Math.asin( cross( perps[0], v ) );
            let angleError2 = Math.asin( cross( v, perps[1] ) );
            
            let angleError = 0;
            if (angleError1 > 0) { angleError += angleError1; }
            if (angleError2 > 0) { angleError += angleError2; }
            
            totalAngleError += angleError;
        } else {
            //---------------------------
            // Tangent of curve at point
            //---------------------------
            let v2 = toUnitVector( tangent(p.curve.ps, p.t) );
            
            // Cross is more numerically stable than Vector.dot at angles a
            // multiple of Math.PI **and** is close to the actual angle value
            // and can thus just be added to cone method of looking at 
            // tolerance.
            
            // Should be close to zero and is close to the actual angle.
            let cross_ = Math.abs( Math.asin( cross(v1, v2) ) );
            
            totalAngleError += cross_;
        }		
    }

    //-------------------------------------------------------------------------
    // Calculate radiusDelta, the difference between the radius and the closest
    // point to the 3-prong. It should be around 0. If not, this is not a good 
    // candidate for the 3-prong.
    //-------------------------------------------------------------------------
    let closestDs = [];
    for (let i=0; i<bezierPiecess.length; i++) {
        let p = getClosestBoundaryPoint(
            bezierPiecess[i], x, undefined, undefined
        );
        
        closestDs.push( distanceBetween(p.pos.p, x) );
    }
    let closestD = Math.min(...closestDs);
    let radiusDelta = Math.abs(radius - closestD);

    // Weights below still need to be optimized.
    let W1 = 1;
    let W2 = 1;
    let error = W1*radiusDelta + W2*totalAngleError;

    return { ps, circle, error, δ3s };
}


export { find3ProngForDelta3s }
