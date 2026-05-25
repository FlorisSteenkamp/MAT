/**
 *
 * @param holeClosers
 * @returns
 */
// TODO - this function is currently O(n^2) but could be made O(n).
// TODO - only `pointOnShape.p` is checked but `pointOnShape.t` should also be checked
// or better yet, `CpNode.cp.order` and `CpNode.cp.order2`, etc.
function getHoleCloserPairs(holeClosers) {
    const pairs = new Map();
    for (let hcA of holeClosers) {
        for (let hcB of holeClosers) {
            const cA = hcA.cp.circle.center;
            const cB = hcB.cp.circle.center;
            const cpA = hcA.cp.pointOnShape.p;
            const cpB = hcB.cp.pointOnShape.p;
            if (hcB !== hcA &&
                cA[0] === cB[0] && cA[1] === cB[1] &&
                cpA[0] === cpB[0] && cpA[1] === cpB[1]) {
                pairs.set(hcA, hcB);
            }
        }
    }
    return pairs;
}
export { getHoleCloserPairs };
//# sourceMappingURL=get-hole-closer-pairs.js.map