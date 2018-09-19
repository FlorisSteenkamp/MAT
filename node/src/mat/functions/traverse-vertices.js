"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Traverses the MAT tree and finds and returns the first circle as an array
 * with one element (or all) with a specified property defined by the given
 * predicate function. Returns [] if no circle with the specified
 * property has been found.
 * @param cpNode Root of MAT tree
 * @param f A function that should return true if the circle passes the criteria
 * necessary to be returned or falsy otherwise.
 * @param returnFirst If true, returns as soon as the first circle passing
 * f(circle) was found as [Circle]. False by default.
 */
// TODO - change so it returns an array of CpNode instead.
function traverseVertices(cpNode, f, returnFirst = false) {
    let circles = [];
    let circle = cpNode.cp.circle;
    if (f(circle)) {
        circles.push(circle);
        if (returnFirst) {
            return circles;
        }
    }
    ;
    let cps = cpNode.getCps();
    while (cps.length) {
        let cpNode = cps.pop();
        while (!cpNode.isTerminating()) {
            cpNode = cpNode.next;
            let v = cpNode.cp.circle;
            if (f(v)) {
                circles.push(v);
                if (returnFirst) {
                    return circles;
                }
            }
            ;
            if (cpNode.isThreeProng()) {
                cps.push(cpNode.nextOnCircle);
            }
        }
    }
    return circles;
}
exports.traverseVertices = traverseVertices;
