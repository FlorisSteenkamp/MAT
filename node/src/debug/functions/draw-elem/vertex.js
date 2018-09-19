"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function vertex(g, cpNode, visible = true, displayDelay) {
    let visibleClass = visible ? '' : ' invisible';
    let circle = cpNode.cp.circle;
    let draw = _debug_.fs.draw;
    const THIN = 'thin20';
    let cps = cpNode.getCps();
    console.log(cps);
    let $svgs = [];
    let $circle = draw.circle(g, circle, 'red ' + THIN + ' nofill ' + visibleClass, displayDelay);
    let $crossHair = draw.crossHair(g, circle.center, 'red ' + THIN + ' nofill ' + visibleClass, 3, displayDelay);
    $svgs = [...$circle, ...$crossHair];
    for (let i = 0; i < cps.length; i++) {
        let cp = cps[i];
        let edgeCircle = cp.next.cp.circle;
        let $circle = draw.circle(g, edgeCircle, 'pink ' + THIN + ' nofill ' + visibleClass, displayDelay);
        let $crossHair = draw.crossHair(g, edgeCircle.center, 'pink ' + THIN + ' nofill ' + visibleClass, 3, displayDelay);
        $svgs.push(...$circle, ...$crossHair);
        let p1 = circle.center;
        let p2 = edgeCircle.center;
        let thin = i === 0 ? 'thin10' : (i === 1 ? 'thin20' : 'thin35');
        let $line = draw.line(g, [p1, p2], 'yellow ' + thin + ' nofill ' + visibleClass, displayDelay);
        $svgs.push(...$line);
    }
    return $svgs;
}
exports.vertex = vertex;
