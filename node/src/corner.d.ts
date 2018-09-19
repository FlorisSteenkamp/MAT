declare class Corner {
    tans: number[][];
    crossTangents: number;
    isSharp: boolean;
    isDull: boolean;
    isQuiteSharp: boolean;
    isQuiteDull: boolean;
    constructor(tans: number[][], crossTangents: number, isSharp: boolean, isDull: boolean, isQuiteSharp: boolean, isQuiteDull: boolean);
}
export { Corner };
