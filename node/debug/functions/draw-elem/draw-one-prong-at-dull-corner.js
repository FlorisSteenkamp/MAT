import { drawFs } from 'flo-draw';
import { ddCurvature, ddNormal } from 'flo-bezier3';
/** @hidden */
function oneProngAtDullCorner(g, pos, classes, delay = 1000, scaleFactor = 1) {
    //let oCircle = PointOnShape.getOsculatingCircle(Infinity, pos);
    const { curve, p, t } = pos;
    const { ps } = curve;
    const norm = ddNormal(ps, t).map(c => c[1]);
    // const [center,r] = getOsculatingCircle(Infinity, pos, norm);
    const k = -(ddCurvature(ps, t)[1]);
    const [tx, ty] = norm;
    const l = Math.sqrt(tx * tx + ty * ty);
    const scale = k * l;
    const center = [p[0] - tx / scale, p[1] - ty / scale];
    const oCircle = { center, radius: 1 / k };
    const $center = drawFs.dot(g, pos.p, 0.1, 'orange');
    const $circle = drawFs.dot(g, oCircle.center, 0.25, 'orange');
    const $pos = drawFs.circle(g, oCircle, 'orange thin10 nofill');
    return [...$center, ...$circle, ...$pos];
}
export { oneProngAtDullCorner };
//# sourceMappingURL=draw-one-prong-at-dull-corner.js.map