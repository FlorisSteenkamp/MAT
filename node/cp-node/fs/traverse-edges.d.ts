import { CpNode } from '../cp-node.js';
declare function traverseEdges$$(cpNode: CpNode, traverseEdgesCallback: (cpNode: CpNode) => Promise<void>): Promise<void>;
declare function traverseEdges(cpNode: CpNode, traverseEdgesCallback: (cpNode: CpNode) => void): void;
declare function $traverseEdges(cpNode: CpNode): Generator<CpNode, void, unknown>;
export { traverseEdges, $traverseEdges, traverseEdges$$ };
