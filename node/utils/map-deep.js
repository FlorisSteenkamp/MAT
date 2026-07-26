/**
 * Returns the result of mapping the array to the given depth and, optionally,
 * filtering out `undefined` leaf values.
 *
 * @param tss
 * @param f
 * @param filterUndefined
 */
function mapDeep(depth, tss, f, filterUndefined) {
    if (!Number.isInteger(depth) || depth < 1) {
        throw new Error('depth must be an integer >= 1');
    }
    function mapRec(d, arr) {
        const a = arr;
        if (d === 1) {
            const ts_ = [];
            for (let i = 0; i < a.length; i++) {
                const v = f(a[i]);
                if (!filterUndefined || v !== undefined) {
                    ts_.push(v);
                }
            }
            return ts_;
        }
        const tss_ = [];
        for (let i = 0; i < a.length; i++) {
            tss_.push(mapRec(d - 1, a[i]));
        }
        return tss_;
    }
    return mapRec(depth, tss);
}
export { mapDeep };
//# sourceMappingURL=map-deep.js.map