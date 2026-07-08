import type { ContactPoint } from "../../contact-point/contact-point";
import type { CpNode } from "../cp-node";
import type { CpNodeStringifyable } from "./cp-node-stringifyable";
import { EDGES } from "./cp-node-stringifyable";
import { loopFromStringifyable } from './loop-from-stringifyable.js';


function fromStringifyable(
        cpNodesStringifyable: CpNodeStringifyable) {

    const { cpNodes: _cpNodes, loops: _loops } = cpNodesStringifyable;
    const loops = _loops.map(loopFromStringifyable);

    //--------------------------------------------------------------------------
    // First pass: build all CpNode objects with proper `cp`.
    // Edges still hold number ids at this point.
    //--------------------------------------------------------------------------
    const cpNodes: CpNode[] = _cpNodes.map(cpNode_ => {
        const { id, cp, isHoleClosing, isIntersection } = cpNode_;
        const { circle, pointOnShape, order, order2 } = cp;
        const { curveIdx, loopIdx, p, t, isSource } = pointOnShape;

        const curve = loops[loopIdx].curves[curveIdx];

        const cp_: ContactPoint = {
            circle,
            pointOnShape: { curve, p, t, isSource },
            order, order2
        };

        return {
            ...cpNode_,
            id, isHoleClosing, isIntersection,
            cp: cp_
        } as CpNode;
    });

    //--------------------------------------------------------------------------
    // Second pass: replace number id edges with real CpNode references.
    //--------------------------------------------------------------------------
    const nodeMap = new Map<number, CpNode>(cpNodes.map(n => [n.id, n]));

    for (const cpNode of cpNodes) {
        for (const edge of EDGES) {
            const id = cpNode[edge] as unknown as number | undefined;
            if (id === undefined) { continue; }

            // @ts-ignore
            cpNode[edge] = nodeMap.get(id)!;
        }
    }

    return cpNodes[0];
}


export { fromStringifyable }
