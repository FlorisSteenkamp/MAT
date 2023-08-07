import { ddMultDd, ddAddDd, twoDiff } from 'double-double';
function squaredDistanceBetweenDd(x, y) {
    const [x0, y0] = x;
    const [x1, y1] = y;
    // xd = x0 - x1;
    // yd = y0 - y1;
    // xx = xd**2;
    // yy = yd**2;
    // return xx + yy
    const xd = twoDiff(x0, x1);
    const yd = twoDiff(y0, y1);
    const xx = ddMultDd(xd, xd);
    const yy = ddMultDd(yd, yd);
    return ddAddDd(xx, yy)[1];
}
export { squaredDistanceBetweenDd };
//# sourceMappingURL=squared-distance-between-dd.js.map