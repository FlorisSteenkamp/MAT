import { CpNode } from "../cp-node/cp-node";
/**
 * Simplifies the given MAT by replacing piecewise quad beziers with a single
 * one.
 * @param cpNode
 */
declare function simplifyMat(cpNode: CpNode, anlgeTolerance?: number, hausdorffTolerance?: number, hausdorffSpacing?: number): {
    simpleMap: Map<CpNode, {
        ps: number[][];
        ts: number[];
    }>;
    cpNode: CpNode;
};
export { simplifyMat };
