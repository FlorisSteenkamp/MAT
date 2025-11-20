function findFirst(f, cpNode) {
    const cpStart = cpNode;
    if (f(cpStart)) {
        return cpStart;
    }
    let cpNode_ = cpNode.next;
    while (cpNode_ !== cpStart) {
        if (f(cpNode_)) {
            return cpNode_;
        }
        cpNode_ = cpNode_.next;
    }
    return undefined;
}
export { findFirst };
//# sourceMappingURL=find-first.js.map