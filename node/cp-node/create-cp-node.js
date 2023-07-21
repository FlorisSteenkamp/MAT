function createCpNode(cp, isHoleClosing, isIntersection, prev = undefined, next = undefined, prevOnCircle = undefined, nextOnCircle = undefined) {
    return {
        cp, isHoleClosing, isIntersection,
        prev, next, prevOnCircle, nextOnCircle
    };
}
export { createCpNode };
//# sourceMappingURL=create-cp-node.js.map