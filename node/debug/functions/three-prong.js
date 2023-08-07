import { drawFs } from 'flo-draw';
import { equal, getObjClosestTo } from 'flo-vector2d';
/**
 * @internal
 * Draws 3 lines from the given 3-prong center to its 3 contact points.
 * @param n - The 3-prong's zero-based index.
 */
function drawSpokes(g, n) {
    const threeProng = _debug_.generated.elems.threeProng[n];
    const cc = threeProng.circle.center;
    const poss = threeProng.poss;
    for (let i = 0; i < poss.length; i++) {
        const pos = poss[i];
        drawFs.line(g, [pos.p, cc], 'thin5 red');
    }
}
/**
 * @internal
 * Shows the circle for each boundary iteration.
 * @param n_ - The 3-prong's zero-based index. If ommitted, all will be shown.
 * @param idx - The specific boundary iteration index to view. If ommitted, all
 * will be shown.
 */
function traceConvergence(g, n_, idx) {
    let sIndx;
    let eIndx;
    if (n_ === undefined) {
        sIndx = 0;
        eIndx = _debug_.generated.elems.threeProng.length;
    }
    else {
        sIndx = n_;
        eIndx = n_ + 1;
    }
    for (let n = sIndx; n < eIndx; n++) {
        const forDebugging = _debug_.generated.elems.threeProng[n];
        //const g = forDebugging.generated.g;
        console.log(forDebugging);
        const candidateThreeProngs = forDebugging.candidateThreeProngs;
        //-----------------------------
        //---- Get start and end index
        //-----------------------------
        let startIndx;
        let endIndx;
        if (n_ === undefined || idx === -1) {
            startIndx = forDebugging.bestIndx;
            endIndx = forDebugging.bestIndx + 1;
        }
        else {
            if (idx === undefined) {
                startIndx = 0;
                endIndx = candidateThreeProngs.length;
            }
            else {
                startIndx = idx;
                endIndx = idx + 1;
            }
        }
        //---------------------------------
        //---- Draw candidate three-prongs
        //---------------------------------
        for (let i = startIndx; i < endIndx; i++) {
            const circle = candidateThreeProngs[i].circle;
            if (forDebugging.bestIndx === i) {
                drawFs.dot(g, circle.center, 0.2, 'green');
                drawFs.circle(g, circle, 'black thin10 nofill');
            }
            else {
                drawFs.dot(g, circle.center, 0.2, 'cyan');
                drawFs.circle(g, circle, 'cyan thin5 nofill');
            }
        }
    }
}
/**
 * @internal
 * Shows the actual boundary for each iteration.
 * @param n The 3-prong's zero-based index.
 * @param idx The specific boundary iteration index to view. If ommitted will
 * show all.
 */
function showBoundary(g, n, idx) {
    const debugInfo = _debug_.generated.elems.threeProng[n];
    //const g = debugInfo.generated.g;
    const candidateThreeProngs = debugInfo.candidateThreeProngs;
    const startIndx = idx === undefined ? 0 : idx;
    const endIndx = idx === undefined ? candidateThreeProngs.length : idx;
    // Draw relevant δs
    const cpss = debugInfo.cpss;
    let j = 0;
    // For each iteration of δ3s (indexed by j)
    for (let idx = 1; idx < cpss.length - 1; idx++) {
        if (!(j >= startIndx && j <= endIndx)) {
            j++;
            continue;
        }
        const δ3s = [
            cpss[0],
            cpss[idx],
            cpss[cpss.length - 1]
        ];
        // For each of the 3 δs
        for (let i = 0; i < 3; i++) {
            const δ = δ3s[i];
            const δS = δ[0]; // Delta Start
            const δE = δ[1]; // Delta End
            const posS = δS.cp.pointOnShape;
            const posE = δE.cp.pointOnShape;
            const pS = posS.p;
            const pE = posE.p;
            const r = 1 + (i * 0.5);
            if (equal(pS, pE)) {
                drawFs.crossHair(g, pS, 'red thin10 nofill', r);
            }
            else {
                drawFs.crossHair(g, pS, 'green thin10 nofill', r);
                drawFs.crossHair(g, pE, 'blue thin10 nofill', r);
            }
        }
        j++;
    }
}
/**
 * @internal
 * @param n The 3-prong's zero-based index.
 */
function logδs(n) {
    const threeProng = _debug_.generated.elems.threeProng[n];
    console.log(threeProng.cpss);
}
/**
 * @internal
 * @param p
 */
function logNearest(showSpokes = true, showTrace = true, showBoundaries = true) {
    return function (g, p, showDelay = 1000) {
        const generated = _debug_.generated;
        const threeProng = getObjClosestTo(p, generated.elems.threeProng, threeProng => threeProng.circle ? threeProng.circle.center : [0, 0]);
        const circle = threeProng.circle;
        //const g = threeProng.generated.g;
        console.log(threeProng);
        const circle2 = {
            center: circle.center,
            radius: circle.radius || 1
        };
        //const draw = _debug_.fs.draw;
        drawFs.circle(g, circle2, 'blue thin10 nofill', showDelay);
        drawFs.crossHair(g, circle.center, 'red thin2 nofill', 2, showDelay);
        if (showSpokes) {
            drawFs.line(g, [threeProng.poss[0].p, circle.center], 'blue thin5 nofill', showDelay);
            drawFs.line(g, [threeProng.poss[1].p, circle.center], 'blue thin5 nofill', showDelay);
            drawFs.line(g, [threeProng.poss[2].p, circle.center], 'blue thin5 nofill', showDelay);
        }
        if (showBoundaries) {
            const boundaries = threeProng.boundaries;
            const boundaryS = boundaries[0];
            const boundaryE = boundaries[boundaries.length - 1];
            drawFs.beziers(g, boundaryS, 'red thin20 nofill', showDelay);
            for (let i = 1; i < boundaries.length - 1; i++) {
                const boundary = boundaries[i];
                drawFs.beziers(g, boundary, 'green thin20 nofill', showDelay);
            }
            drawFs.beziers(g, boundaryE, 'blue thin20 nofill', showDelay);
        }
        if (showTrace) {
            const traces = threeProng.traces;
            for (const trace of traces) {
                drawFs.polyline(g, trace, 'red thin5 nofill', showDelay);
            }
        }
    };
}
/** @internal */
const threeProngDebugFunctions = {
    drawSpokes,
    traceConvergence,
    showBoundary,
    logδs,
    logNearest
};
export { threeProngDebugFunctions };
//# sourceMappingURL=three-prong.js.map