import { Circle } from '../classes/circle';
import { CpNode } from '../../linked-list/cp-node';
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
declare function traverseVertices(cpNode: CpNode, f: (circle: Circle) => boolean | void, returnFirst?: boolean): Circle[];
export { traverseVertices };
