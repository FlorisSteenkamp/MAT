"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @hidden
 * @param sat
 */
function addDebugInfo(sat) {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    let generated = _debug_.generated;
    generated.elems.sat.push(sat);
    let timing = generated.timing;
    timing.sats[1] += performance.now() - timing.sats[0];
}
exports.addDebugInfo = addDebugInfo;
//# sourceMappingURL=add-debug-info.js.map