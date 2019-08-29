"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const circle_1 = require("../../circle");
const flo_vector2d_1 = require("flo-vector2d");
/**
 * @hidden
 */
function logδ(n, type = 'twoProng_regular') {
    let δ = _debug_.generated.elems[type][n].δ;
    console.log(δ);
}
/**
 * @hidden
 */
function log(n, type = 'twoProng_regular') {
    let twoProng = _debug_.generated.elems[type][n];
    console.log(twoProng);
}
/**
 * @hidden
 */
function drawNormal(n, showDelay = 1000, type = 'twoProng_regular') {
    let twoProngs = _debug_.generated.elems[type];
    // If not specified which, draw all
    if (n === undefined) {
        for (let i = 0; i < twoProngs.length; i++) {
            drawNormal(i);
        }
    }
    let twoProng = twoProngs[n];
    let g = twoProng.generated.g;
    if (!twoProng) {
        return;
    }
    _debug_.fs.draw.line(g, [twoProng.pos.p, twoProng.circle.center], 'thin10 blue', showDelay);
}
/**
 * @hidden
 */
function logδBasic(n, type = 'twoProng_regular') {
    let delta = _debug_.generated.elems[type][n].δ;
    function f(x) {
        let pos = x.cp.pointOnShape;
        return {
            bez: pos.curve.ps,
            t: pos.t
        };
    }
    console.log(f(delta[0]));
    console.log(f(delta[1]));
}
/**
 * @hidden
 */
function logNearest(p, showDelay = 1000, type = 'twoProng_regular') {
    let closestPerLoops = [];
    let generated = _debug_.generated;
    let twoProng = flo_vector2d_1.getObjClosestTo(p, generated.elems[type], twoProng => twoProng.circle.center);
    closestPerLoops.push(twoProng);
    console.log(twoProng);
    let n;
    for (let i = 0; i < _debug_.generated.elems[type].length; i++) {
        let twoProng_ = _debug_.generated.elems[type][i];
        if (twoProng_ === twoProng) {
            n = i;
            break;
        }
    }
    if (n !== undefined) {
        traceConvergence(n, true, showDelay);
    }
}
/**
 * @hidden
 * @param n - The 2-prong's zero-based index.
 * @param range
 */
function traceConvergence(n, finalOnly, showDelay = 1000, range = undefined, type = 'twoProng_regular') {
    if (n === undefined) {
        return;
    }
    let twoProngInfo = _debug_.generated.elems[type][n];
    let xs = twoProngInfo.xs;
    let g = twoProngInfo.generated.g;
    console.log(twoProngInfo);
    console.log(twoProngInfo.xs.map(x => ({
        x: x.x,
        y: x.y,
        z: x.z,
        d: x.z ? flo_vector2d_1.squaredDistanceBetween(x.y.p, x.z.p) : 0,
        t: x.t,
    })));
    for (let i = 0; i < xs.length; i++) {
        if (range && (i < range[0] || i >= range[1])) {
            continue;
        }
        if (finalOnly && i !== xs.length - 1) {
            continue;
        }
        let x = twoProngInfo.xs[i];
        let circle = new circle_1.Circle(x.x, flo_vector2d_1.distanceBetween(x.x, x.y.p));
        _debug_.fs.draw.crossHair(g, x.x, 'red thin10 nofill', undefined, showDelay);
        _debug_.fs.draw.circle(g, circle, 'blue thin10 nofill', showDelay);
        if (x.z !== undefined) {
            _debug_.fs.draw.crossHair(g, x.z.p, 'yellow thin10 nofill', 2, showDelay);
        }
    }
    twoProngDebugFunctions.drawNormal(n, showDelay);
}
/** @hidden */
let twoProngDebugFunctions = {
    logδ,
    log,
    drawNormal,
    logδBasic,
    traceConvergence,
    logNearest,
};
exports.twoProngDebugFunctions = twoProngDebugFunctions;
//# sourceMappingURL=two-prong.js.map