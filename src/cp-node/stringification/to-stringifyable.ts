import type { Loop } from "flo-boolean";
import type { CpNodeStringifyable, CpNodeWithAnyEdges, PointOnShapeSimplified } from "./cp-node-stringifyable.js";
import type { CpNode } from "../cp-node.js";
import { loopToStringifyable } from "./loop-to-stringifyable.js";


/**
 * Returns a plain, acyclic representation of the entire MAT the given `CpNode`
 * is part of (the `CpNode` edges replaced by ids and the boundary loops
 * included) suitable for `JSON.stringify`; `fromStringifyable` reverses it.
 */
function toStringifyable(
        cpNode: CpNode): CpNodeStringifyable {

    const cpNodes_: CpNodeWithAnyEdges[] = [];
    const loopSet = new Set<Loop>();

    //--------------------------------------------------------------------------
    // Clone `CpNode`s with edges replaced with ids AND
    // set the `nodeMap` to map original `CpNode`s to their ids.
    //--------------------------------------------------------------------------
    const cpStart = cpNode;
    do {
        const {
            id, isHoleClosing, isIntersection,
            pointOnShape,
            prev, next, nextOnCircle, prevOnCircle, holeCloserTwin,
        } = cpNode

        const { curve, p, pDd, t, isSource, circle, order, order2 } = pointOnShape;
        const { idx: curveIdx, loop, ps, prev: prevCurve, next: nextCurve } = curve;

        if (!loopSet.has(loop)) {
            loopSet.add(loop);
        }

        const posSimplified: PointOnShapeSimplified = {
            curveIdx, loopIdx: loop.idx!, p, pDd, t, isSource,
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

    const loops = Array.from(loopSet).sort((a, b) => a.idx! - b.idx!);
    const loops_ = loops.map(loopToStringifyable);

    return {
        cpNodes: cpNodes_,
        loops: loops_
    };
}


export { toStringifyable }

