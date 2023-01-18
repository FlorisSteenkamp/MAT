import { drawFs } from 'flo-draw';
/** @hidden */
function vertex(g, cpNode, classes, delay, visible = true) {
    const visibleClass = visible ? '' : ' invisible';
    const circle = cpNode.cp.circle;
    const THIN = 'thin20';
    const cps = cpNode.getCpNodesOnCircle();
    console.log(cps);
    let $svgs = [];
    const $circle = drawFs.circle(g, circle, 'red ' + THIN + ' nofill ' + visibleClass, delay);
    const $crossHair = drawFs.crossHair(g, circle.center, 'red ' + THIN + ' nofill ' + visibleClass, 3, delay);
    $svgs = [...$circle, ...$crossHair];
    for (let i = 0; i < cps.length; i++) {
        const cp = cps[i];
        const edgeCircle = cp.next.cp.circle;
        const $circle = drawFs.circle(g, edgeCircle, 'pink ' + THIN + ' nofill ' + visibleClass, delay);
        const $crossHair = drawFs.crossHair(g, edgeCircle.center, 'pink ' + THIN + ' nofill ' + visibleClass, 3, delay);
        $svgs.push(...$circle, ...$crossHair);
        const p1 = circle.center;
        const p2 = edgeCircle.center;
        const thin = i === 0 ? 'thin10' : (i === 1 ? 'thin20' : 'thin35');
        const $line = drawFs.line(g, [p1, p2], 'yellow ' + thin + ' nofill ' + visibleClass, delay);
        $svgs.push(...$line);
    }
    return $svgs;
}
export { vertex };
//# sourceMappingURL=vertex.js.map