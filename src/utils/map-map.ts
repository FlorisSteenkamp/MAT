
/**
 * Returns the result of mapping the array to depth 2 and applying a filter
 * to the inner results which defaults to filtering out `undefined`.
 * 
 * @param tss 
 * @param f 
 * @param filter 
 */
function mapmap<T,U>(
        tss: T[][],
        f: (t: T) => U,
        filter: (u: U) => boolean = u => u !== undefined): U[][] {

    const tss_: U[][] = [];
    for (let i=0; i<tss.length; i++) {
        const ts = tss[i];
        const ts_: U[] = [];
        for (let j=0; j<ts.length; j++) {
            const v = f(ts[j]);
            if (filter(v)) {
                ts_.push(f(ts[j]));
            }
        }
        tss_.push(ts_);
    }

    return tss_;
}


export { mapmap }

