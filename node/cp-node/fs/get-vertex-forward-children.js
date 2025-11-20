import { isTerminating } from "./is-terminating.js";
function getVertexForwardChildren(cpNode) {
    const children = [];
    const cpStart = cpNode;
    let cpNode_ = cpStart;
    while (cpNode_ !== cpStart.prevOnCircle) {
        if (!isTerminating(cpNode_)) {
            children.push(cpNode_.next);
        }
        cpNode_ = cpNode_.nextOnCircle;
    }
    return children;
}
export { getVertexForwardChildren };
//# sourceMappingURL=get-vertex-forward-children.js.map