function getProngCount(cpNode) {
    const startCpNode = cpNode;
    let cpNode_ = startCpNode;
    let i = 0;
    do {
        i++;
        cpNode_ = cpNode_.nextOnCircle;
    } while (cpNode_ !== startCpNode);
    return i;
}
export { getProngCount };
//# sourceMappingURL=get-prong-count.js.map