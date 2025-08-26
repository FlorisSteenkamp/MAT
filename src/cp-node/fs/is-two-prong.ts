import { CpNode } from "../cp-node.js";
import { getRealProngCount } from "./get-real-prong-count.js";


function isTwoProng(cpNode: CpNode) {
    return getRealProngCount(cpNode) === 2;
}


export { isTwoProng }
