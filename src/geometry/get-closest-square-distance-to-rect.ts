/**
 * Returns the closest squared distance from the point `p` to the given 
 * axis-aligned box `[[minX, minY], [maxX, maxY]]`, i.e. `0` if `p` is inside.
 * 
 * @internal
 */
function getClosestSquareDistanceToRect(
        box: number[][], p: number[]): number {

    const p0 = box[0];
    const p1 = box[1];
    const x0 = p0[0];
    const y0 = p0[1];
    const x1 = p1[0];
    const y1 = p1[1];
    const xp = p[0];
    const yp = p[1];

    if (xp < x0) {
        if (yp < y0) {
            return (x0 - xp)**2 + (y0 - yp)**2;
        } else if (yp > y1) {
            return (x0 - xp)**2 + (yp - y1)**2;
        } else {
            return (x0 - xp)**2;
        }
    } else if (xp > x1) {
        if (yp < y0) {
            return (xp - x1)**2 + (y0 - yp)**2;
        } else if (yp > y1) {
            return (xp - x1)**2 + (yp - y1)**2;
        } else {
            return (xp - x1)**2;
        }
    } else {
        if (yp < y0) {
            return (y0 - yp)**2;
        } else if (yp > y1) {
            return (yp - y1)**2;
        } 

        return 0;
    }
}


export { getClosestSquareDistanceToRect }
