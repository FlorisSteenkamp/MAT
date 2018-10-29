export interface IThreeProngDebugFunctions {
    drawSpokes: (n: number) => void;
    traceConvergence: (n: number, indx: number) => void;
    showBoundary: (n: number, indx: number) => void;
    logδs: (n: number) => void;
    logNearest: (showSpokes?: boolean, showTrace?: boolean, showBoundaries?: boolean) => (p: number[], showDelay?: number) => void;
}
declare let threeProngDebugFunctions: IThreeProngDebugFunctions;
export { threeProngDebugFunctions };
