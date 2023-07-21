/** @internal */
function drawCirclePercent(g, center, radiusPercent, classes) {
    const XMLNS = 'http://www.w3.org/2000/svg';
    const $circle = document.createElementNS(XMLNS, 'circle');
    $circle.setAttributeNS(null, "cx", center[0].toString());
    $circle.setAttributeNS(null, "cy", center[1].toString());
    $circle.setAttributeNS(null, "r", radiusPercent.toString() + '%');
    $circle.setAttributeNS(null, "class", classes);
    g.appendChild($circle);
    return $circle;
}
export { drawCirclePercent };
//# sourceMappingURL=draw-circle-percent.js.map