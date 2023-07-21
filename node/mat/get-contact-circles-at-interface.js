import { getCornerAtEnd } from '../curve.js';
import { createPos } from '../point-on-shape/create-pos.js';
/**
 * @internal
 * @param curve
 */
function getContactCirclesAtInterface(curve) {
    const { isQuiteSharp, isQuiteDull } = getCornerAtEnd(curve);
    return isQuiteSharp
        ? [createPos(curve, 1)]
        : isQuiteDull
            ? [createPos(curve, 1),
                createPos(curve.next, 0)]
            : [];
}
export { getContactCirclesAtInterface };
//# sourceMappingURL=get-contact-circles-at-interface.js.map