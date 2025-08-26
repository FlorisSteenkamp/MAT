// import { ddDeflate, allRootsCertified, RootInterval } from 'flo-poly';
// import { evalDeCasteljauDd, getFootpointPolyDd } from 'flo-bezier3';
// import { Curve } from "../curve/curve.js";


// /**
//  * @internal
//  * @param curve The curve
//  * @param p The point from which to check
//  * @param tRange The allowed t range
//  * @param touchedCurve The bezier on which p is located
//  * @param t The t value of the bezier that locates p
//  */
// function closestPointsOnCurvePrecise(
//         curve: Curve, 
//         p: number[], 
//         [tS,tE]: number[] = [0,1], 
//         touchedCurve: Curve,
//         t: number): {
//             p: number[];
//             t: number;
//         }[] {

//     const _poly = getFootpointPolyDd(curve.ps, p);

//     const poly = curve === touchedCurve
//         ? ddDeflate(_poly, t)
//         : _poly;

//     const roots: Omit<RootInterval,'multiplicity'>[] = 
//         allRootsCertified(poly, tS, tE);

//     // Also test the endpoints
//     const dontPush0 = (
//         (t === 1 && curve === touchedCurve.next) ||
//         (t === 0 && curve === touchedCurve)
//     );

//     const dontPush1 = (
//         (t === 0 && curve === touchedCurve.prev) ||
//         (t === 1 && curve === touchedCurve)
//     );

//     if (tS === 0) {
//         if (!dontPush0) { roots.push({ tS: 0, tE: 0 }); }
//     } else if (tS === 1) {
//         if (!dontPush1) { roots.push({ tS: 1, tE: 1 }); }
//     } else {
//         roots.push({ tS: tS, tE: tS });
//     }

//     if (tE === 0) {
//         if (!dontPush0) { roots.push({ tS: 0, tE: 0 }); }
//     } else if (tE === 1) {
//         if (!dontPush1) { roots.push({ tS: 1, tE: 1 }); }
//     } else {
//         roots.push({ tS: tE, tE: tE });
//     }

//     const ps = roots.map(
//         root => { 
//             const tS = root.tS;
//             const tE = root.tE;
//             const t = tS < 0 
//                 ? 0
//                 : tE > 1 ? 1 : (tS + tE)/2;
//             return { p: evalDeCasteljauDd(curve.ps,[0,t]).map(v => v[1]), t }
//         }
//     );

//     return ps;
// }


// export { closestPointsOnCurvePrecise }
