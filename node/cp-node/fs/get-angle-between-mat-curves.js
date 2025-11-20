import { tangent } from "flo-bezier3";
import { cross, toUnitVector } from "flo-vector2d";
import { getMatCurveToNext } from "./get-mat-curve-to-next.js";
/**
 *
 * @param cpNode1
 * @param cpNode2
 * @returns
 */
function getInitialDegAngleBetweenMatCurves(cpNode1, cpNode2) {
    const tan1 = toUnitVector(tangent(getMatCurveToNext(cpNode1), 0));
    const tan2 = toUnitVector(tangent(getMatCurveToNext(cpNode2), 0));
    const cross_ = cross(tan1, tan2);
    const angle = Math.abs(Math.asin(cross_) * (180 / Math.PI));
    return angle;
}
export { getInitialDegAngleBetweenMatCurves };
//# sourceMappingURL=get-angle-between-mat-curves.js.map