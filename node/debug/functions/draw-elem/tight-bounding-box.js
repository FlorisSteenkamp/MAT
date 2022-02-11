import { drawFs } from 'flo-draw';
/** @hidden */
function tightBoundingBox(g, box) {
    let $box = drawFs.polygon(g, box, 'thin5 pinker nofill');
    return $box;
}
export { tightBoundingBox };
//# sourceMappingURL=tight-bounding-box.js.map