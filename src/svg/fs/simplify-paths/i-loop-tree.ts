
import { Loop } from "../../../loop";

interface ILoopTree {
    parent      : ILoopTree,
    children    : Set<ILoopTree>,
    beziers     : number[][][];
    loop        : Loop,
    orientation : number; // +1 or -1
    windingNum  : number; // The winding number of a point in the loop.
}


export { ILoopTree }
