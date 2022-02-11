/**
 * @hidden
 * Helper function.
 * @hidden
 * @param f
 */
function getTotalBy(f) {
    return function (loop) {
        let node = loop.curves[0];
        let total = 0;
        do {
            total += f(node);
            node = node.next;
        } while (node !== loop.curves[0]);
        return total;
    };
}
export { getTotalBy };
//# sourceMappingURL=get-total-by.js.map