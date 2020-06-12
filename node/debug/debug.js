"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableDebugForMat = void 0;
const general_1 = require("./functions/general");
const two_prong_1 = require("./functions/two-prong");
const three_prong_1 = require("./functions/three-prong");
const draw_elem_1 = require("./functions/draw-elem/draw-elem");
function enableDebugForMat(debugOn) {
    var _a, _b, _c;
    if (!debugOn) {
        window._debug_ = undefined;
        return;
    }
    let debug = window._debug_;
    debug = Object.assign(Object.assign({}, debug), { generated: Object.assign(Object.assign({}, debug === null || debug === void 0 ? void 0 : debug.generated), { elems: Object.assign(Object.assign({}, (_a = debug === null || debug === void 0 ? void 0 : debug.generated) === null || _a === void 0 ? void 0 : _a.elems), { twoProng_regular: [], twoProng_failed: [], twoProng_notAdded: [], twoProng_deleted: [], twoProng_holeClosing: [], looseBoundingBox: [], tightBoundingBox: [], oneProng: [], oneProngAtDullCorner: [], sharpCorner: [], dullCorner: [], vertex: [], threeProng: [], boundingHull: [], mat: [], sat: [], cpNode: [], maxVertex: [], leaves: [], culls: [] }), timing: Object.assign(Object.assign({}, (_b = debug === null || debug === void 0 ? void 0 : debug.generated) === null || _b === void 0 ? void 0 : _b.timing), { holeClosers: 0, oneAnd2Prongs: 0, threeProngs: 0, sats: 0, simplifyMat: 0 }) }), fs: Object.assign(Object.assign(Object.assign(Object.assign({}, debug === null || debug === void 0 ? void 0 : debug.fs), { drawElem: Object.assign(Object.assign({}, (_c = debug === null || debug === void 0 ? void 0 : debug.fs) === null || _c === void 0 ? void 0 : _c.drawElem), draw_elem_1.drawElemFunctions) }), general_1.generalDebugFunctions), { twoProng: two_prong_1.twoProngDebugFunctions, threeProng: three_prong_1.threeProngDebugFunctions }), directives: Object.assign(Object.assign({}, debug === null || debug === void 0 ? void 0 : debug.directives), { stopAfterHoleClosers: false, stopAfterHoleClosersNum: undefined, stopAfterTwoProngs: false, stopAfterTwoProngsNum: undefined, stopAfterThreeProngs: false, stopAfterThreeProngsNum: undefined }) });
    window._debug_ = debug;
}
exports.enableDebugForMat = enableDebugForMat;
//# sourceMappingURL=debug.js.map