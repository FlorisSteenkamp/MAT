"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("../debug");
const point_on_shape_1 = require("../../mat/classes/point-on-shape");
function drawVertex(vertex, visible = true, displayDelay) {
    let visibleClass = visible ? '' : ' invisible';
    let circle = vertex.circle;
    let draw = _debug_.fs.draw;
    const THIN = 'thin20';
    draw.circle(circle, 'red ' + THIN + ' nofill ' + visibleClass, displayDelay);
    draw.crossHair(circle.center, 'red ' + THIN + ' nofill ' + visibleClass, 3, displayDelay);
    let edges = vertex.getEdges();
    for (let i = 0; i < edges.length; i++) {
        //for (let i=0; i<vertex.cps.length; i++) {		
        let edge = edges[i];
        let edgeCircle = edge.toVertex.circle;
        /*
        let cp = vertex.cps[i];
        if (cp.item.vertex === cp.next.item.vertex) {
            continue;
        }
        let edge = new Edge(cp, cp.next);
        let edgeCircle = edge.toVertex.circle;*/
        draw.circle(edgeCircle, 'pink ' + THIN + ' nofill ' + visibleClass, displayDelay);
        draw.crossHair(edgeCircle.center, 'pink ' + THIN + ' nofill ' + visibleClass, 3, displayDelay);
        let p1 = circle.center;
        let p2 = edgeCircle.center;
        let thin = i === 0 ? 'thin10' : (i === 1 ? 'thin20' : 'thin35');
        draw.line([p1, p2], 'yellow ' + thin + ' nofill ' + visibleClass, displayDelay);
    }
}
function draw2Prong(twoProng, visible = true) {
    let visibleClass = visible ? '' : ' invisible';
    //let scaleFactor = width/200;		
    let scaleFactor = 1;
    let $failedDot = undefined;
    let $center = undefined;
    let $circle = undefined;
    let $cp1 = undefined;
    let $cp2 = undefined;
    let color;
    let thin;
    let draw = _debug_.fs.draw;
    switch (_debug_.fs.elemType.twoProngs(twoProng)) {
        case debug_1.ElemType_TwoProng.failed: {
            $failedDot = draw.dot(twoProng.pos.p, 1 * scaleFactor, 'black ' + visibleClass);
            return;
        }
        case debug_1.ElemType_TwoProng.deleted: {
            color = 'gray ';
            thin = '2';
            break;
        }
        case debug_1.ElemType_TwoProng.notAdded: {
            color = 'brown ';
            thin = '10';
            break;
        }
        case debug_1.ElemType_TwoProng.holeClosing: {
            color = 'cyan ';
            thin = '10';
            break;
        }
        case debug_1.ElemType_TwoProng.standard: {
            color = 'red ';
            thin = '2';
            break;
        }
    }
    if (twoProng.failed /* && drawFailed*/) {
        $failedDot = draw.dot(twoProng.pos.p, 1 * scaleFactor, 'black ' + visibleClass);
    }
    else if (!twoProng.failed /* && !drawFailed*/) {
        //$center = draw.dot   (twoProng.circle.center, 0.5*scaleFactor, 'yellow ' + visibleClass);
        $center = draw.dot(twoProng.circle.center, 0.05 * scaleFactor, 'yellow ' + visibleClass);
        $circle = draw.circle(twoProng.circle, color + 'thin' + thin + ' nofill ' + visibleClass);
        //$cp1    = draw.dot   (twoProng.pos, 0.55*scaleFactor, color + visibleClass);
        //$cp2    = draw.dot   (twoProng.z, 0.7*scaleFactor, color + visibleClass);	
        $cp1 = draw.dot(twoProng.pos.p, 0.055 * scaleFactor, color + visibleClass);
        $cp2 = draw.dot(twoProng.z, 0.07 * scaleFactor, color + visibleClass);
    }
    return { $failedDot, $center, $circle, $cp1, $cp2 };
}
function drawExtreme(extreme, visible = true) {
    let visibleClass = visible ? '' : ' invisible';
    let { $circle, $l1, $l2 } = _debug_.fs.draw.crossHair(extreme.p, 'red thin10 nofill ' + visibleClass);
    return { $circle, $l1, $l2 };
}
function drawBoundingHull(hull, visible = true, style = 'thin5 black nofill') {
    let visibleClass = visible ? '' : ' invisible';
    let $polygon = _debug_.fs.draw.polygon(hull, style + visibleClass);
    return { $polygon };
}
function drawLooseBoundingBox(box, visible = true) {
    let visibleClass = visible ? '' : ' invisible';
    let $box = _debug_.fs.draw.looseBoundingBox(box, 'thin5 brown nofill ' + visibleClass);
    return { $box };
}
function drawTightBoundingBox(box, visible = true) {
    let visibleClass = visible ? '' : ' invisible';
    let $box = _debug_.fs.draw.tightBoundingBox(box, 'thin5 black nofill ' + visibleClass);
    return { $box };
}
function draw1Prong(pos, visible = true) {
    let visibleClass = visible ? '' : ' invisible';
    const scaleFactor = 1;
    let oCircle = point_on_shape_1.PointOnShape.getOsculatingCircle(pos);
    let $center = _debug_.fs.draw.dot(pos.p, 0.1 * scaleFactor, 'gray ' + visibleClass);
    let $circle = _debug_.fs.draw.dot(oCircle.center, 0.25 * scaleFactor, 'gray ' + visibleClass);
    let $pos = _debug_.fs.draw.circle(oCircle, 'gray thin10 nofill ' + visibleClass);
    return { $center, $circle, $pos };
}
function draw1ProngAtDullCorner(pos, visible = true) {
    let visibleClass = visible ? '' : ' invisible';
    const scaleFactor = 1;
    let oCircle = point_on_shape_1.PointOnShape.getOsculatingCircle(pos);
    let $center = _debug_.fs.draw.dot(pos.p, 0.1 * scaleFactor, 'orange ' + visibleClass);
    let $circle = _debug_.fs.draw.dot(oCircle.center, 0.25 * scaleFactor, 'orange ' + visibleClass);
    let $pos = _debug_.fs.draw.circle(oCircle, 'orange thin10 nofill ' + visibleClass);
    return { $center, $circle, $pos };
}
function draw3Prong(threeProng, visible = true) {
    let visibleClass = visible ? '' : ' invisible';
    const scaleFactor = 1;
    let poss = threeProng.poss;
    let $cp1 = _debug_.fs.draw.dot(poss[0].p, 0.1 * 1 * scaleFactor, 'blue ' + visibleClass);
    let $cp2 = _debug_.fs.draw.dot(poss[1].p, 0.1 * 2 * scaleFactor, 'blue ' + visibleClass);
    let $cp3 = _debug_.fs.draw.dot(poss[2].p, 0.1 * 3 * scaleFactor, 'blue ' + visibleClass);
    let $center = _debug_.fs.draw.dot(threeProng.circle.center, 0.3 * scaleFactor, 'blue ' + visibleClass);
    let $circle = _debug_.fs.draw.circle(threeProng.circle, 'blue thin2 nofill ' + visibleClass);
    return { $center, $cp1, $cp2, $cp3, $circle };
}
function drawSharpCorner(pos, visible = true) {
    let visibleClass = visible ? '' : ' invisible';
    const scaleFactor = 1;
    let $pos = _debug_.fs.draw.dot(pos.p, 0.6 * scaleFactor, 'green ' + visibleClass);
    return { $pos };
}
function drawDullCorner(pos, visible = true) {
    let visibleClass = visible ? '' : ' invisible';
    const scaleFactor = 1;
    let $pos = _debug_.fs.draw.dot(pos.p, 0.5 * scaleFactor, 'orange ' + visibleClass);
    return { $pos };
}
let drawElemFunctions /*: IDrawElemFunctions*/ = {
    draw1Prong,
    draw1ProngAtDullCorner,
    draw2Prong,
    draw3Prong,
    drawExtreme,
    drawBoundingHull,
    drawLooseBoundingBox,
    drawTightBoundingBox,
    drawSharpCorner,
    drawDullCorner,
    drawVertex
};
exports.drawElemFunctions = drawElemFunctions;
