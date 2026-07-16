import { getOsculatingCircle } from '../point-on-shape/get-osculating-circle.js';
const { sqrt } = Math;
/**
 *
 * @param angle
 * @param isHoleClosing `true` if this is a hole-closing two-prong, `false` otherwise
 * @param maxOscRadius the maximum that the osculating circle radius can be
 * @param yPos the source point of the 2-prong to be found
 *
 * @internal
*/
function getInitialX(angle, isHoleClosing, maxOscRadius, yPos, nnorm) {
    let xO;
    let rO;
    const { p: y } = yPos;
    if (isHoleClosing) {
        return [
            [y[0], y[1] - maxOscRadius], // xO
            maxOscRadius // rO
        ];
    }
    if (angle === 0) {
        return getOsculatingCircle(maxOscRadius, yPos, nnorm);
    }
    const { p } = yPos;
    const [tx, ty] = nnorm;
    const l = sqrt(tx * tx + ty * ty);
    const scale = maxOscRadius / l;
    const v = [tx * scale, ty * scale];
    xO = [p[0] + v[0], p[1] + v[1]];
    rO = maxOscRadius;
    return [xO, rO];
}
export { getInitialX };
//# sourceMappingURL=get-initial-x.js.map