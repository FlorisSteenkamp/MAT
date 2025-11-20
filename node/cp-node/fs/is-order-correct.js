import { compareCps } from "../../contact-point/contact-point.js";
function isOrderCorrect(
// isHoleClosing: boolean,
cpTree, cp, next) {
    // if (isHoleClosing) { return true; }
    // TODO2
    const c = compareCps(cp, next.cp);
    if (c < 0) {
        return true;
    }
    if (c === 0) {
        // TODO2
        // console.log('c === 0');
        return true;
    }
    const minNode = cpTree.getMinNode();
    if (minNode === undefined) { // if tree not empty
        return true;
    }
    const min = minNode.datum;
    const max = cpTree.getMaxNode().datum;
    // larger than all -> crossing zero on loop
    return (compareCps(max.cp, cp) < 0 && min === next);
}
export { isOrderCorrect };
//# sourceMappingURL=is-order-correct.js.map