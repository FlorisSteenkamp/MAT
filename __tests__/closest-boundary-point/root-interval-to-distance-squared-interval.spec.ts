import { expect, test } from '@jest/globals';
import { evalDeCasteljau, getIntervalBox } from 'flo-bezier3';
import { squaredDistanceBetween } from 'flo-vector2d';
import { rootIntervalToDistanceSquaredInterval } from '../../src/closest-boundary-point/root-interval-to-distance-squared-interval.js';


test('rootIntervalToDistanceSquaredInterval - exact cases on a plain box', function() {
    const box = [[10, 20], [14, 23]];  // 4 wide, 3 high

    // p inside the box: the min is 0, the max is the furthest corner
    {
        const [lo, hi] = rootIntervalToDistanceSquaredInterval(box, [11, 21]);
        expect(lo).toBe(0);
        expect(hi).toBeCloseTo(3**2 + 2**2, 12);  // corner [14,23]
    }
    // p directly below the box (within its x range): the min is the vertical
    // gap, *not* the distance to a corner (which the old version returned)
    {
        const [lo, hi] = rootIntervalToDistanceSquaredInterval(box, [12, 15]);
        expect(lo).toBeCloseTo(5**2, 12);
        expect(lo).toBeLessThan(2**2 + 5**2);  // nearest corner [10,20] or [14,20]
        expect(hi).toBeCloseTo(2**2 + 8**2, 12);
    }
    // p diagonally away from the box: the min and max are both at corners
    {
        const [lo, hi] = rootIntervalToDistanceSquaredInterval(box, [7, 16]);
        expect(lo).toBeCloseTo(3**2 + 4**2, 12);  // corner [10,20]
        expect(hi).toBeCloseTo(7**2 + 7**2, 12);  // corner [14,23]
    }
    // p on the box's boundary
    {
        const [lo] = rootIntervalToDistanceSquaredInterval(box, [10, 21.5]);
        expect(lo).toBe(0);
    }
});


test('rootIntervalToDistanceSquaredInterval - encloses the distances to a curve piece', function() {
    // the box engulfs the piece, so the squared distance from `p` to every
    // point of the piece must lie within the returned interval
    const curves = [
        [[0,0],[30,80],[70,-40],[100,0]],
        [[1000,2000],[1200,2500],[1800,1900],[2000,2000]],
        [[-5,3],[4,9],[12,-2]],
    ];
    const tRanges: [number, number][] = [[0.1, 0.11], [0.5, 0.5002], [0.9, 0.95], [0, 1]];
    const offsets = [[0,0],[0.3,-0.2],[5,0],[0,-7],[40,40],[-1000,1]];

    for (const ps of curves) {
        for (const ts of tRanges) {
            const box = getIntervalBox(ps, ts);
            const mid = evalDeCasteljau(ps, (ts[0]+ts[1])/2);
            for (const off of offsets) {
                const p = [mid[0] + off[0], mid[1] + off[1]];
                const [lo, hi] = rootIntervalToDistanceSquaredInterval(box, p);
                expect(lo).toBeLessThanOrEqual(hi);

                for (let i=0; i<=50; i++) {
                    const t = ts[0] + (ts[1]-ts[0])*i/50;
                    const d = squaredDistanceBetween(p, evalDeCasteljau(ps, t));
                    expect(d).toBeGreaterThanOrEqual(lo);
                    expect(d).toBeLessThanOrEqual(hi);
                }
            }
        }
    }
});


test('rootIntervalToDistanceSquaredInterval - the min is tight (not a corner distance)', function() {
    // A nearly flat piece of a curve with `p` sitting right above its middle:
    // the true minimum distance is about the vertical gap, while the
    // distance to the nearest box corner is much larger.
    const ps = [[0,0],[33,0.2],[66,0.2],[100,0]];
    const ts: [number, number] = [0.2, 0.8];
    const box = getIntervalBox(ps, ts);
    const p = [50, 10];

    const [lo] = rootIntervalToDistanceSquaredInterval(box, p);
    const nearestCornerSq = Math.min(
        ...[[box[0][0],box[0][1]],[box[0][0],box[1][1]],[box[1][0],box[0][1]],[box[1][0],box[1][1]]]
            .map(c => squaredDistanceBetween(p, c))
    );
    // the gap is ~10 so lo ~ 100, while the corners are ~30 away horizontally
    expect(lo).toBeLessThan(11**2);
    expect(nearestCornerSq).toBeGreaterThan(30**2);
});
