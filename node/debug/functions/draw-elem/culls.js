"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @hidden */
function culls(g, culls) {
    let $elems = [];
    for (let circle of culls) {
        let p = circle.center;
        $elems.push(drawCircle(g, p, 0.4, 'cyan thin5 nofill'));
    }
    return $elems;
}
exports.culls = culls;
/** @hidden */
function drawCircle(g, center, radiusPercent, classes) {
    const XMLNS = 'http://www.w3.org/2000/svg';
    let $circle = document.createElementNS(XMLNS, 'circle');
    $circle.setAttributeNS(null, "cx", center[0].toString());
    $circle.setAttributeNS(null, "cy", center[1].toString());
    $circle.setAttributeNS(null, "r", radiusPercent.toString() + '%');
    $circle.setAttributeNS(null, "class", classes);
    g.appendChild($circle);
    return $circle;
}
//# sourceMappingURL=culls.js.map