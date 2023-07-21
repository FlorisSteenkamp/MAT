import { drawFs } from 'flo-draw';
/** @internal */
function boundingHull(g, hull, classes = 'thin5 black nofill', delay = 0, scaleFactor = 1) {
    const $polygon = drawFs.polygon(g, hull, classes, delay);
    return $polygon;
}
export { boundingHull };
//# sourceMappingURL=bounding-hull.js.map