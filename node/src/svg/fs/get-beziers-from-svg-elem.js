"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_data_polyfill_1 = require("../path-data-polyfill/path-data-polyfill");
const push_bezier_1 = require("../fs/push-bezier");
const path_state_1 = require("../path-state");
const m_1 = require("../path-segment/m");
const z_1 = require("../path-segment/z");
const c_1 = require("../path-segment/c");
const s_1 = require("../path-segment/s");
const l_1 = require("../path-segment/l");
const h_1 = require("../path-segment/h");
const v_1 = require("../path-segment/v");
const q_1 = require("../path-segment/q");
const t_1 = require("../path-segment/t");
const a_1 = require("../path-segment/a");
/**
 * Get the cubic beziers from the given SVG DOM element. If a path
 * data tag is not "C", i.e. if it is not an absolute cubic bezier
 * coordinate then it is converted into one.
 * @param elem - An SVG element
 * @returns aaa
 */
function getBeziersFromSvgElem(elem) {
    path_data_polyfill_1.pathDataPolyFill(); // Ensure polyfill has been applied
    let paths = elem.getPathData();
    // TODO - must still implement handling of multiple <path>s
    //if (paths.length < 2) {
    if (paths.length < 1) {
        return []; // A shape is not described   
    }
    let pathState = new path_state_1.PathState();
    let bezierArrays = [];
    let bezierArray = [];
    for (let i = 0; i < paths.length; i++) {
        let pathSeg = paths[i];
        pathState.vals = pathSeg.values;
        pathState.addX = 0;
        pathState.addY = 0;
        if (pathSeg.type == pathSeg.type.toLowerCase()) {
            pathState.addX = pathState.x0;
            pathState.addY = pathState.y0;
        }
        let prevType = pathState.type;
        pathState.type = pathSeg.type.toUpperCase();
        if (pathState.type === 'M') {
            // This is a subpath, close as if the previous command was a Z or z.
            if (pathState.pathStarted) {
                if (prevType !== 'Z') {
                    push_bezier_1.pushBezier(bezierArray, z_1.z(pathState), pathState.j++);
                }
            }
            if (bezierArray.length) {
                bezierArrays.push(bezierArray);
                bezierArray = [];
            }
        }
        else {
            if (!pathState.pathStarted) {
                throw new Error('Invalid SVG - every new path must start with an M or m.');
            }
        }
        const pathFs = { a: a_1.a, c: c_1.c, h: h_1.h, l: l_1.l, m: m_1.m, q: q_1.q, s: s_1.s, t: t_1.t, v: v_1.v, z: z_1.z };
        let f = pathFs[pathState.type.toLowerCase()];
        if (!f) {
            throw new Error('Invalid SVG - command not recognized.');
        }
        push_bezier_1.pushBezier(bezierArray, f(pathState), pathState.j++);
    }
    if (bezierArray.length) {
        bezierArrays.push(bezierArray);
        bezierArray = [];
    }
    return bezierArrays;
}
exports.getBeziersFromSvgElem = getBeziersFromSvgElem;
