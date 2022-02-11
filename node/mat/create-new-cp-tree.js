import { LlRbTree } from 'flo-ll-rb-tree';
import { CpNode } from '../cp-node.js';
/**
 * @hidden
 * @param cpNode
 */
function createNewCpTree(cpNode) {
    let newCpTrees = new Map();
    let cps = cpNode.getAllOnLoop();
    cps.forEach(f);
    function f(cpNode) {
        let loop = cpNode.cp.pointOnShape.curve.loop;
        let cpTree = newCpTrees.get(loop);
        if (!cpTree) {
            // qqq cpTree = new LlRbTree(CpNode.comparator, [], true); 
            cpTree = new LlRbTree(CpNode.comparator, false);
            newCpTrees.set(loop, cpTree);
        }
        cpTree.insert(cpNode);
    }
    return newCpTrees;
}
export { createNewCpTree };
//# sourceMappingURL=create-new-cp-tree.js.map