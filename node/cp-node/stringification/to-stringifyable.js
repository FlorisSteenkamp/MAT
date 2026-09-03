import { loopToStringifyable } from "./loop-to-stringifyable.js";
/**
 * Returns a deep clone of this `CpNode`. Can be used to copy the MAT
 * since cloning a single `CpNode` necessarily implies cloning all
 * `CpNode`s on the same MAT tree.
 */
function toStringifyable(cpNode) {
    const cpNodes_ = [];
    const loopSet = new Set();
    //--------------------------------------------------------------------------
    // Clone `CpNode`s with edges replaced with ids AND
    // set the `nodeMap` to map original `CpNode`s to their ids.
    //--------------------------------------------------------------------------
    const cpStart = cpNode;
    do {
        const { id, isHoleClosing, isIntersection, pointOnShape, prev, next, nextOnCircle, prevOnCircle, holeCloserTwin, } = cpNode;
        const { curve, p, pDd, t, isSource, circle, order, order2 } = pointOnShape;
        const { idx: curveIdx, loop, ps, prev: prevCurve, next: nextCurve } = curve;
        if (!loopSet.has(loop)) {
            loopSet.add(loop);
        }
        const posSimplified = {
            curveIdx, loopIdx: loop.idx, p, pDd, t, isSource,
            circle, order, order2
        };
        cpNodes_.push({
            id, isHoleClosing, isIntersection,
            pointOnShape: posSimplified,
            prev: prev.id,
            next: next.id,
            prevOnCircle: prevOnCircle.id,
            nextOnCircle: nextOnCircle.id,
            holeCloserTwin: holeCloserTwin?.id
        });
        cpNode = cpNode.next;
    } while (cpNode !== cpStart);
    //--------------------------------------------------------------------------
    const loops = Array.from(loopSet).sort((a, b) => a.idx - b.idx);
    const loops_ = loops.map(loopToStringifyable);
    return {
        cpNodes: cpNodes_,
        loops: loops_
    };
}
export { toStringifyable };
//# sourceMappingURL=to-stringifyable.js.map