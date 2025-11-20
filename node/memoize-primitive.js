/**
 * Memoize (by reference on the input parameter) the given arity 1 function.
 *
 * * also works with primitive keys
 * * keys will *never* be garbage collected (even if they're not
 * primitive); this may or may not be ok, depending on the use case
 * * will also work with `object`s but since this will hold a reference and
 * prevent garbage collection, rather use `memoize` instead
 */
function memoizePrimitive(f) {
    const results = new Map();
    return function (a) {
        let result = results.get(a);
        if (result !== undefined) {
            //console.log('cache hit');
            return result;
        }
        //console.log('cache miss');
        result = f(a);
        results.set(a, result);
        return result;
    };
}
export { memoizePrimitive };
//# sourceMappingURL=memoize-primitive.js.map