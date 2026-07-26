import type { BezierPiece } from 'flo-bezier3';
import type { Mat } from '../mat/mat.js';
import type { CpNode } from '../cp-node/cp-node.js';
import {
    toUnitVector, distanceBetween, fromTo as fromToVec, dot, rotate90Degrees,
    cross, interpolate, translate, lineLineIntersection
} from 'flo-vector2d';
import { tangent as getTangent } from 'flo-bezier3';
import { mapDeep } from '../utils/map-deep.js';
import { removeSatInducedTrivial3Prongs } from './remove-sat-induced-trivial-3prongs.js';
import { getCpNodessForSat } from './get-cp-nodess-for-sat.js';
import { getRealProngCount } from '../cp-node/fs/get-real-prong-count.js';


const { max, abs, round, log2 } = Math;


// let ii = 0;


/**
 * * used for debugging only
 * 
 * @param mats 
 * 
 * @internal
 */
function reconstructFromMats(
        mats: Mat[],
        minNumAccurateBits: number | undefined = undefined) {

    const maxPO2 = max(...mats.map(mat => mat.meta.maxCoordPowerOf2));
    const recoverBoundary_ = recoverBoundary(maxPO2, minNumAccurateBits);

    // Really only required if getSats was called on the `Mat`s
    const cpNodessPerSat = mats
        .map(removeSatInducedTrivial3Prongs)
        .map(getCpNodessForSat);

    const r = mapDeep(3, cpNodessPerSat, recoverBoundary_, true);
    // ii;//?

    return r;
}


const FROM = 0;
const TO = 1;

/**
 * 
 * @param cpNode 
 * 
 * @internal
 */
function recoverBoundary(
        maxPO2: number,
        minNumAccurateBits: number | undefined) {

    return function (cpNode: CpNode) {
        const cpNode_ = cpNode.next;

        const pos = cpNode.pointOnShape; 
        const pos_ = cpNode_.pointOnShape;

        const { curve, circle, p } = pos;
        const { curve: curve_, p: p_ } = pos_;

        if (p[0] === p_[0] && p[1] === p_[1]) {
            return undefined;
        }

        if (curve.loop !== curve_.loop) {
            // It is a hole-closer going over to the other loop
            // return undefined;
            return undefined;
        }

        const d = distanceBetween(circle.center, p);
        
        if (getRealProngCount(cpNode)) {

        }

        // DON'T remove these - they tell us the accuracy of the algorithm
        // if (!closeTo(2**34)(circle.radius, d) && getRealProngCount(cpNode) === 3) {
        //     ii++;
        //     circle.center;//?
        //     circle.radius;//?
        //     d;            //?
        //     p;//?
        //     pos.isSource;//?
        //     getRealProngCount(cpNode);//?
        // }
        // if (!closeTo(2**28)(circle.radius, d) && getRealProngCount(cpNode) !== 3) {
        //     ii++;
        //     circle.center;//?
        //     circle.radius;//?
        //     d;            //?
        //     p;//?
        //     pos.isSource;//?
        //     getRealProngCount(cpNode);//?
        // }
        if (minNumAccurateBits !== undefined) {
            const TOL = 2**(maxPO2 - minNumAccurateBits);

            if (abs(circle.radius - d) > TOL) {
                throw new Error(
                    `Medial circle radius must be about the same (2**${round(log2(TOL))}) ` +
                    `as distance from medial circle center to point on shape, ` + 
                    `found: medial radius ${circle.radius}, distance: ${d}`
                );
            }
        }

        return getBoundaryPiece(cpNode);
    }
}


/** @internal */
const TOLERANCE_ADD_2PRONG = 0.01;
/** @internal */
const TOLERANCE_USE_LINE = 0.0001; // else cubic


function getBoundaryPiece(
        cpNode: CpNode) {

    const cpNode_ = cpNode.next;

    const pos = cpNode.pointOnShape; 
    const pos_ = cpNode_.pointOnShape;

    const { p } = pos;
    const { p: p_ } = pos_;

    const fromCc = p;
    const fromL = getEdgeDirection(cpNode, FROM);

    const toCc = p_;
    const toL = getEdgeDirection(cpNode_, TO);

    const mid = lineLineIntersection(fromL, toL);

    const c = fromToVec(fromCc,toCc);

    let twisted: boolean;
    if (!mid) {
        twisted = true;
    } else {
        const a = fromToVec(fromCc, mid);
        const b = fromToVec(toCc,   mid);
        
        twisted = dot(a,c) < 0 || dot(b,c) > 0;
    }
    
    if (!twisted) {
        return [fromCc, mid!, toCc];
    } 
        
    const r = rotate90Degrees(c);
    const w1 = fromToVec(fromL[0], fromL[1]); // This is a unit vector
    const w2 = fromToVec(toL[0],  toL[1]);  // This is a unit vector

    const d1 = abs(cross(c, w1)) / (3*3); 
    const d2 = abs(cross(c, w2)) / (3*3); 

    if (d1 > TOLERANCE_ADD_2PRONG || d2 > TOLERANCE_ADD_2PRONG) {
        // FUTURE - not within tolerance - must add additional 2-prong
        return [fromCc, toCc];
    } 

    if (d1 > TOLERANCE_USE_LINE || d2 > TOLERANCE_USE_LINE) {
        // approximate with cubic bezier
        const m1 = interpolate(fromCc,toCc,1/3);
        const m2 = interpolate(fromCc,toCc,2/3);
        const v1 = translate(r, m1);
        const v2 = translate(r, m2);
        const l1 = [m1,v1];
        const l2 = [m2,v2];
        const mid1 = lineLineIntersection(fromL, l1)!;
        const mid2 = lineLineIntersection(toL,   l2)!;

        return [fromCc, mid1, mid2, toCc];
    } 

    // Within tolerance - approximate with a straight line.
    return [fromCc, toCc];
}


/**
 * Returns a line segment of unit length starting at the given point and
 * being tangent to the shape boundary.
 * 
 * @internal
 */
function getEdgeDirection(
        cpNode: CpNode,
        fromOrTo: typeof FROM | typeof TO) {

    let { pointOnShape } = cpNode;
    let { curve, t, p } = pointOnShape;
    let { ps } = curve;

    if (fromOrTo === FROM && t === 1) {
        t = 0;
        curve = curve.next;
        ps = curve.ps;
    }
    if (fromOrTo === TO && t === 0 ) {
        t = 1;
        curve = curve.prev;
        ps = curve.ps;
    }

    const tangent = getTangent(ps, t);
    
    const v = translate(p, tangent);

    return [p,v];
}


export { reconstructFromMats }
