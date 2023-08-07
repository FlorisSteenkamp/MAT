import { generalDebugFunctions } from './functions/general.js';
import { twoProngDebugFunctions } from './functions/two-prong.js';
import { threeProngDebugFunctions } from './functions/three-prong.js';
import { drawElemFunctions } from './functions/draw-elem/draw-elem.js';
function enableDebugForMat(debugOn) {
    if (!debugOn) {
        window._debug_ = undefined;
        return;
    }
    let debug = window._debug_;
    debug = {
        ...debug,
        generated: {
            //...debug?.generated,
            ...(!debug ? {} : !debug.generated ? {} : debug.generated),
            elems: {
                //...debug?.generated?.elems,
                ...(!debug ? {} : !debug.generated ? {} : !debug.generated.elems ? {} : debug.generated.elems),
                oneProng: [],
                oneProngAtDullCorner: [],
                twoProng_regular: [],
                twoProng_failed: [],
                twoProng_notAdded: [],
                twoProng_deleted: [],
                twoProng_holeClosing: [],
                looseBoundingBox: [],
                tightBoundingBox: [],
                sharpCorner: [],
                dullCorner: [],
                vertex: [],
                threeProng: [],
                boundingHull: [],
                mat: [],
                sat: [],
                cpNode: [],
                maxVertex: [],
                leaves: [],
                culls: [],
            },
            timing: {
                //...debug?.generated?.timing,
                ...(!debug ? {} : !debug.generated ? {} : !debug.generated.timing ? {} : debug.generated.timing),
                holeClosers: 0,
                oneAnd2Prongs: 0,
                threeProngs: 0,
                sats: 0,
                simplifyMat: 0,
            }
        },
        fs: {
            //...debug?.fs,
            ...(!debug ? {} : !debug.fs ? {} : debug.fs),
            drawElem: {
                //...debug?.fs?.drawElem,
                ...(!debug ? {} : !debug.fs ? {} : !debug.fs.drawElem ? {} : debug.fs.drawElem),
                ...drawElemFunctions
            },
            ...generalDebugFunctions,
            twoProng: twoProngDebugFunctions,
            threeProng: threeProngDebugFunctions,
        },
        directives: {
            //...debug?.directives,
            ...(!debug ? {} : !debug.directives ? {} : debug.directives),
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