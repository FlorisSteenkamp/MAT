import { getAllOnLoop } from "../../cp-node/fs/get-all-on-loop.js";
import { getProngCount } from "../../cp-node/fs/get-prong-count.js";
import { isOrderCorrect } from "../../cp-node/fs/is-order-correct.js";
function checkOrdering(meta, cpStart) {
    const { cpTrees } = meta;
    const cpNodes = getAllOnLoop(cpStart);
    const wrongsPerLoop = new Map();
    for (const cpNode of cpNodes) {
        const pos = cpNode.pointOnShape;
        const loop = pos.curve.loop;
        if (loop !== cpNode.prev.pointOnShape.curve.loop ||
            loop !== cpNode.next.pointOnShape.curve.loop) {
            continue;
        }
        const cpTree = cpTrees.get(loop);
        const orderCorrect = isOrderCorrect(cpTree, cpNode.prev, cpNode.pointOnShape, cpNode.next, true);
        if (!orderCorrect) {
            const A = toOrder(cpNode);
            const B = toOrder(cpNode.next);
            let wrongs = wrongsPerLoop.getOrInsert(loop, []);
            wrongs.push([A, B]);
        }
    }
    for (const [loop, wrongs] of wrongsPerLoop) {
        for (const wrong of wrongs) {
            const A = wrong[0];
            const B = wrong[1];
            // const c = comparePoss(A.cpNode.pointOnShape, B.cpNode.pointOnShape);
            console.log(A);
            console.log(B);
            console.log('---------');
        }
    }
}
function toOrder(cpNode) {
    const prongCount = getProngCount(cpNode);
    const { pointOnShape } = cpNode;
    const { p, t, order, order2, curve } = pointOnShape;
    const curveIdx = curve.idx;
    return { cpNode, prongCount, p, curveIdx, t, order, order2 };
}
export { checkOrdering };
//# sourceMappingURL=check-ordering.js.map