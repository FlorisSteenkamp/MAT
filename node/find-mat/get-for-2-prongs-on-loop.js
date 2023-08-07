import { splitByCurvatureAndLength, controlPointLinesLength } from 'flo-bezier3';
import { createPos } from '../point-on-shape/create-pos.js';
/**
 * @internal
 * Get useful points on the shape - these incude points of maximum curvature and
 * points at the bezier-bezier interfaces.
 * @param loop
 * @param additionalPointCount
 */
function getFor2ProngsOnLoop(minBezLength, maxCurviness, maxLength) {
    return function (loop) {
        const for2Prongs = [];
        for (let i = 0; i < loop.curves.length; i++) {
            const curve = loop.curves[i];
            if (controlPointLinesLength(curve.ps) < minBezLength) {
                continue;
            }
            let ts = splitByCurvatureAndLength(curve.ps, maxCurviness, maxLength);
            // add at least one in the middle
            if (ts.length === 2) {
                ts = [0, 0.5, 1];
            }
            const byCurvatureAndLength = ts.slice(1, ts.length - 1).map(t => createPos(curve, t, true));
            for2Prongs.push(...byCurvatureAndLength);
        }
        return for2Prongs;
    };
}
export { getFor2ProngsOnLoop };
//# sourceMappingURL=get-for-2-prongs-on-loop.js.map