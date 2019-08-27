
// TODO - not working - fix

declare var _debug_: MatDebug; 

import { MatDebug } from '../debug/debug';

import { CpNode } from '../cp-node/cp-node';

import { ContactPoint } from "../contact-point";
import { TwoProngForDebugging } from '../debug/two-prong-for-debugging';
//import { Vertex } from '../classes/vertex/vertex';


/**
 * Removes the 2-prong connected to the given ContactPoint. 
 * 
 * This is used for example when a 2-prong and 3-prong falls on top of each 
 * other causing the algorithm to fail.
 * @param cpNode
 */
/*
function removeTwoProng(cpNode: CpNode) {
    let cp = cpNode.cp;
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
}
*/

/*
function alter2ProngInDebugArray(vertex: Vertex) {
    if (!vertex) { return; }

    let twoProngs = _debug_.generated.elems.twoProngs;
    let indx = twoProngs.findIndex(function(twoProng) {
        return twoProng.data.vertex === vertex;
    });
    if (indx === -1) { return; }

    let twoProng = twoProngs[indx];

    twoProng.data.deleted = true;

    _debug_.fs.svg.deleteSvgs(twoProng.$svg);
    twoProng.$svg = _debug_.fs.drawElem.draw2Prong(
        twoProng.data,
        _debug_.config.toDraw.twoProngs.deleted
    )
    //twoProngs.splice(indx, 1);
}
*/


export { /*removeTwoProng*/ }
