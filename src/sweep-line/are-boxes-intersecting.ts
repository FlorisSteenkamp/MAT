
/**
 * @hidden
 * Returns true if the 2 given (closed) boxes intersect. At this stage we already
 * know their x-axis intersect.
 * @param a A rectangular box
 * @param a Another rectangular box
 * @param closed (defaults to true) Interpret boxes as being closed (i.e. they
 * contain their border) or open.
 */
function areBoxesIntersecting(closed: boolean) {
    return (a: number[][], b: number[][]): boolean => {

        let [[ax0, ay0],[ax1, ay1]] = a;
        let [[bx0, by0],[bx1, by1]] = b;

        // Swap so smaller coordinate comes first
        if (ay0 > ay1) { [ay0,ay1] = [ay1,ay0] };
        if (by0 > by1) { [by0,by1] = [by1,by0] };
        if (ax0 > ax1) { [ax0,ax1] = [ax1,ax0] };
        if (bx0 > bx1) { [bx0,bx1] = [bx1,bx0] };

        return closed
            ? (
                ax0 <= bx1 && ax1 >= bx0 && 
                by0 <= ay1 && by1 >= ay0
            )
            : (
                ax0 < bx1 && ax1 > bx0 && 
                by0 < ay1 && by1 > ay0
            )
    }
}


export { areBoxesIntersecting }
