/**
 * Returns the number of contact points on the maximal disk circle implied
 * by this `CpNode`.
 *
 * Note, however, that even one-prongs and sharp corners will return 2 (see
 * `isTerminating` for more details); if this is not desired use
 * `getRealProngCount` instead which will return 1 in these cases.
 */
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