import { CpNode } from "../cp-node";
import { getMatDistanceToNext$ } from "./get-distance-to-next";


// const dMap = new WeakMap<CpNode>

function getDistanceBetween(
        a: CpNode,
        b: CpNode) {

    const d = getMatDistanceToNext$(a);

}


export { getDistanceBetween }
