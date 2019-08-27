
import { Loop } from "../../../loop/loop";

import { ILoopTree    } from "./i-loop-tree";
import { isLoopInLoop } from './is-loop-in-loop';


/**
 * 
 * @param root 
 * @param loop 
 */
function getTightestContainingLoop(root: ILoopTree, loop: Loop) {
    
    let containingLoop: ILoopTree = undefined;
    let stack: ILoopTree[] = [root];
    while (stack.length) {
        let loopTree = stack.pop();
        f(loopTree);
    }

    //console.log(containingLoop)
    return containingLoop;

    function f(parent: ILoopTree) {
        if (parent === root || isLoopInLoop([loop, parent.loop])) {
            containingLoop = parent;

            for (let child of parent.children) {
                stack.push(child);
            }
        }
    }
}


export { getTightestContainingLoop }
