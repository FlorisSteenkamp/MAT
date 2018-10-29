import { Loop } from '../../../loop';
/**
 * Uses the algorithm of Lavanya Subramaniam (PARTITION OF A NON-SIMPLE POLYGON
 * INTO SIMPLE POLYGONS) but modified to use cubic bezier curves (as opposed to
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
export { simplifyPaths };
