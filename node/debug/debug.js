"use strict";
//import * as Vector from 'flo-vector2d';
//import * as Bezier3 from 'flo-bezier3';
Object.defineProperty(exports, "__esModule", { value: true });
const general_1 = require("./functions/general");
const two_prong_1 = require("./functions/two-prong");
const three_prong_1 = require("./functions/three-prong");
const draw_elem_1 = require("./functions/draw-elem/draw-elem");
const flo_draw_1 = require("flo-draw");
class Generated {
    constructor(path, g) {
        this.path = path;
        this.g = g;
        this.elems = {
            twoProng_regular: [],
            twoProng_failed: [],
            twoProng_notAdded: [],
            twoProng_deleted: [],
            twoProng_holeClosing: [],
            looseBoundingBox: [],
            tightBoundingBox: [],
            oneProng: [],
            oneProngAtDullCorner: [],
            sharpCorner: [],
            dullCorner: [],
            vertex: [],
            minY: [],
            threeProng: [],
            boundingHull: [],
            mat: [],
            sat: [],
            cpNode: [],
            loop: [],
            loops: [],
            maxVertex: [],
            leaves: [],
            culls: [],
            intersection: [],
        };
        this.timing = {
            simplify: [0, 0],
            holeClosers: [0, 0],
            oneAnd2Prongs: [0, 0],
            threeProngs: [0, 0],
            mats: [0, 0],
            sats: [0, 0]
        };
    }
}
exports.Generated = Generated;
class MatDebug {
    /**
     * @param fs - some useful functions.
     */
    constructor() {
        // These are included only for quick debugging from console
        //(this as any).Bezier3  = Bezier3;
        //(this as any).Vector2d = Vector; 
        /* The current path for which MATs are being found */
        this.generated = undefined;
        this.directives = {
            stopAfterHoleClosers: false,
            stopAfterHoleClosersNum: undefined,
            stopAfterTwoProngs: false,
            stopAfterTwoProngsNum: undefined,
            stopAfterThreeProngs: false,
        };
        /**
         * These functions are meant to be used in the console, e.g. in the
         * console try typing d.fs.twoProng.traceConvergence(0);
         */
        this.fs = Object.assign(Object.assign({ draw: flo_draw_1.drawFs }, general_1.generalDebugFunctions), { twoProng: two_prong_1.twoProngDebugFunctions, threeProng: three_prong_1.threeProngDebugFunctions, drawElem: draw_elem_1.drawElemFunctions });
    }
    createNewGenerated(
    //bezierLoops: number[][][][],
    path, g) {
        this.generated = new Generated(path, g);
        //this.generatedAll.set(bezierLoops, this.generated);
    }
}
exports.MatDebug = MatDebug;
//# sourceMappingURL=debug.js.map