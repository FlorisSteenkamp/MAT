import type { Loop } from 'flo-boolean';
import type { PrePointOnShape } from '../point-on-shape/point-on-shape.js';
import { splitByCurvatureAndLength, controlPointLinesLength, getInflections } from 'flo-bezier3';
import { toP } from '../point-on-shape/to-p.js';


/** Source points closer than this (in `t`) to a curve endpoint are dropped */
const T_MARGIN = 2**-30;


/**
 * Get useful points on the shape - these incude points of maximum curvature and 
 * points at the bezier-bezier interfaces.  
 * @param loop
 * @param additionalPointCount 
 * 
 * @internal
 */
function getFor2ProngsOnLoop(
        minBezLength: number,
        maxCurviness: number,
        maxLength: number) {

    return function(loop: Loop) {
        const for2Prongs: PrePointOnShape[] = [];

        const curves = loop.curves;
        for (let i=0; i<curves.length; i++) {
            const curve = curves[i];
            const ps = curve.ps;

            if (controlPointLinesLength(ps) < minBezLength) {
                continue;
            }
            
            let ts = splitByCurvatureAndLength(ps, maxCurviness, maxLength);

            ts = ts.length === 2 ? [0.5] : ts;
            ts.push(...getInflections(ps));
            // Inflections can be found (numerically) at or just outside the
            // curve endpoints (e.g. `1 - 2**-52` when the last 3 control
            // points are collinear). Such a source point coincides with the
            // next curve's start where the closest point search can't resolve
            // that curve's curvature, resulting in a non-maximal 2-prong.
            // FUTURE - handle this exactly instead: in `getClosestPoint`, if
            // the source point equals the next curve's start, use that
            // curve's curvature there to bound the radius rather than
            // discarding its (degenerate) root at `s === 0`.
            ts = ts.filter(t => t > T_MARGIN && t < 1 - T_MARGIN);

            const byCurvatureAndLength: PrePointOnShape[] = 
                ts.map(t => {
                    const pDd = toP(curve.ps, t);
                    const p = pDd.map(c => c[0] + c[1]);

                    return { curve, t, isSource: true, p, pDd };
                });

            for2Prongs.push(...byCurvatureAndLength);
        }

        return for2Prongs;
    }
}


export { getFor2ProngsOnLoop }
