
/** @hidden */
declare var _debug_: MatDebug; 

import { MatDebug }   from '../../debug/debug';
import { getBoundingHull, getBoundingBox, getBoundingBoxTight } from 'flo-bezier3';
import { Loop } from '../../loop';
import { PointOnShape } from '../../point-on-shape';
import { Curve } from '../../curve';
import { Mat } from '../../mat';


/** @hidden */
function addDebugInfo1(loops: Loop[]) {
    if (typeof _debug_ === 'undefined') { return; }
    
    for (let loop of loops) {
        _debug_.fs.nameObj(loop,'l|');
    }

    let generated = _debug_.generated;

    generated.timing.holeClosers[0] = performance.now(); 

    generated.elems.loop.push(...loops);
    generated.elems.loops.push(loops);

    for (let loop of loops) {
        let i = 0;
        loop.curves.forEach(function(curve: Curve) {
            let ps = curve.ps;
            let hull = getBoundingHull(ps); 

            generated.elems.boundingHull.push(hull);

            let looseBoundingBox = getBoundingBox(ps);
            generated.elems.looseBoundingBox.push(looseBoundingBox);

            let tightBoundingBox = getBoundingBoxTight(ps);
            generated.elems.tightBoundingBox.push(tightBoundingBox);

            let corner = Curve.getCornerAtEnd(curve);
            if (corner.isSharp) {
                generated.elems.sharpCorner.push(curve);
            } else if (corner.isDull) {
                generated.elems.dullCorner.push(curve);
            }

            i++;
        });
    }
}


/** @hidden */
function addDebugInfo2(pointOnShapeArrPerLoop: PointOnShape[][]) {
    if (typeof _debug_ === 'undefined') { return; }

    let generated = _debug_.generated;
    let timing = generated.timing;
    let now = performance.now();
    timing.holeClosers[1] += now - timing.holeClosers[0];
    timing.oneAnd2Prongs[0] = now;

    /*
    for (let pointsOnShape of pointOnShapeArrPerLoop) {
        for (let pos of pointsOnShape) {
            if (PointOnShape.isSharpCorner(pos)) {
                generated.elems.sharpCorner.push(pos);
            } else if (PointOnShape.isDullCorner(pos)) {
                generated.elems.dullCorner.push(pos);
            }
        }
    }
    */
}


function addDebugInfo3() {
    if (typeof _debug_ === 'undefined') { return; }

    let generated = _debug_.generated;
    let timing = generated.timing;
    let now = performance.now();

    timing.oneAnd2Prongs[1] += now - timing.oneAnd2Prongs[0];
    timing.threeProngs[0] = now;
}


function addDebugInfo4(mat: Mat) {
    if (typeof _debug_ === 'undefined') { return; }

    let generated = _debug_.generated;
    let timing = generated.timing;

    generated.elems.mat.push(mat);

    timing.threeProngs[1] += performance.now() - timing.threeProngs[0];
    timing.mats[1] = 
        timing.holeClosers[1] + 
        timing.oneAnd2Prongs[1] +
        timing.threeProngs[1];
}


export { addDebugInfo1, addDebugInfo2, addDebugInfo3, addDebugInfo4 }
