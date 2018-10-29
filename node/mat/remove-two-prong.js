"use strict";
// TODO - not working - fix
Object.defineProperty(exports, "__esModule", { value: true });
//import { Vertex } from '../classes/vertex/vertex';
/**
 * Removes the 2-prong connected to the given ContactPoint.
 *
 * This is used for example when a 2-prong and 3-prong falls on top of each
 * other causing the algorithm to fail.
 * @param cpNode
 */
function removeTwoProng(cpNode) {
    /*
    let cp = _cp_.cp;
    let vertex = cp.vertex;
    let cps = vertex.cps;

    if (typeof _debug_ !== 'undefined') {
        //_debug_.fs.draw.dot(cps[0].item.pointOnShape.p, 2, 'black', 0);
        //_debug_.fs.draw.dot(cps[1].item.pointOnShape.p, 3, 'black', 0);

        //alter2ProngInDebugArray(vertex);
    }

    for (let cp_ of cps) {
        cp_.cpGraph.remove(cp_);
    }
    */
}
exports.removeTwoProng = removeTwoProng;
//# sourceMappingURL=remove-two-prong.js.map