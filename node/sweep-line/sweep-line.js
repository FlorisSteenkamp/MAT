/** @hidden */
const EVENT_LEFT = 0;
/** @hidden */
const EVENT_RIGHT = 1;
/**
 * @hidden
 * Generalized sweepline algorithm.
 *
 * Typically used to turn O(n^2) algorithms into roughly O(n logn) algorithms.
 *
 * @param items An array of items that are to be compared. Items should
 * typically be geometric objects in 2d space with well-defined left and right
 * endpoints.
 * @param getLeftmostPoint A function that returns the leftmost point of the
 * geometric object of interest.
 * @param getRightmostPoint A function that returns the rightmost point of the
 * geometric object of interest.
 * @param predicate A predicate that takes two geometric objects and returns
 * true if they are of interest or false otherwise.
 */
function sweepLine(items, getLeftmost, getRightmost, predicate) {
    // Initialize event queue to contain all endpoints.
    const events = [];
    for (const item of items) {
        events.push({
            type: EVENT_LEFT,
            item,
            x: getLeftmost(item)
        });
        events.push({
            type: EVENT_RIGHT,
            item,
            x: getRightmost(item)
        });
    }
    events.sort(compare);
    const activeItems = new Set();
    /** A list of pairs of items that passed the predicate */
    const pairedItems = [];
    for (const event of events) {
        const { item } = event;
        if (event.type === EVENT_LEFT) {
            for (const activeItem of activeItems.values()) {
                if (predicate(item, activeItem)) {
                    pairedItems.push([item, activeItem]);
                }
            }
            activeItems.add(item);
        }
        else if (event.type === EVENT_RIGHT) {
            activeItems.delete(event.item);
        }
    }
    return pairedItems;
}
/**
 * @hidden
 * Compare two Events by their x-axis and then by their type. Since it is
 * open boxes that are compared we must let the right endpoint type come
 * before the left.
 * @param a An event
 * @param b Another event
 */
function compare(a, b) {
    const res = a.x - b.x;
    if (res !== 0) {
        return res;
    }
    // Alwys put left events before right ones.
    return a.type === EVENT_LEFT ? -1 : +1;
}
export { sweepLine };
//# sourceMappingURL=sweep-line.js.map