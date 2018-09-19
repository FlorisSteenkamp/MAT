import { Loop } from '../../../linked-list/loop';
/**
 * Destructively orient the bezier loops so that the outermost loop is
 * positively oriented (i.e. counter-clockwise) and the rest negatively
 * oriented.
 */
declare function orient(bezierLoops: Loop[]): Loop[];
export { orient };
