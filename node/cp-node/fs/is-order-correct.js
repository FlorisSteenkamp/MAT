import { comparePoss } from "../../point-on-shape/compare-poss.js";
function isOrderCorrect(cpTree, pos, next) {
    const c = comparePoss(pos, next.pointOnShape);
    if (c < 0) {
        return true;
    }
    if (c === 0) {
        return false;
    }
    const minNode = cpTree.getMinNode();
    if (minNode === undefined) { // if tree not empty
        return true;
    }
    const min = minNode.datum;
    const max = cpTree.getMaxNode().datum;
    // larger than all -> crossing zero on loop
    return (comparePoss(max.pointOnShape, pos) < 0 && min === next);
}
export { isOrderCorrect };
//# sourceMappingURL=is-order-correct.js.map