export interface ICpDebugFunctions {
    log: () => void;
    next: () => void;
    prevOnCircle: () => void;
    draw: () => void;
}
/**
* Contact Point debug functions. Changes the state of
* the global window._debug_ object by keeping track of the currently selected contact point.
* @namespace cp
* @memberOf d.fs
*/
declare let cpDebugFunctions: {
    log: () => void;
    next: () => void;
    prevOnCircle: () => void;
    draw: () => void;
};
export { cpDebugFunctions };
