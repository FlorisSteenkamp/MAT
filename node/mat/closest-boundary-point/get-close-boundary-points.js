import { distanceBetween } from 'flo-vector2d';
import { createPos } from '../../point-on-shape/create-pos.js';
import { cullBezierPieces } from './cull-bezier-pieces.js';
import { closestPointsOnCurve } from './closest-points-on-curve.js';
/**
 * @internal
 * Returns the closest boundary point to the given point, limited to the given
 * bezier pieces, including the beziers actually checked after culling.
 * @param bezierPieces
 * @param point
 * @param touchedCurve
 * @param t
 * @param extreme
 */
function getCloseBoundaryPoints(bezierPieces, point, y, distance) {
    const touchedCurve = y.curve;
    const t = y.t;
    const p_ = y.p;
    bezierPieces = cullBezierPieces(bezierPieces, point);
    // TODO - integrate with is-another-cp-closeby - we MUST check angle too!
    const DISTANCE_TOLERANCE = 1e-9;
    const posInfos = [];
    for (let i = 0; i < bezierPieces.length; i++) {
        const bezierPiece = bezierPieces[i];
        // TOOD - important - should be able to return multiple points
        const ps = closestPointsOnCurve(bezierPiece.curve, point, bezierPiece.ts, touchedCurve, t);
        //if (ps === undefined) { continue; }
        for (let j = 0; j < ps.length; j++) {
            const p = ps[j];
            const d = distanceBetween(p.p, point);
            let curve = bezierPiece.curve;
            let t_ = p.t;
            if (Math.abs(d - distance) < DISTANCE_TOLERANCE) {
                if (t_ === 0) {
                    t_ = 1;
                    curve = bezierPiece.curve.prev;
                }
                // posInfos.push({ pos: new PointOnShape(curve, t_), d });
                posInfos.push({ pos: createPos(curve, t_), d });
            }
        }
    }
    if (posInfos.length > 1) {
        // Remove ones that are too close together.
        // TODO - in future remove all these checks and join n-prongs when they
        // are being added - much simpler and more symmetric. Remeber order when
        // comparing closeness!
        const indexesToCheck = [];
        for (let i = 0; i < posInfos.length; i++) {
            indexesToCheck.push(i);
        }
        const indexesToRemove = [];
        for (let i = 0; i < indexesToCheck.length; i++) {
            for (let j = i + 1; j < indexesToCheck.length; j++) {
                if (i === j) {
                    continue;
                }
                const p1 = posInfos[indexesToCheck[i]].pos.p;
                const p2 = posInfos[indexesToCheck[j]].pos.p;
                // Below checks for source point too - similar to 
                // isAnotherCpCloseBy
                const p3 = p_;
                if ((Math.abs(p1[0] - p2[0]) < 1e-6 &&
                    Math.abs(p1[1] - p2[1]) < 1e-6) ||
                    (Math.abs(p1[0] - p3[0]) < 1e-6 &&
                        Math.abs(p1[1] - p3[1]) < 1e-6)) {
                    indexesToRemove.push(indexesToCheck[i]);
                }
            }
        }
        for (let i = indexesToRemove.length - 1; i >= 0; i--) {
            posInfos.splice(indexesToRemove[i], 1);
        }
    }
    return posInfos;
}
export { getCloseBoundaryPoints };
//# sourceMappingURL=get-close-boundary-points.js.map