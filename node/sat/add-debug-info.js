/**
 * @param sat
 *
 * @internal
 */
function addDebugInfo(timingStart) {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    _debug_.timing.sats = performance.now() - timingStart;
}
export { addDebugInfo };
//# sourceMappingURL=add-debug-info.js.map