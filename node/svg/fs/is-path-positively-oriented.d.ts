import { Loop } from '../../loop/loop';
/**
 * @hidden
 * Returns true if the given beizer loop is positively orientated, false
 * otherwise. Careful! Checks leftmost part of loop so twisted complex paths
 * may give an ambiguous orientation.
 */
declare let isPathPositivelyOrientated: (a: Loop) => boolean;
export { isPathPositivelyOrientated };
