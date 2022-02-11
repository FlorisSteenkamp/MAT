import { Curve } from "../../curve.js";
/**
 * @hidden
 * @param curve The curve
 * @param p The point from which to check
 * @param tRange The allowed t range
 * @param touchedCurve The bezier on which p is located
 * @param t The t value of the bezier that locates p
 */
declare function closestPointsOnCurve(curve: Curve, p: number[], [tS, tE]: number[], touchedCurve: Curve, t: number): {
    p: number[];
    t: number;
}[];
export { closestPointsOnCurve };
