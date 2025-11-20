import { evalDeCasteljauDd } from "flo-bezier3";
function createPos(curve, t, isSource) {
    return {
        curve,
        t,
        p: evalDeCasteljauDd(curve.ps, [0, t]).map(c => c[1]),
        isSource: isSource === undefined ? false : isSource
    };
}
export { createPos };
//# sourceMappingURL=create-pos.js.map