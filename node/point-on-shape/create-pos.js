import { evalDeCasteljauDd } from "flo-bezier3";
function createPos(curve, t, source) {
    return {
        curve,
        t,
        p: evalDeCasteljauDd(curve.ps, [0, t]).map(c => c[1]),
        // angle
        source
    };
}
export { createPos };
//# sourceMappingURL=create-pos.js.map