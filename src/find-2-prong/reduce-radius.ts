import { evalDeCasteljau } from "flo-bezier3";
import { dot, lengthSquared } from "flo-vector2d";
import { CurvePiece } from '../mat/curve-piece.js';


// TODO - must improve this
/**
 * Reduces the circle radius initially as an optimization step.
 * 
 * @internal
 */
function reduceRadius(
        maxCoordPowerOf2: number,
        curvePieces: (CurvePiece | undefined)[], 
        p: number[],
        nnorm: number[]): number {

    const TOLERANCE = 1 + 2**-16;

    let minRadius = Infinity;
    for (let i=0; i<curvePieces.length; i++) {
        const curvePiece = curvePieces[i];

        if (curvePiece === undefined) { continue; }

        const { curve, ts } = curvePiece;
        const { ps } = curve;

        const num = 2;
        for (let j=0; j<(num + 1); j++) {
            const p_ = evalDeCasteljau(ps, ts[j/num]);
            const n = getCircleCenterFrom2PointsAndNormal(maxCoordPowerOf2, p, nnorm, p_);
            if (n === undefined) {
                continue;
            }
            let r = lengthSquared(n);
            if (r < minRadius) {
                minRadius = r;
            }
        }
    }

    // The extra bit is to account for floating point precision.
    return TOLERANCE*minRadius;
}


/**
 * @param p1 a point on the circle with normal pointing to `x` towards the center
 * of the circle
 * @param x
 * @param p2 another point on the circle
 * 
 * @internal
 */
function getCircleCenterFrom2PointsAndNormal(
        maxCoordPowerOf2: number, 
        p1: number[], 
        nnorm: number[],
        p2: number[]): number[] | undefined {

    const TOLERANCE = (2**(maxCoordPowerOf2 - 14))**2;
    const chord = [p2[0] - p1[0], p2[1] - p1[1]];

    // Ignore if p1 and p2 are too close together
    if (dot(chord, chord) < TOLERANCE) {
        return undefined;
    }

    const denom = dot(nnorm, chord);

    // If the ray from p1 to x is parallel to the perpendicular bisector,
    // there is no finite center on that ray.
    if (denom <= 0) {
        return undefined;
    }

    const scale = dot(chord, chord) / (2*denom);

    const n = [scale*nnorm[0], scale*nnorm[1]];

    return n;
}


export { reduceRadius }
