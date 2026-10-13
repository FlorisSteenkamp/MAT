import type { Mat } from "../src/mat/mat.js";
import type { CpNodeStringifyable } from "../src/cp-node/stringification/cp-node-stringifyable.js";
import type { Circle } from "../src/geometry/circle.js";
import { findMats } from "../src/find-mat/find-mats.js";
import { fromStringifyable } from "../src/cp-node/stringification/from-stringifyable.js";



// One `Circle` object per on-circle ring (shared by all the ring's `CpNode`s
// and by no other ring) - see `PointOnShape.circle`. The fixture has no hole
// closers, so there are no twin rings with equal-but-distinct circles.
const circle_0_1: Circle = { center: [24, 8], radius: 0 };
const circle_10_11: Circle = { center: [46, -5.21425847941623], radius: 13.21425847941623 };
const circle_142_143_144: Circle = { center: [81.5, -12.641417453935567], radius: 41.064803841095305 };
const circle_145_146_147: Circle = { center: [81.5, 18.5], radius: 35.5 };
const circle_2_3: Circle = { center: [46, 54], radius: 0 };
const circle_4_5: Circle = { center: [117, 54], radius: 0 };
const circle_6_7: Circle = { center: [139, 8], radius: 0 };
const circle_8_9: Circle = { center: [82, -101], radius: 0 };
const circle_148_149_150: Circle = { center: [81.68410160768288, -12.970446490933696], radius: 41.07276841516263 };
const circle_118_119: Circle = { center: [115.9110440340909, -5.952334953607174], radius: 13.994766012811272 };


