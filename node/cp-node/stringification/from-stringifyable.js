import { EDGES } from "./cp-node-stringifyable";
import { loopFromStringifyable } from './loop-from-stringifyable.js';
function fromStringifyable(cpNodesStringifyable) {
    const { cpNodes: _cpNodes, loops: _loops } = cpNodesStringifyable;
    const loops = _loops.map(loopFromStringifyable);
    //--------------------------------------------------------------------------
    // First pass: build all CpNode objects with proper `cp`.
    // Edges still hold number ids at this point.
    //--------------------------------------------------------------------------
    const cpNodes = _cpNodes.map(cpNode_ => {
        const { id, pointOnShape, isHoleClosing, isIntersection } = cpNode_;
        const { circle, order, order2 } = pointOnShape;
        const { curveIdx, loopIdx, p, pDd, t, isSource } = pointOnShape;
        const curve = loops[loopIdx].curves[curveIdx];
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
    return cpNodes[0];
}
export { fromStringifyable };
//# sourceMappingURL=from-stringifyable.js.map