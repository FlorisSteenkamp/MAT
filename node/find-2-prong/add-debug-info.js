import { getTwoProngType } from '../mat/get-two-prong-type.js';
/** @internal */
function addDebugInfo(bezierPieces, failed, x, y, z, circle, δ, xs, holeClosing) {
    xs.push({ x, y, z, t: y.t });
    const twoProng = {
        generated: _debug_.generated,
        bezierPieces,
        pos: y,
        δ,
        z: z ? z.p : undefined,
        circle,
        xs,
        failed,
        holeClosing,
        notAdded: false,
        deleted: false,
        cpNode: undefined
    };
    const twoProngType = getTwoProngType(twoProng);
    _debug_.generated.elems[twoProngType].push(twoProng);
}
export { addDebugInfo };
//# sourceMappingURL=add-debug-info.js.map