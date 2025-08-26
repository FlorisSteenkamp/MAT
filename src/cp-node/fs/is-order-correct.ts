import { LlRbTree } from "flo-ll-rb-tree";
import { compareCps, ContactPoint } from "../../contact-point/contact-point.js";
import { CpNode } from "../cp-node.js";


function isOrderCorrect(
        // isHoleClosing: boolean,
        cpTree: LlRbTree<CpNode>,
        cp: ContactPoint,
        next: CpNode): boolean {

    // if (isHoleClosing) { return true; }

    // TODO2
    const c = compareCps(cp,next.cp);
    if (c < 0) { return true; }
    if (c === 0) {
        // TODO2
        // console.log('c === 0');
        return true;
    }

    const minNode = cpTree.getMinNode();
    if (minNode === undefined) {  // if tree not empty
        return true;
    }

    const min = minNode.datum;
    const max = cpTree.getMaxNode()!.datum;

    // larger than all -> crossing zero on loop
    return (compareCps(max.cp,cp) < 0 && min === next);
}


export { isOrderCorrect }
