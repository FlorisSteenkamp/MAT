
class Corner {
    beziers: number[][][];
    tans: number[][];

    constructor(beziers: number[][][], tans: number[][]) {
        this.beziers = beziers;
        this.tans    = tans;
    }
}

export default Corner;