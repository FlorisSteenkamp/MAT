/**
 * @internal
 * @param sat
 */
function addDebugInfo(timingStart) {
    if (typeof _debug_ === 'undefined') {
        return;
    }
    const timing = _debug_.generated.timing;
    timing.sats = performance.now() - timingStart;
}
export { addDebugInfo };
//# sourceMappingURL=add-debug-info.js.map