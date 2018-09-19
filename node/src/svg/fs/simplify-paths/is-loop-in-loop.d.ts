import { Loop } from "../../../loop";
/**
 * Returns true if the first loop is contained wholly within the second. At this
 * stage we already know the loop is either wholly contained inside the loop
 * or is wholly outside.
 * @param loops
 */
declare function isLoopInLoop(loops: Loop[]): boolean;
export { isLoopInLoop };