/** mat-demo: "achispado" font, "comma" glyph - fixed MAT fixture */
const cpNodeStringifyable1: CpNodeStringifyable = {
    cpNodes: [
        {
            id: 0,
            isHoleClosing: false,
            isIntersection: false,
            pointOnShape: {
                circle: circle_0_1,
                curveIdx: 0,
                loopIdx: 0,
                p: [24, 8],
                pDd: [[0,24],[0,8]],
                t: 1,
                isSource: true,
                order: -1,
                order2: 0
            },
            prev: 11,
            next: 1,
            prevOnCircle: 1,
            nextOnCircle: 1
        },
        { id: 1,   isHoleClosing: false, isIntersection: false, pointOnShape: { circle: circle_0_1, curveIdx: 0, loopIdx: 0, p: [24, 8],                           t: 1,                    isSource: true  , order: 1,                     order2: 0, pDd: [[0,24],[0,8]] }, prev: 0,   next: 10,  prevOnCircle: 0,   nextOnCircle: 0   },
        { id: 10,  isHoleClosing: false, isIntersection: false, pointOnShape: { circle: circle_10_11, curveIdx: 1, loopIdx: 0, p: [46, 8],                           t: 1,                    isSource: true  , order: -1,                    order2: 0, pDd: [[0,46],[0,8]] }, prev: 1,   next: 144, prevOnCircle: 11,  nextOnCircle: 11  },
        { id: 144, isHoleClosing: false, isIntersection: false, pointOnShape: { circle: circle_142_143_144, curveIdx: 1, loopIdx: 0, p: [46, 8],                           t: 1,                    isSource: false , order: -0.5026547194480646,   order2: 0, pDd: [[0,46],[0,8]] }, prev: 10,  next: 147, prevOnCircle: 143, nextOnCircle: 142 },
        { id: 147, isHoleClosing: false, isIntersection: false, pointOnShape: { circle: circle_145_146_147, curveIdx: 2, loopIdx: 0, p: [46, 18.499999999999996],           t: 0.2282608695652173,   isSource: false , order: 0,                     order2: 0, pDd: [[0,46],[0,18.499999999999996]] }, prev: 144, next: 2,   prevOnCircle: 146, nextOnCircle: 145 },
        { id: 2,   isHoleClosing: false, isIntersection: false, pointOnShape: { circle: circle_2_3, curveIdx: 2, loopIdx: 0, p: [46, 54],                          t: 1,                    isSource: true  , order: -1,                    order2: 0, pDd: [[0,46],[0,54]] }, prev: 147, next: 3,   prevOnCircle: 3,   nextOnCircle: 3   },
        { id: 3,   isHoleClosing: false, isIntersection: false, pointOnShape: { circle: circle_2_3, curveIdx: 2, loopIdx: 0, p: [46, 54],                          t: 1,                    isSource: true  , order: 1,                     order2: 0, pDd: [[0,46],[0,54]] }, prev: 2,   next: 145, prevOnCircle: 2,   nextOnCircle: 2   },
        { id: 145, isHoleClosing: false, isIntersection: false, pointOnShape: { circle: circle_145_146_147, curveIdx: 3, loopIdx: 0, p: [81.5, 54],                        t: 0.5,                  isSource: false , order: 0,                     order2: 0, pDd: [[0,81.5],[0,54]] }, prev: 3,   next: 4,   prevOnCircle: 147, nextOnCircle: 146 },
        { id: 4,   isHoleClosing: false, isIntersection: false, pointOnShape: { circle: circle_4_5, curveIdx: 3, loopIdx: 0, p: [117, 54],                         t: 1,                    isSource: true  , order: -1,                    order2: 0, pDd: [[0,117],[0,54]] }, prev: 145, next: 5,   prevOnCircle: 5,   nextOnCircle: 5   },
        { id: 5,   isHoleClosing: false, isIntersection: false, pointOnShape: { circle: circle_4_5, curveIdx: 3, loopIdx: 0, p: [117, 54],                         t: 1,                    isSource: true  , order: 1,                     order2: 0, pDd: [[0,117],[0,54]] }, prev: 4,   next: 146, prevOnCircle: 4,   nextOnCircle: 4   },
        { id: 146, isHoleClosing: false, isIntersection: false, pointOnShape: { circle: circle_145_146_147, curveIdx: 4, loopIdx: 0, p: [117, 18.499999999999996],          t: 0.7717391304347827,   isSource: false , order: 0,                     order2: 0, pDd: [[0,117],[0,18.499999999999996]] }, prev: 5,   next: 142, prevOnCircle: 145, nextOnCircle: 147 },
        { id: 142, isHoleClosing: false, isIntersection: false, pointOnShape: { circle: circle_142_143_144, curveIdx: 4, loopIdx: 0, p: [117, 8],                          t: 1,                    isSource: false , order: -0.8644872659655476,   order2: 0, pDd: [[0,117],[0,8]] }, prev: 146, next: 148, prevOnCircle: 144, nextOnCircle: 143 },
        { id: 148, isHoleClosing: false, isIntersection: false, pointOnShape: { circle: circle_148_149_150, curveIdx: 4, loopIdx: 0, p: [117, 8],                   t: 1,                    isSource: false , order: -0.8598373023056252,   order2: 0, pDd: [[0,117],[0,8]] }, prev: 142, next: 119, prevOnCircle: 150, nextOnCircle: 149 },
        { id: 119, isHoleClosing: false, isIntersection: false, pointOnShape: { circle: circle_118_119, curveIdx: 4, loopIdx: 0, p: [117, 8],                   t: 1,                    isSource: false , order: -0.07781165936695383,  order2: 0, pDd: [[0,117],[0,8]] }, prev: 148, next: 6,   prevOnCircle: 118, nextOnCircle: 118 },
        { id: 6,   isHoleClosing: false, isIntersection: false, pointOnShape: { circle: circle_6_7, curveIdx: 5, loopIdx: 0, p: [139, 8],                          t: 1,                    isSource: true  , order: -1,                    order2: 0, pDd: [[0,139],[0,8]] }, prev: 119, next: 7,   prevOnCircle: 7,   nextOnCircle: 7   },
        { id: 7,   isHoleClosing: false, isIntersection: false, pointOnShape: { circle: circle_6_7, curveIdx: 5, loopIdx: 0, p: [139, 8],                          t: 1,                    isSource: true  , order: 1,                     order2: 0, pDd: [[0,139],[0,8]] }, prev: 6,   next: 118, prevOnCircle: 6,   nextOnCircle: 6   },
        { id: 118, isHoleClosing: false, isIntersection: false, pointOnShape: { circle: circle_118_119, curveIdx: 6, loopIdx: 0, p: [128.3125, -12.4375],         t: 0.1875,               isSource: true  , order: 0,                     order2: 0, pDd: [[0,128.3125],[0,-12.4375]] }, prev: 7,   next: 149, prevOnCircle: 119, nextOnCircle: 119 },
        { id: 149, isHoleClosing: false, isIntersection: false, pointOnShape: { circle: circle_148_149_150, curveIdx: 6, loopIdx: 0, p: [118.08071791640388, -32.003539423017145], t: 0.36700494883501966, isSource: false , order: 0, order2: 0, pDd: [[0,118.08071791640388],[0,-32.003539423017145]] }, prev: 118, next: 8,   prevOnCircle: 148, nextOnCircle: 150 },
        { id: 8,   isHoleClosing: false, isIntersection: false, pointOnShape: { circle: circle_8_9, curveIdx: 6, loopIdx: 0, p: [82, -101],                        t: 1,                    isSource: true  , order: -1,                    order2: 0, pDd: [[0,82],[0,-101]] }, prev: 149, next: 9,   prevOnCircle: 9,   nextOnCircle: 9   },
        { id: 9,   isHoleClosing: false, isIntersection: false, pointOnShape: { circle: circle_8_9, curveIdx: 6, loopIdx: 0, p: [82, -101],                        t: 1,                    isSource: true  , order: 1,                     order2: 0, pDd: [[0,82],[0,-101]] }, prev: 8,   next: 150, prevOnCircle: 8,   nextOnCircle: 8   },
        { id: 150, isHoleClosing: false, isIntersection: false, pointOnShape: { circle: circle_148_149_150, curveIdx: 0, loopIdx: 0, p: [45.425023320690585, -32.264267964746104],  t: 0.6306030461949899, isSource: false , order: 0, order2: 0, pDd: [[0,45.425023320690585],[0,-32.264267964746104]] }, prev: 9,   next: 143, prevOnCircle: 149, nextOnCircle: 148 },
        { id: 143, isHoleClosing: false, isIntersection: false, pointOnShape: { circle: circle_142_143_144, curveIdx: 0, loopIdx: 0, p: [45.24795284642707, -31.931497590699145],   t: 0.6336559854064299, isSource: false , order: 0, order2: 0, pDd: [[0,45.24795284642707],[0,-31.931497590699145]] }, prev: 150, next: 11,  prevOnCircle: 142, nextOnCircle: 144 },
        { id: 11,  isHoleClosing: false, isIntersection: false, pointOnShape: { circle: circle_10_11, curveIdx: 0, loopIdx: 0, p: [34.33444028251029, -11.421620530924521],   t: 0.8218199951291328, isSource: false , order: 0, order2: 0, pDd: [[0,34.33444028251029],[0,-11.421620530924521]] }, prev: 143, next: 0,   prevOnCircle: 10,  nextOnCircle: 10  }
    ],
    loops: [
        { idx: 0, beziers: [[[82, -101], [24, 8]], [[24, 8], [46, 8]], [[46, 8], [46, 54]], [[46, 54], [117, 54]], [[117, 54], [117, 8]], [[117, 8], [139, 8]], [[139, 8], [82, -101]]] }
    ]
};


