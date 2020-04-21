"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @hidden
 * @param sat
 */
function addDebugInfo(sat, timingStart) {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    _debug_.generated.elems.sat.push(sat);
    let timing = _debug_.generated.timing;
    timing.sats = performance.now() - timingStart;
}
exports.addDebugInfo = addDebugInfo;
//# sourceMappingURL=add-debug-info.js.map