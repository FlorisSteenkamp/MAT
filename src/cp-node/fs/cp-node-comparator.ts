import type { CpNode } from "../cp-node.js";
import { compareCps } from "../../contact-point/contact-point.js";


function cpNodeComparator(
        a: CpNode,
        b: CpNode) {

    return compareCps(a.cp, b.cp);
}


export { cpNodeComparator }