// We use this one in tests since it is fixed and not susceptible to
// small perturbations in the algorithm.
function getMats1(): Mat[] {
    const cpNode = fromStringifyable(cpNodeStringifyable1);

    return [{ cpNode, meta: {
        cpTrees: undefined!,
        loops: undefined!,
        lastInsertId: undefined!,
        maxCoordPowerOf2: undefined!,
        squaredDiagonalLength: undefined!
    } }];
}


/** mat-demo: "achispado" font, "comma" glyph */
const loops1 = [
    [
        [[139, 8], [82, -101]],
        [[82, -101], [24, 8]],
        [[24, 8], [46, 8]],
        [[46, 8], [46, 54]],
        [[46, 54], [117, 54]],
        [[117, 54], [117, 8]],
        [[117, 8], [139, 8]],
        [[139, 8], [139, 8]]
    ]
];


// Cache
let _mats1: Mat[] | undefined = undefined;
function _getMats1() {
    if (_mats1) { return _mats1; }

    _mats1 = findMats(loops1, {
        applySat: false,
        simplify: true,
        satScale: 1.675,
        maxCurviness: 0.05,
        maxLength: 40,
        // maxCurviness: 5,
        // maxLength: 4000,
        angleIncrement: 15,
        simplifyTolerance: 2**-1
    });

    return _mats1;
}


export {
    getMats1,
    cpNodeStringifyable1,
    // _getMats1
}
