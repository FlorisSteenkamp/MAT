import { getLoopsMetrics } from '../loop/get-max-coordinate.js';
function getSizeParams(bezierLoops, maxCurviness, maxLength) {
    // Gather some shape metrics
    const { maxCoordinate, maxRadius } = getLoopsMetrics(bezierLoops);
    const expMax = Math.ceil(Math.log2(maxCoordinate));
    const minBezLengthSigBits = 16;
    /**
     * If a curve is shorter than this value then no points on it will be
     * selected for the purpose of finding the MAT.
     */
    const minBezLength = 2 ** expMax * 2 ** (-minBezLengthSigBits);
    // Limit the tolerance to a reasonable level
    if (maxCurviness < 0.05) {
        maxCurviness = 0.05;
    }
    if (maxCurviness > 3) {
        maxCurviness = 3;
    }
    // Limit the tolerance to a reasonable level
    if (maxLength < 0.1) {
        maxLength = 0.1;
    }
    if (maxLength > 100) {
        maxLength = 100;
    }
    // Adjust length tolerance according to a reference max coordinate
    const expMaxRadius = Math.ceil(Math.log2(maxRadius));
    const maxLengthSigBits = 10; // 1024 x 1024
    maxLength = maxLength * (2 ** expMaxRadius * 2 ** (-maxLengthSigBits));
    return { maxCurviness, maxLength, maxCoordinate, minBezLength };
}
export { getSizeParams };
//# sourceMappingURL=get-size-params.js.map