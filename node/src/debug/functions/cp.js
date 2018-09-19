"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Logs the currently selected ContactPoint.
 * @memberOf d.fs.cp
 */
function log() {
    let cpNode = _debug_.state.selectedCp;
    let cp = cpNode.cp;
    console.log(cpNode);
    console.log(cp.pointOnShape.toString());
}
/**
 * Select next contact point on shape boundary.
 * @memberOf d.fs.cp
 */
function next() {
    _debug_.state.selectedCp = _debug_.state.selectedCp.next;
}
/**
 * Select prev contact point on 3-prong circle.
 * @memberOf d.fs.cp
 */
function prevOnCircle() {
    _debug_.state.selectedCp = _debug_.state.selectedCp.prevOnCircle;
}
/**
 * Draw selected contact point as crosshair.
 * @memberOf d.fs.cp
 */
function draw() {
    _debug_.fs.draw.crossHair(_debug_.state.selectedCp.cp.pointOnShape.p, 'blue thin5 nofill', 1);
}
/**
* Contact Point debug functions. Changes the state of
* the global window._debug_ object by keeping track of the currently selected contact point.
* @namespace cp
* @memberOf d.fs
*/
let cpDebugFunctions = {
    log,
    next,
    prevOnCircle,
    draw
};
exports.cpDebugFunctions = cpDebugFunctions;
