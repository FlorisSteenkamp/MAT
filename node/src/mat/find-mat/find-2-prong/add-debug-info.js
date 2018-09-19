"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const two_prong_for_debugging_1 = require("../../../debug/two-prong-for-debugging");
const get_two_prong_type_1 = require("../../get-two-prong-type");
function addDebugInfo(bezierPieces, failed, pos, circle, z, δ, xs, holeClosing) {
    let twoProng = new two_prong_for_debugging_1.TwoProngForDebugging(_debug_.generated, bezierPieces, pos, δ, z ? z.p : undefined, circle, xs, failed, holeClosing, false, false);
    let twoProngType = get_two_prong_type_1.getTwoProngType(twoProng);
    _debug_.generated.elems[twoProngType].push(twoProng);
}
exports.addDebugInfo = addDebugInfo;
