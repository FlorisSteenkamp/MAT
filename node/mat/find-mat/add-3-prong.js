"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const add_to_cp_graph_1 = require("../add-to-cp-graph");
const is_another_cp_closeby_1 = require("../is-another-cp-closeby");
/**
 * Adds a 3-prong MAT circle according to the 3 given (previously calculated)
 * points on the shape.
 * @param cpTrees
 * @param orders
 * @param threeProng
 */
function add3Prong(cpTrees, orders, threeProng) {
    let { circle, ps: poss, δ3s } = threeProng;
    // Keep for possible future debugging.	
    /*
    if (typeof _debug_ !== 'undefined') {
        for (let i=0; i<3; i++) {
            let cpBef = threeProng.δ3s[i][0].cp;
            let cpAft = threeProng.δ3s[i][1].cp;
            //let cmpBef = PointOnShape.compareInclOrder(cpBef.pointOnShape, ps[i], cpBef.order, orders[i]);
            //let cmpAft = PointOnShape.compareInclOrder(cpAft.pointOnShape, ps[i], cpAft.order, orders[i]);

            let cmpBef = PointOnShape.compare(cpBef.pointOnShape, ps[i]);
            let cmpAft = PointOnShape.compare(cpAft.pointOnShape, ps[i]);

            // len is used by debug functions to reference a particular
            // three-prong.
            let len = _debug_.generated.elems.threeProng.length-1;
            if (cmpBef > 0) {
                console.log('----------------------------------------');
                console.log(`3-prong order is wrong (bef) : i: ${i} - cmp: ${cmpBef} - n: ${len}`);
                console.log(threeProng);
                console.log(cpBef);
                console.log(cpAft);
                console.log(ps[i]);
            }
            if (cmpAft < 0) {
                console.log('----------------------------------------');
                console.log(`3-prong order is wrong (aft) : i: ${i} - cmp: ${cmpAft} - n: ${len}`);
                console.log(threeProng);
                console.log(cpBef);
                console.log(cpAft);
                console.log(ps[i]);
            }
        }
    }
    */
    // TODO - replace 1000 below with correct value
    is_another_cp_closeby_1.isAnotherCpCloseby(cpTrees, poss[0], circle, orders[0], 0, 1000, 'blue');
    is_another_cp_closeby_1.isAnotherCpCloseby(cpTrees, poss[1], circle, orders[1], 0, 1000, 'blue');
    is_another_cp_closeby_1.isAnotherCpCloseby(cpTrees, poss[2], circle, orders[2], 0, 1000, 'blue');
    add_to_cp_graph_1.addToCpGraph(circle, orders, cpTrees, poss, δ3s);
    return circle;
}
exports.add3Prong = add3Prong;
//# sourceMappingURL=add-3-prong.js.map