import { traverseCp } from '../cp-node/traverse-cp.js';
import { calcPosOrder } from '../point-on-shape/calc-pos-order.js';
import { find3Prong } from './find-3-prong.js';
import { add3Prong } from './add-3-prong.js';
/**
 * @internal
 * Starting from some ContactPoint, traverses the shape going around Vertices
 * and if more than two Vertices have been visited in total then recursively
 * adds 3-prongs until only one or two Vertices have been visited.
 *
 * This process further subdivides the shape.
 *
 * @param cpGraphs
 * @param cpStart The ContactPoint from where to start the process.
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
let ii = 0;
function findAndAdd3Prongs(cpGraphs, cpStart, extreme) {
    let visitedCps;
    do {
        visitedCps = traverseCp(cpStart);
        if (visitedCps.length > 2) {
            const newCpNodes = findAndAdd3Prong(cpGraphs, visitedCps, extreme);
            if (newCpNodes.length === 1) {
                // There was another closeby cpNode
                const closeCpNode = newCpNodes[0];
            }
            ii++;
        }
        if (typeof _debug_ !== 'undefined') {
            if (ii === _debug_.directives.stopAfterThreeProngsNum) {
                return undefined;
            }
        }
    } while (visitedCps.length > 2);
    return visitedCps;
}
/**
 * @internal
 * Finds and add a 3-prong MAT circle to the given shape.
 * @param cpGraphs
 * @param visitedCps
 * @param extreme The maximum coordinate value used to calculate floating point
 * tolerances.
 */
function findAndAdd3Prong(cpGraphs, visitedCps, extreme) {
    const δs = [];
    for (const visitedCp of visitedCps) {
        δs.push([visitedCp, visitedCp.next]);
    }
    const threeProng = find3Prong(δs, extreme);
    const orders = [];
    for (let i = 0; i < 3; i++) {
        orders.push(calcPosOrder(threeProng.circle, threeProng.ps[i]));
    }
    const newCpNodes = add3Prong(cpGraphs, orders, threeProng);
    if (typeof _debug_ !== 'undefined') {
        if (newCpNodes.length === 3) {
            add3ProngDebugInfo(newCpNodes[0].cp.circle, visitedCps);
        }
    }
    return newCpNodes;
}
/** @internal */
function add3ProngDebugInfo(circle, visitedCps) {
    const threeProngs = _debug_.generated.elems.threeProng;
    const len = threeProngs.length;
    const data = threeProngs[len - 1];
    data.visitedCps = visitedCps;
    data.circle = circle;
}
export { findAndAdd3Prongs };
//# sourceMappingURL=find-and-add-3-prongs.js.map