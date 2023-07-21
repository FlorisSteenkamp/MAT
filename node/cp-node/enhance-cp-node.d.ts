import { CpNode } from "./cp-node.js";
declare function enhanceCpNode(cpNode: CpNode): {
    isTerminating: boolean;
    isFullyTerminating: boolean;
    isSharp: boolean;
    isOneProng: boolean;
    prongCount: number;
    getRealProngCount: number;
    ordering: {
        idx: number;
        t: number;
        order: number;
        order2: number;
    };
    curve: import("../curve.js").Curve;
    loop: import("flo-boolean/node/loop/loop").Loop;
    cp: import("../contact-point.js").ContactPoint;
    isHoleClosing: boolean;
    isIntersection: boolean;
    prev: CpNode;
    next: CpNode;
    prevOnCircle: CpNode;
    nextOnCircle: CpNode;
};
export { enhanceCpNode };
