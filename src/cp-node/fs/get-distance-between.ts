import { CpNode } from "../cp-node.js";
import { getMatDistanceToNext$ } from "./get-distance-to-next.js";


// const dMap = new WeakMap<CpNode>

function getDistanceBetween(
        a: CpNode,
        b: CpNode) {

    const d = getMatDistanceToNext$(a);

}


export { getDistanceBetween }
