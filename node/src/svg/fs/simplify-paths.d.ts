import { Loop } from '../../linked-list/loop';
/**
 * Uses the algorithm of Lavanya Subramaniam (PARTITION OF A NON-SIMPLE POLYGON
 * INTO SIMPLE POLYGONS) but modified to use cubic bezier curves (as opposed to
 * polygons) and to additionally take care of paths with multiple subpaths, i.e.
 * such as disjoint nested paths.
 * @param paths An array of paths
 */
declare function simplifyPaths(paths: Loop[]): Loop[][];
export { simplifyPaths };
