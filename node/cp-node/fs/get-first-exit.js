function getFirstExit(cpNode) {
    // const startNode = this as CpNode;
    const startNode = cpNode;
    let cpNode_ = startNode;
    while (cpNode_.next === cpNode_.prevOnCircle) {
        cpNode_ = cpNode_.next;
        if (cpNode_ === startNode) {
            // The very special case the MAT is a single point.
            return undefined;
        }
    }
    return cpNode_;
}
export { getFirstExit };
//# sourceMappingURL=get-first-exit.js.map