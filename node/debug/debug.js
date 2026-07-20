import { drawElemFs } from './functions/draw-elem/draw-elem.js';
function enableDebugForMat(debugOn) {
    if (!debugOn) {
        window._debug_ = undefined;
        return;
    }
    let debug = window._debug_;
    debug = {
        ...debug,
        elems: {
            ...debug?.elems,
            // @ts-ignore
            oneProng: [],
            // oneProngAtDullCorner : [],
            twoProng: [],
            // twoProng_regular     : [],
            // twoProng_failed      : [],
            // twoProng_notAdded    : [],
            // twoProng_deleted     : [],
            // twoProng_holeClosing : [],
            looseBoundingBox: [],
            tightBoundingBox: [],
            // sharpCorner          : [],
            // dullCorner           : [],
            vertex: [],
            threeProng: [],
            boundingHull: [],
            mat: [],
            // sat                  : [],
            cpNode: [],
            maxVertex: [],
            leaves: [],
            // culls                : [],
        },
        timing: {
            ...debug?.timing,
            holeClosers: 0,
            oneAnd2Prongs: 0,
            threeProngs: 0,
            sats: 0,
            simplifyMat: 0,
        },
        fs: {
            ...debug?.fs,
            drawElem: {
                ...debug?.fs?.drawElem,
                ...drawElemFs
            }
        },
        directives: {
            //...debug?.directives,
            ...debug?.directives,
            stopAfterHoleClosers: false,
            stopAfterHoleClosersNum: undefined,
            stopAfterTwoProngs: false,
            stopAfterTwoProngsNum: undefined,
            stopAfterThreeProngs: false,
            stopAfterThreeProngsNum: undefined,
        }
    };
    window._debug_ = debug;
}
export { enableDebugForMat };
//# sourceMappingURL=debug.js.map