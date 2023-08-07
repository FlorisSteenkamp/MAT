import { drawFs } from 'flo-draw';
import { getObjClosestTo, distanceBetween, squaredDistanceBetween } from 'flo-vector2d';
/**
 * @internal
 */
function logδ(n, type = 'twoProng_regular') {
    const δ = _debug_.generated.elems[type][n].δ;
    console.log(δ);
}
/**
 * @internal
 */
function log(n, type = 'twoProng_regular') {
    const twoProng = _debug_.generated.elems[type][n];
    console.log(twoProng);
}
/**
 * @internal
 */
function drawNormal(g, twoProng, showDelay = 1000) {
    drawFs.line(g, [twoProng.pos.p, twoProng.circle.center], 'thin10 blue', showDelay);
}
/**
 * @internal
 */
function logδBasic(n, type = 'twoProng_regular') {
    const delta = _debug_.generated.elems[type][n].δ;
    function logδBasic_(x) {
        const pos = x.cp.pointOnShape;
        return {
            bez: pos.curve.ps,
            t: pos.t
        };
    }
    console.log(logδBasic_(delta[0]));
    console.log(logδBasic_(delta[1]));
}
/**
 * @internal
 * Draws 3 lines from the given 3-prong center to its 3 contact points.
 * @param n - The 3-prong's zero-based index.
 */
function drawSpokes(g, twoProng, showDelay = 1000) {
    const cc = twoProng.circle.center;
    const { pos, circle, cpNode, xs, z, δ } = twoProng;
    drawFs.line(g, [pos.p, cc], 'thin5 red', showDelay);
    drawFs.line(g, [z, cc], 'thin5 red', showDelay);
}
/**
 * @internal
 */
function logNearest(showSpokes, showTrace, showBoundaries) {
    return (g, p, showDelay = 1000, scale = 1) => {
        const closestPerLoops = [];
        const generated = _debug_.generated;
        const twoProng = getObjClosestTo(p, 
        // generated.elems[type], 
        generated.elems['twoProng_regular'], twoProng => twoProng.circle.center);
        closestPerLoops.push(twoProng);
        console.log(twoProng);
        let n;
        //for (let i=0; i<_debug_.generated.elems[type].length; i++) {
        //	const twoProng_ = _debug_.generated.elems[type][i];
        for (let i = 0; i < _debug_.generated.elems['twoProng_regular'].length; i++) {
            const twoProng_ = _debug_.generated.elems['twoProng_regular'][i];
            if (twoProng_ === twoProng) {
                n = i;
                break;
            }
        }
        if (showSpokes) {
            drawSpokes(g, twoProng, showDelay);
        }
        if (n !== undefined && showTrace) {
            traceConvergence(g, twoProng, showDelay, scale);
        }
    };
}
/**
 * @internal
 * @param n - The 2-prong's zero-based index.
 * @param range
 */
function traceConvergence(g, twoProng, showDelay = 1000, scale = 1) {
    const xs = twoProng.xs;
    console.log(twoProng);
    console.log(twoProng.xs.map(x => ({
        x: x.x,
        y: x.y,
        z: x.z,
        d: x.z ? squaredDistanceBetween(x.y.p, x.z.p) : 0,
        t: x.t,
    })));
    console.log(xs.length);
    for (let i = 0; i < xs.length; i++) {
        const x = twoProng.xs[i];
        const circle = { center: x.x, radius: distanceBetween(x.x, x.y.p) };
        drawFs.crossHair(g, x.x, 'red thin10 nofill', 0.002 * scale, showDelay);
        drawFs.circle(g, circle, 'blue thin10 nofill', showDelay);
        if (x.z !== undefined) {
            drawFs.crossHair(g, x.z.p, 'yellow thin10 nofill', 0.001 * scale, showDelay);
        }
    }
    // twoProngDebugFunctions.drawNormal(g, twoProng, showDelay);
}
/** @internal */
const twoProngDebugFunctions = {
    logδ,
    log,
    drawNormal,
    logδBasic,
    traceConvergence,
    logNearest,
};
export { twoProngDebugFunctions };
//# sourceMappingURL=two-prong.js.map