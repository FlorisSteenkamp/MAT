"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const flo_vector2d_1 = require("flo-vector2d");
const circle_1 = require("../../circle");
/**
 * Draws 3 lines from the given 3-prong center to its 3 contact points.
 * @param n - The 3-prong's zero-based index.
 */
function drawSpokes(n) {
    let threeProng = _debug_.generated.elems.threeProng[n];
    let g = threeProng.generated.g;
    let cc = threeProng.circle.center;
    let poss = threeProng.poss;
    _debug_.fs.draw.line(g, [poss[0].p, cc], 'thin5 red');
    _debug_.fs.draw.line(g, [poss[1].p, cc], 'thin5 red');
    _debug_.fs.draw.line(g, [poss[2].p, cc], 'thin5 red');
}
/**
 * Shows the circle for each boundary iteration.
 * @param n_ - The 3-prong's zero-based index. If ommitted, all will be shown.
 * @param idx - The specific boundary iteration index to view. If ommitted, all
 * will be shown.
 */
function traceConvergence(n_, idx) {
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
        let forDebugging = _debug_.generated.elems.threeProng[n];
        let g = forDebugging.generated.g;
        console.log(forDebugging);
        let candidateThreeProngs = forDebugging.candidateThreeProngs;
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
            let circle = candidateThreeProngs[i].circle;
            if (forDebugging.bestIndx === i) {
                _debug_.fs.draw.dot(g, circle.center, 0.2, 'green');
                _debug_.fs.draw.circle(g, circle, 'black thin10 nofill');
            }
            else {
                _debug_.fs.draw.dot(g, circle.center, 0.2, 'cyan');
                _debug_.fs.draw.circle(g, circle, 'cyan thin5 nofill');
            }
        }
    }
}
/**
 * Shows the actual boundary for each iteration.
 * @param n The 3-prong's zero-based index.
 * @param idx The specific boundary iteration index to view. If ommitted will
 * show all.
 */
function showBoundary(n, idx) {
    let debugInfo = _debug_.generated.elems.threeProng[n];
    let g = debugInfo.generated.g;
    let candidateThreeProngs = debugInfo.candidateThreeProngs;
    let startIndx = idx === undefined ? 0 : idx;
    let endIndx = idx === undefined ? candidateThreeProngs.length : idx;
    // Draw relevant δs
    let cpss = debugInfo.cpss;
    let j = 0;
    // For each iteration of δ3s (indexed by j)
    for (let idx = 1; idx < cpss.length - 1; idx++) {
        if (!(j >= startIndx && j <= endIndx)) {
            j++;
            continue;
        }
        let δ3s = [
            cpss[0],
            cpss[idx],
            cpss[cpss.length - 1]
        ];
        // For each of the 3 δs
        for (let i = 0; i < 3; i++) {
            let δ = δ3s[i];
            let δS = δ[0]; // Delta Start
            let δE = δ[1]; // Delta End
            let posS = δS.cp.pointOnShape;
            let posE = δE.cp.pointOnShape;
            let pS = posS.p;
            let pE = posE.p;
            let r = 1 + (i * 0.5);
            if (flo_vector2d_1.equal(pS, pE)) {
                _debug_.fs.draw.crossHair(g, pS, 'red thin10 nofill', r);
            }
            else {
                _debug_.fs.draw.crossHair(g, pS, 'green thin10 nofill', r);
                _debug_.fs.draw.crossHair(g, pE, 'blue thin10 nofill', r);
            }
        }
        j++;
    }
}
/**
 * @param n The 3-prong's zero-based index.
 */
function logδs(n) {
    let threeProng = _debug_.generated.elems.threeProng[n];
    console.log(threeProng.cpss);
}
/**
 *
 * @param p
 */
function logNearest(showSpokes = true, showTrace = true, showBoundaries = true) {
    return function (p, showDelay = 1000) {
        let closestPerLoops = [];
        _debug_.generatedAll.forEach(function (generated) {
            let threeProng = flo_vector2d_1.getObjClosestTo(p, generated.elems.threeProng, threeProng => threeProng.circle.center);
            closestPerLoops.push(threeProng);
        });
        let threeProng = flo_vector2d_1.getObjClosestTo(p, closestPerLoops, threeProng => threeProng.circle.center);
        let circle = threeProng.circle;
        let g = threeProng.generated.g;
        console.log(threeProng);
        let circle2 = new circle_1.Circle(circle.center, circle.radius || 1);
        let draw = _debug_.fs.draw;
        draw.circle(g, circle2, 'blue thin10 nofill', showDelay);
        draw.crossHair(g, circle.center, 'red thin2 nofill', 2, showDelay);
        if (showSpokes) {
            draw.line(g, [threeProng.poss[0].p, circle.center], 'blue thin5 nofill', showDelay);
            draw.line(g, [threeProng.poss[1].p, circle.center], 'blue thin5 nofill', showDelay);
            draw.line(g, [threeProng.poss[2].p, circle.center], 'blue thin5 nofill', showDelay);
        }
        if (showBoundaries) {
            let boundaries = threeProng.boundaries;
            let boundaryS = boundaries[0];
            let boundaryE = boundaries[boundaries.length - 1];
            draw.beziers(g, boundaryS, 'red thin5 nofill', showDelay);
            for (let i = 1; i < boundaries.length - 1; i++) {
                let boundary = boundaries[i];
                draw.beziers(g, boundary, 'green thin5 nofill', showDelay);
            }
            draw.beziers(g, boundaryE, 'blue thin5 nofill', showDelay);
        }
        if (showTrace) {
            let traces = threeProng.traces;
            for (let trace of traces) {
                draw.polyline(g, trace, 'red thin5 nofill', showDelay);
            }
        }
    };
}
let threeProngDebugFunctions = {
    drawSpokes,
    traceConvergence,
    showBoundary,
    logδs,
    logNearest
};
exports.threeProngDebugFunctions = threeProngDebugFunctions;
//# sourceMappingURL=three-prong.js.map