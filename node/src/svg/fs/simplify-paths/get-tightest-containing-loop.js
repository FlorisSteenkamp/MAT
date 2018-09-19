"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_loop_in_loop_1 = require("./is-loop-in-loop");
/**
 *
 * @param root
 * @param loop
 */
function getTightestContainingLoop(root, loop) {
    let containingLoop = undefined;
    let stack = [root];
    while (stack.length) {
        let loopTree = stack.pop();
        f(loopTree);
    }
    //console.log(containingLoop)
    return containingLoop;
    function f(parent) {
        if (parent === root || is_loop_in_loop_1.isLoopInLoop([loop, parent.loop])) {
            containingLoop = parent;
            for (let child of parent.children) {
                stack.push(child);
            }
        }
    }
}
exports.getTightestContainingLoop = getTightestContainingLoop;
