import { getTwoProngType } from '../../get-two-prong-type.js';
/** @hidden */
function addDebugInfo(bezierPieces, failed, pos, circle, z, δ, xs, holeClosing) {
    const twoProng = {
        generated: _debug_.generated,
        bezierPieces,
        pos,
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