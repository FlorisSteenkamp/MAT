import { getCornerAtEnd } from '../curve.js';
import { PointOnShape } from '../point-on-shape.js';
/**
 * @hidden
 * @param curve
 */
function getContactCirclesAtInterface(curve) {
    let { isQuiteSharp, isQuiteDull } = getCornerAtEnd(curve);
    if (isQuiteSharp) {
        return [new PointOnShape(curve, 1)];
    }
    else if (isQuiteDull) {
        return [
            new PointOnShape(curve, 1),
            new PointOnShape(curve.next, 0)
        ];
    }
    return [];
}
export { getContactCirclesAtInterface };
//# sourceMappingURL=get-contact-circles-at-interface.js.map