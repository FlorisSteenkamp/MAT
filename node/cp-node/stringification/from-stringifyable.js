import { EDGES } from "./cp-node-stringifyable";
import { getAllOnCircle } from "../fs/get-all-on-circle.js";
import { loopFromStringifyable } from './loop-from-stringifyable.js';
function fromStringifyable(cpNodesStringifyable) {
    const { cpNodes: _cpNodes, loops: _loops } = cpNodesStringifyable;
    const loops = _loops.map(loopFromStringifyable);
    const loopsByIdx = new Map(loops.map(loop => [loop.idx, loop]));
    //--------------------------------------------------------------------------
    // First pass: build all CpNode objects with proper `cp`.
    // Edges still hold number ids at this point.
    //--------------------------------------------------------------------------
    const cpNodes = _cpNodes.map(cpNode_ => {
        const { id, pointOnShape, isHoleClosing, isIntersection } = cpNode_;
        const { circle, order, order2 } = pointOnShape;
        const { curveIdx, loopIdx, p, pDd, t, isSource } = pointOnShape;
        const curve = loopsByIdx.get(loopIdx).curves[curveIdx];
        const pointOnShape_ = {
            circle,
            curve, p, pDd, t, isSource,
            order, order2
        };
        return {
            ...cpNode_,
            id, isHoleClosing, isIntersection,
            pointOnShape: pointOnShape_
        };
    });
    //--------------------------------------------------------------------------
    // Second pass: replace number id edges with real CpNode references.
    //--------------------------------------------------------------------------
    const nodeMap = new Map(cpNodes.map(n => [n.id, n]));
    for (const cpNode of cpNodes) {
        for (const edge of EDGES) {
            const id = cpNode[edge];
            if (id === undefined) {
                continue;
            }
            // @ts-ignore
            cpNode[edge] = nodeMap.get(id);
        }
    }
    //--------------------------------------------------------------------------
    // Third pass: one shared `Circle` object per on-circle ring, as when the
    // MAT was built (the JSON gave every contact point its own copy).
    //--------------------------------------------------------------------------
    const done = new Set();
    for (const cpNode of cpNodes) {
        if (done.has(cpNode)) {
            continue;
        }
        const { circle } = cpNode.pointOnShape;
        for (const cp of getAllOnCircle(cpNode)) {
            done.add(cp);
            cp.pointOnShape.circle = circle;
        }
    }
    return cpNodes[0];
}
export { fromStringifyable };
//# sourceMappingURL=from-stringifyable.js.map