
class PathState {
    initialPoint: number[] = undefined;    
    p: number[];
    vals: number[];

    // Used in conjunction with "S" and "s"
    prev2ndCubicControlPoint: number[] = undefined;
    prev2ndQuadraticControlPoint: number[] = undefined;

    constructor() {
        this.p = [0,0];
    }
}


export { PathState };
