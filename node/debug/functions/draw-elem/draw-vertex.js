import { drawFs } from 'flo-draw';
import { CpNodeFs } from '../../../cp-node/cp-node-fs.js';
const { getAllOnCircle } = CpNodeFs;
/** @internal */
function vertex(g, cpNode, classes, delay = 0, scaleFactor = 1) {
    const circle = cpNode.cp.circle;
    let $svgs = [];
    // const $circle = drawFs.circle(g, circle, 'red ' + THIN + ' nofill ', delay);
    // const $crossHair = drawFs.crossHair(g, circle.center, 'red ' + THIN + ' nofill ', 3, delay);
    const $dot = drawFs.dot(g, circle.center, 0.01 * scaleFactor, 'darkgreen', delay);
    $svgs = [...$dot];
    return $svgs;
}
export { vertex };
//# sourceMappingURL=draw-vertex.js.map