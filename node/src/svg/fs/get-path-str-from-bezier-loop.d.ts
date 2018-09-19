import { Loop } from '../../linked-list/loop';
import { Node } from '../../linked-list/node';
/**
 * Returns a string representation of the given beziers linked loop.
 * @param beziers - A linked loop of cubic beziers.
 */
declare function getPathStrFromBezierLoop(bezierLoop: Loop<Node<number[][]>>): string;
export { getPathStrFromBezierLoop };
