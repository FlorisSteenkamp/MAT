
/** @hidden */
class PathState {
    initialPoint: number[] = undefined;    
    p: number[];
    vals: number[];

    // Used in conjunction with "S", "s"
    prev2ndCubicControlPoint: number[] = undefined;
    // Used in conjunction with "T", "t"
    prev2ndQuadraticControlPoint: number[] = undefined;

    constructor() {
        this.p = [0,0];
    }
}


export { PathState };
