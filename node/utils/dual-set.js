/**
 * Get a value from the dual-set.
 * @param set
 * @param k
 */
function has(set, k, l) {
    const lSet = set.get(k);
    if (lSet === undefined) {
        return false;
    }
    return lSet.has(l);
}
/**
 * Adds a value to the dual-set.
 *
 * * destructively sets the value
 *
 * @param set
 * @param k
 * @param l
 */
function add(set, k, l) {
    let lSet = set.get(k);
    if (lSet === undefined) {
        lSet = new Set();
        set.set(k, lSet);
    }
    lSet.add(l);
}
function remove(set, k, l) {
    let lSet = set.get(k);
    if (lSet === undefined) {
        return false;
    }
    const r = lSet.delete(l);
    if (!r) {
        return false;
    }
    if (lSet.size === 0) {
        set.delete(k);
    }
    return true;
}
const DualSetFs = { has, add, remove };
export { DualSetFs };
// TESTING
// const s: DualSet<number,number> = new Map();
// add(s,1,2);
// has(s,1,2);//?
// has(s,2,1);//?
// has(s,1,1);//?
// add(s,1,1);
// has(s,1,1);//?
// has(s,1,2);//?
//# sourceMappingURL=dual-set.js.map