import { getCurvatureExtremaDd, controlPointLinesLength } from 'flo-bezier3';
import { createPos } from '../point-on-shape/create-pos.js';
/**
 * @internal
 * Get useful points on the shape - these incude points of maximum curvature and
 * points at the bezier-bezier interfaces.
 * @param loop
 * @param additionalPointCount
 */
function getFor1ProngsOnLoop(minBezLength) {
    return function (loop) {
        const for1Prongs = [];
        const poss = getCurvatureExtremaPoss(minBezLength)(loop);
        for1Prongs.push(...poss.minima, ...poss.maxima);
        return for1Prongs;
    };
}
function getCurvatureExtremaPoss(minBezLength) {
    return function (loop) {
        const poss = {
            minima: [],
            maxima: []
        };
        for (let i = 0; i < loop.curves.length; i++) {
            const curve = loop.curves[i];
            if (controlPointLinesLength(curve.ps) < minBezLength) {
                continue;
            }
            const { minima, maxima } = getCurvatureExtremaDd(curve.ps);
            // const maxAbsCurvatures = [...minima, ...maxima].map(t => createPos(curve, t, true));
            poss.minima.push(...minima.map(t => createPos(curve, t, true)));
            poss.maxima.push(...maxima.map(t => createPos(curve, t, true)));
        }
        return poss;
    };
}
export { getFor1ProngsOnLoop };
//# sourceMappingURL=get-for-1-prongs-on-loop.js.map