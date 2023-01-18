import { drawFs } from "flo-draw";
/** @hidden */
function looseBoundingBox(g, box) {
    const [[x0, y0], [x1, y1]] = box;
    box = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
    const $box = drawFs.polygon(g, box, 'thin5 brown nofill');
    return $box;
}
export { looseBoundingBox };
//# sourceMappingURL=loose-bounding-box.js.map