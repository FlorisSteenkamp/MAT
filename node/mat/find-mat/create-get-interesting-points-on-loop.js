import { getCurvatureExtrema, splitByCurvatureAndLength, controlPointLinesLength } from 'flo-bezier3';
import { getContactCirclesAtInterface } from '../get-contact-circles-at-interface.js';
import { PointOnShape, comparePoss } from '../../point-on-shape.js';
/**
 * @hidden
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
            // qqq if (lengthSquaredUpperBound(curve.ps) < minBezLength) {
            if (controlPointLinesLength(curve.ps) < minBezLength) {
                continue;
            }
            /*
            let { maxCurvatureTs, maxNegativeCurvatureTs } =
                getCurvatureExtrema(curve.ps);
            let maxCurvatures = maxCurvatureTs.map(t => new PointOnShape(curve, t));
            let maxNegativeCurvatures = maxNegativeCurvatureTs.map(t => new PointOnShape(curve, t));

            allPoints.push(
                ...getContactCirclesAtInterface(curve),
                ...maxCurvatures,
                ...maxNegativeCurvatures
            );
            */
            // let { maxima } = getCurvatureExtrema(curve.ps);
            // qqq let { maxCurvatureTs, maxNegativeCurvatureTs } = getCurvatureExtrema(curve.ps);
            const { maxima } = getCurvatureExtrema(curve.ps);
            // let maxAbsCurvatures = maxima.map(t => new PointOnShape(curve, t));
            // qqq let maxAbsCurvatures = [...maxCurvatureTs, ...maxNegativeCurvatureTs].map(t => new PointOnShape(curve, t));
            const maxAbsCurvatures = [...maxima].map(t => new PointOnShape(curve, t));
            allPoints.push(...getContactCirclesAtInterface(curve), ...maxAbsCurvatures);
            const ts = splitByCurvatureAndLength(curve.ps, maxCurviness, maxLength);
            // if (ts.length > 10) { console.log(ts); }
            // if (ts.length === 2) {
            //     ts = [0, 0.5, 1];
            // }
            for (let i = 1; i < ts.length - 1; i++) {
                allPoints.push(new PointOnShape(curve, ts[i]));
            }
        }
        allPoints.sort(comparePoss);
        return allPoints;
    };
}
export { getInterestingPointsOnLoop };
//# sourceMappingURL=create-get-interesting-points-on-loop.js.map