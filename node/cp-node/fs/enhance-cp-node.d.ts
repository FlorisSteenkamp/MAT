import { CpNode } from "../cp-node.js";
/**
 * For debugging
 * @param cpNode
 */
declare function enhanceCpNode(cpNode: CpNode): {
    pos: import("../../index.js").PointOnShape;
    p: number[];
    t: number;
    isTerminating: boolean;
    isFullyTerminating: boolean;
    isSharp: boolean;
    prongCount: number;
    getRealProngCount: number;
    ordering: {
        idx: number;
        t: number;
        order: number;
        order2: number;
    };
    curve: import("../../index.js").Curve;
    loop: import("flo-boolean").Loop;
    cp: import("../../index.js").ContactPoint;
    isHoleClosing: boolean;
    isIntersection: boolean;
    prev: CpNode;
    next: CpNode;
    prevOnCircle: CpNode;
    nextOnCircle: CpNode;
    holeCloserTwin?: CpNode | undefined;
    id: number;
};
export { enhanceCpNode };
