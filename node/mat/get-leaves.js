/** @hidden */
function getLeaves(cpNode) {
    const leaves = [];
    const cps = cpNode.getAllOnLoop();
    cps.forEach(function (cp) {
        if (cp.isTerminating()) {
            leaves.push(cp);
        }
    });
    return leaves;
}
export { getLeaves };
//# sourceMappingURL=get-leaves.js.map