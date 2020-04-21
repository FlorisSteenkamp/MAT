"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_two_prong_type_1 = require("../../get-two-prong-type");
/** @hidden */
function addDebugInfo(bezierPieces, failed, pos, circle, z, δ, xs, holeClosing) {
    let twoProng = {
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
    let twoProngType = get_two_prong_type_1.getTwoProngType(twoProng);
    _debug_.generated.elems[twoProngType].push(twoProng);
}
exports.addDebugInfo = addDebugInfo;
//# sourceMappingURL=add-debug-info.js.map