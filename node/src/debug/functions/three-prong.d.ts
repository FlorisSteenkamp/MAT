export interface IThreeProngDebugFunctions {
    drawSpokes: (n: number) => void;
    traceConvergence: (n: number, indx: number) => void;
    showBoundary: (n: number, indx: number) => void;
    logδs: (n: number) => void;
    logNearest: (p: number[], inclSpokes?: boolean, inclTrace?: boolean, inclBoundaries?: boolean) => void;
}
declare let threeProngDebugFunctions: IThreeProngDebugFunctions;
export { threeProngDebugFunctions };
