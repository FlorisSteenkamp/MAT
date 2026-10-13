/** Returns a fresh (empty) set of debug `Elems`. */
function createEmptyElems() {
    return {
        looseBoundingBoxes: [],
        tightBoundingBoxes: [],
        boundingHulls: [],
        sharpCorners: [],
        dullCorners: []
    };
}
function enableDebugForMat(debugOn) {
    if (!debugOn) {
        globalThis._debug_ = undefined;
        return;
    }
    let debug = globalThis._debug_;
    debug = {
        ...debug,
        elems: {
            ...debug?.elems,
            ...createEmptyElems()
        },
        timing: {
            ...debug?.timing,
            holeClosers: 0,
            oneAnd2Prongs: 0,
            threeProngs: 0,
            sats: 0,
            simplifyMat: 0
        },
        fs: {
            ...debug?.fs
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
    globalThis._debug_ = debug;
}
export { enableDebugForMat, createEmptyElems };
//# sourceMappingURL=debug.js.map