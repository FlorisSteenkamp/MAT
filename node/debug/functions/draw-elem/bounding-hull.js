import { drawFs } from 'flo-draw';
/** @hidden */
function boundingHull(g, hull, style = 'thin5 black nofill') {
    const $polygon = drawFs.polygon(g, hull, style);
    return $polygon;
}
export { boundingHull };
//# sourceMappingURL=bounding-hull.js.map