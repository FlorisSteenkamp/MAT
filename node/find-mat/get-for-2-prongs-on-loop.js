import { splitByCurvatureAndLength, controlPointLinesLength, getInflections } from 'flo-bezier3';
import { toP } from '../point-on-shape/to-p.js';
/**
 * Get useful points on the shape - these incude points of maximum curvature and
 * points at the bezier-bezier interfaces.
 * @param loop
 * @param additionalPointCount
 *
 * @internal
 */
function getFor2ProngsOnLoop(minBezLength, maxCurviness, maxLength) {
    return function (loop) {
        const for2Prongs = [];
        const curves = loop.curves;
        for (let i = 0; i < curves.length; i++) {
            const curve = curves[i];
            const ps = curve.ps;
            if (controlPointLinesLength(ps) < minBezLength) {
                continue;
            }
            let ts = splitByCurvatureAndLength(ps, maxCurviness, maxLength);
            ts = ts.length === 2 ? [0.5] : ts;
            ts.push(...getInflections(ps));
            ts = ts.filter(t => t !== 0 && t !== 1);
            const byCurvatureAndLength = ts.map(t => ({ curve, t, isSource: true, p: toP(curve.ps, t) }));
            for2Prongs.push(...byCurvatureAndLength);
        }
        return for2Prongs;
    };
}
export { getFor2ProngsOnLoop };
//# sourceMappingURL=get-for-2-prongs-on-loop.js.map