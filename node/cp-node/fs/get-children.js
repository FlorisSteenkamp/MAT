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