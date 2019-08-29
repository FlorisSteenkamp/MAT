import { Loop } from '../../../loop/loop';
/**
 * Uses the algorithm of Lavanya Subramaniam (PARTITION OF A NON-SIMPLE POLYGON
 * INTO SIMPLE POLYGONS) but modified to use bezier curves (as opposed to
 * polygons) and to additionally take care of paths with multiple subpaths, i.e.
 * such as disjoint nested paths.
 * @param loops An array of possibly intersecting paths
 */
declare function simplifyPaths(loops: Loop[]): {
    loopss: Loop[][];
    xMap: Map<number[][], {
        ps: number[][];
    }>;
};
/**
 * @hidden
 * Returns < 0 if loopA's topmost point is higher (i.e. smaller) than that of
 * loopB. Using this function in a sort will sort from highest topmost point
 * loops to lowest.
 * @param loopA
 * @param loopB
 * @hidden
 */
declare function ascendingByTopmostPoint(loopA: Loop, loopB: Loop): number;
export { simplifyPaths, ascendingByTopmostPoint };
