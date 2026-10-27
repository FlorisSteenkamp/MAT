import { expect, test } from '@jest/globals';
import { loopFromBeziers } from 'flo-boolean';
import { mergeTouchingLoops } from '../../src/loop/merge-touching-loops.js';


/** Returns a loop of lines through the given points (in order) */
function polygon(ps: number[][], idx: number) {
    return loopFromBeziers(ps.map((p,i) => [p, ps[(i+1) % ps.length]]), idx);
}


// Orientations as returned by `simplifyPaths` with `forceOrientationNegative`,
// i.e. negative signed area for material, positive for holes
const outer = [[0,0],[-500,200],[500,200]];


test('`mergeTouchingLoops` merges a hole touching the outer loop at a point', function() {
    const hole = [[0,0],[250,150],[-250,150]];
    const loops = [polygon(outer, 0), polygon(hole, 1)];

    const merged = mergeTouchingLoops(loops);

    expect(merged.length).toEqual(1);

    // each incoming curve at the shared point is followed by the curve of
    // the *other* loop bounding the same (thin) material wedge
    expect(merged[0].beziers).toEqual([
        [[0,0],[-500,200]], [[-500,200],[500,200]], [[500,200],[0,0]],
        [[0,0],[250,150]], [[250,150],[-250,150]], [[-250,150],[0,0]]
    ]);
});


test('`mergeTouchingLoops` keeps a material island touching a hole separate', function() {
    const square = [[-1000,-1000],[-1000,1000],[1000,1000],[1000,-1000]];
    const hole = [[0,0],[300,300],[-300,300]];
    const island = [[0,0],[-100,200],[100,200]];
    const loops = [polygon(square, 0), polygon(hole, 1), polygon(island, 2)];

    expect(mergeTouchingLoops(loops)).toBe(loops);
});


test('`mergeTouchingLoops` leaves a hole touching the outer loop at 2 points unchanged', function() {
    // (the material is split in 2 parts, which is not supported)
    const outer_ = [[0,0],[-500,200],[0,200],[500,200]];
    const hole = [[0,0],[100,100],[0,200],[-100,100]];
    const loops = [polygon(outer_, 0), polygon(hole, 1)];

    expect(mergeTouchingLoops(loops)).toBe(loops);
});


test('`mergeTouchingLoops` leaves loops that do not touch unchanged', function() {
    const hole = [[0,50],[250,150],[-250,150]];
    const loops = [polygon(outer, 0), polygon(hole, 1)];

    expect(mergeTouchingLoops(loops)).toBe(loops);
});
