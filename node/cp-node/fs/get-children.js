/**
 * Returns the children of this `CpNode` when seen as a MAT edge. Only
 * children in a 'forward' direction are returned. These include all edges
 * except the 'backward' edge given by `prevOnCircle`, even terminating
 * edges.
 */
function getChildren(cpNode) {
    const children = [];
    const cp = cpNode.next;
    let cpNode_ = cp;
    do {
        children.push(cpNode_);
        cpNode_ = cpNode_.nextOnCircle;
    } while (cpNode_.nextOnCircle !== cp);
    return children;
}
export { getChildren };
//# sourceMappingURL=get-children.js.map