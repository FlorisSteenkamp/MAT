/** @hidden */
function getLeaves(cpNode) {
    let leaves = [];
    let cps = cpNode.getAllOnLoop();
    cps.forEach(function (cp) {
        if (cp.isTerminating()) {
            leaves.push(cp);
        }
    });
    return leaves;
}
export { getLeaves };
//# sourceMappingURL=get-leaves.js.map