import { getCurvatureExtremaDd, controlPointLinesLength } from 'flo-bezier3';
import { distanceBetween } from 'flo-vector2d';
import { toP } from '../point-on-shape/to-p.js';
/**
 * @internal
 * Curvature maxima closer than this (in parameter space) to a curve endpoint
 * are ignored - they are handled by the corner logic.
 */
const EDGE_T_TOLERANCE = 2 ** -20;
/**
 * @internal
 * Curvature maxima closer than this fraction of the curve's control polygon
 * length to a curve endpoint are ignored. A curve with (near) coincident
 * control points at an end has (near) zero speed there and its curvature
 * blows up towards that end; the resulting "maximum" (that can be well
 * inside the parameter tolerance above) is an artifact and not a feature of
 * the shape.
 */
const EDGE_DISTANCE_TOLERANCE = 2 ** -20;
/**
 * Get points of maximum curvature.
 *
 * @param loop
 *
 * @internal
 */
function getFor1ProngsOnLoop(minBezLength) {
    return function (loop) {
        const poss = [];
        for (let i = 0; i < loop.curves.length; i++) {
            const curve = loop.curves[i];
            const { ps } = curve;
            const len = controlPointLinesLength(ps);
            if (len < minBezLength) {
                continue;
            }
            const pS = ps[0];
            const pE = ps[ps.length - 1];
            const edgeDistanceTolerance = len * EDGE_DISTANCE_TOLERANCE;
            for (const t of getCurvatureExtremaDd(ps).maxima) {
                // keep away from edges (in parameter space)
                if (t < EDGE_T_TOLERANCE || t > 1 - EDGE_T_TOLERANCE) {
                    continue;
                }
                const pDd = toP(ps, t);
                const p = pDd.map(c => c[0] + c[1]);
                // keep away from edges (in distance)
                if (distanceBetween(p, pS) < edgeDistanceTolerance ||
                    distanceBetween(p, pE) < edgeDistanceTolerance) {
                    continue;
                }
                poss.push({ curve, t, isSource: true, p, pDd });
            }
        }
        return poss;
    };
}
export { getFor1ProngsOnLoop };
//# sourceMappingURL=get-for-1-prongs-on-loop.js.map