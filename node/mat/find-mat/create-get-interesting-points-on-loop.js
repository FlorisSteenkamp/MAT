import { getCurvatureExtrema, splitByCurvatureAndLength, controlPointLinesLength } from 'flo-bezier3';
import { getContactCirclesAtInterface } from '../get-contact-circles-at-interface.js';
import { comparePoss } from '../../point-on-shape/compare-poss.js';
import { createPos } from '../../point-on-shape/create-pos.js';
/**
 * @internal
 * Get useful points on the shape - these incude points of maximum curvature and
 * points at the bezier-bezier interfaces.
 * @param loop
 * @param additionalPointCount
 */
function getInterestingPointsOnLoop(minBezLength, maxCurviness, maxLength) {
    return function (loop) {
        const allPoints = [];
        for (let i = 0; i < loop.curves.length; i++) {
            const curve = loop.curves[i];
            if (controlPointLinesLength(curve.ps) < minBezLength) {
                continue;
            }
            const { minima, maxima } = getCurvatureExtrema(curve.ps);
            const maxAbsCurvatures = [...minima, ...maxima].map(t => createPos(curve, t));
            // const maxAbsCurvatures = [...maxima].map(t => createPos(curve, t));
            allPoints.push(...getContactCirclesAtInterface(curve), ...maxAbsCurvatures);
            // for (let v of maxAbsCurvatures) {
            //     if (v.t === 0.9978869234519733) {
            //         console.log(v.t)
            //     }
            // }
            let ts = splitByCurvatureAndLength(curve.ps, maxCurviness, maxLength);
            if (ts.length === 2) {
                // add at least one in the middle
                ts = [0, 0.5, 1];
            }
            for (let i = 1; i < ts.length - 1; i++) {
                allPoints.push(createPos(curve, ts[i]));
            }
        }
        allPoints.sort(comparePoss);
        // for (let pos of allPoints) {
        //     if (pos.t === 0.9978869234519733) {
        //         console.log(pos)
        //     }
        // }
        return allPoints;
    };
}
export { getInterestingPointsOnLoop };
//# sourceMappingURL=create-get-interesting-points-on-loop.js.map