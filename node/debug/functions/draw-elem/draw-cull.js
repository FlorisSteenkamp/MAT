import { drawFs } from "flo-draw";
/** @internal */
function drawCull(g, cull, classes = 'thin10 cyan nofill', delay = 0, scaleFactor = 1) {
    const $elems = [];
    $elems.push(...drawFs.crossHair(g, cull, classes, 0.1 * scaleFactor, delay));
    return $elems;
}
export { drawCull };
//# sourceMappingURL=draw-cull.js.map