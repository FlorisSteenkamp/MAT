import { evalDeCasteljauDd } from "flo-bezier3";
function createPos(curve, t) {
    return {
        // curve, t, p: evalDeCasteljau(curve.ps, t); //TODO2
        curve, t, p: evalDeCasteljauDd(curve.ps, [0, t]).map(c => c[1])
    };
}
export { createPos };
//# sourceMappingURL=create-pos.js.map