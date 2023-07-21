import { getOsculatingCircle } from '../../point-on-shape/get-osculating-circle.js';
import { calcPosOrder } from '../../point-on-shape/calc-pos-order.js';
import { isPosDullCorner } from '../../point-on-shape/is-pos-dull-corner.js';
import { addToCpGraph } from '../add-to-cp-graph.js';
import { isAnotherCpCloseby } from '../is-another-cp-closeby.js';
/**
 * @internal
 * Add a 1-prong to the MAT.
 * @param cpGraphs
 * @param pos
 */
function add1Prong(maxOsculatingCircleRadius, cpGraphs, pos) {
    //if (PointOnShape.isDullCorner(pos)) {
    if (isPosDullCorner(pos)) {
        // This is a 1-prong at a dull corner.
        // TODO IMPORTANT 
        // Remove this line, uncomment piece below it and implement the 
        // following strategy to find the 3-prongs: if deltas are conjoined due 
        // to dull corner, split the conjoinment by inserting successively 
        // closer (binary division) 2-prongs. If a 2-prong actually fails, 
        // simply remove the 1-prong at the dull corner. In this way **all** 
        // terminal points are found, e.g. zoom in on top left leg of ant.
        // Afterthought: there is a better way - split points by two prongs.
        //toRemove.push(posNode); // this!
        if (typeof _debug_ !== 'undefined') {
            _debug_.generated.elems.oneProngAtDullCorner.push(pos);
        }
        // console.log('dull')
        return;
    }
    // return;  // TODO2 - this was added
    const circle = getOsculatingCircle(maxOsculatingCircleRadius, pos);
    const order = calcPosOrder(circle, pos);
    // Make sure there isn't already a ContactPoint close by - it can cause
    // floating point stability issues.
    if (!!isAnotherCpCloseby(cpGraphs, pos, circle, order, 0, 1000)) {
        return;
    }
    addToCpGraph(circle, [-0.5, +0.5], cpGraphs, [pos, pos]);
    if (typeof _debug_ !== 'undefined') {
        _debug_.generated.elems.oneProng.push(pos);
    }
}
export { add1Prong };
//# sourceMappingURL=add-1-prong.js.map