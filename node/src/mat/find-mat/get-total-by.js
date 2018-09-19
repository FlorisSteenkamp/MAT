"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Helper function.
 * @private
 * @param f
 */
function getTotalBy(f) {
    return function (loop) {
        let node = loop.head;
        let total = 0;
        do {
            total += f(node);
            node = node.next;
        } while (node !== loop.head);
        return total;
    };
}
exports.getTotalBy = getTotalBy;
