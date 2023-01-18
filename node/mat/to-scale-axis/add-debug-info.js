/**
 * @hidden
 * @param sat
 */
function addDebugInfo(sat, timingStart) {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    _debug_.generated.elems.sat.push(sat);
    const timing = _debug_.generated.timing;
    timing.sats = performance.now() - timingStart;
}
export { addDebugInfo };
//# sourceMappingURL=add-debug-info.js.map