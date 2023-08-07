import { memoize } from 'flo-memoize';
import { getCorner } from '../corner/get-corner.js';
/**
 * @internal
 * Returns information about the corner created at the end of this curve
 * (at t === 1) and the start of the next curve (at t === 0).
 */
const getCornerAtEnd = memoize(function (curve) {
    const psE = curve.ps;
    const psS = curve.next.ps;
    return getCorner(psE, psS);
});
export { getCorner, getCornerAtEnd };
//# sourceMappingURL=curve.js.map