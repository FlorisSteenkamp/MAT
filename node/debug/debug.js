function enableDebugForMat(debugOn) {
    if (!debugOn) {
        window._debug_ = undefined;
        return;
    }
    let debug = window._debug_;
    debug = {
        ...debug,
        elems: {
            ...debug?.elems
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
    window._debug_ = debug;
}
export { enableDebugForMat };
//# sourceMappingURL=debug.js.map