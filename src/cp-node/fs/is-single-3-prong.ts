import { CpNode } from "../cp-node.js";


function isSingle3Prong(
        cpNode: CpNode) {

    return (
        cpNode.next === cpNode.nextOnCircle &&
        cpNode.next.next === cpNode.next.nextOnCircle &&
        cpNode.prev.next === cpNode.prev.nextOnCircle
    );
}


export { isSingle3Prong }
