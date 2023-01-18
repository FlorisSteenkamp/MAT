/** @hidden */
export interface IThreeProngDebugFunctions {
    drawSpokes: (g: SVGGElement, n: number) => void;
    traceConvergence: (g: SVGGElement, n: number, indx: number) => void;
    showBoundary: (g: SVGGElement, n: number, indx: number) => void;
    logδs: (n: number) => void;
    logNearest: (showSpokes?: boolean, showTrace?: boolean, showBoundaries?: boolean) => (g: SVGGElement, p: number[], showDelay?: number) => void;
}
/** @hidden */
declare const threeProngDebugFunctions: IThreeProngDebugFunctions;
export { threeProngDebugFunctions };
