"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addDebugInfo(cpNode) {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    let generated = _debug_.generated;
    generated.elems.sat.push(cpNode);
    let timing = generated.timing;
    timing.sats[1] += performance.now() - timing.sats[0];
}
exports.addDebugInfo = addDebugInfo;
