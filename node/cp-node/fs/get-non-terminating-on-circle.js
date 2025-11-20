import { isTerminating } from "./is-terminating.js";
function getNonTerminatingOnCircle(cpNode, exclThis = false) {
    const startCpNode = cpNode;
    let cpNode_ = startCpNode;
    const cpNodes = [];
    do {
        if (!(exclThis && cpNode_ === startCpNode) && !isTerminating(cpNode_)) {
            cpNodes.push(cpNode_);
        }
        cpNode_ = cpNode_.nextOnCircle;
    } while (cpNode_ !== startCpNode);
    return cpNodes;
}
export { getNonTerminatingOnCircle };
//# sourceMappingURL=get-non-terminating-on-circle.js.map