"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const push_bezier_1 = require("../fs/push-bezier");
const path_state_1 = require("../path-state");
const z_1 = require("../path-segment/z");
const c_1 = require("../path-segment/c");
const s_1 = require("../path-segment/s");
const l_1 = require("../path-segment/l");
const h_1 = require("../path-segment/h");
const v_1 = require("../path-segment/v");
const q_1 = require("../path-segment/q");
const t_1 = require("../path-segment/t");
const a_1 = require("../path-segment/a");
const pathFs = { a: a_1.a, c: c_1.c, h: h_1.h, l: l_1.l, q: q_1.q, s: s_1.s, t: t_1.t, v: v_1.v, z: z_1.z };
/**
 * Get the cubic beziers from the given SVG DOM element. If a path
 * data tag is not "C", i.e. if it is not an absolute cubic bezier
 * coordinate then it is converted into one.
 * @param elem - An SVG element
 * @returns aaa
 */
function getBeziersFromRawPaths(paths) {
    if (paths.length === 0) {
        return []; // A shape is not described   
    }
    if (paths[0].type.toLowerCase() !== 'm') {
        throw new Error('Invalid SVG - every new path must start with an M or m.');
    }
    let s = new path_state_1.PathState();
    let beziersArrays = [];
    let beziers = [];
    let max = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < paths.length; i++) {
        let path = paths[i];
        for (let j = 0; j < path.values.length; j++) {
            let v = path.values[j];
            if (max < v) {
                max = v;
            }
        }
    }
    let type = undefined;
    let prevType;
    for (let i = 0; i < paths.length; i++) {
        prevType = type;
        let pathSeg = paths[i];
        type = pathSeg.type.toLowerCase();
        s.vals = pathSeg.values;
        /*
        if (pathSeg.values[0] === 109.637) {
            console.log('109')
        }
        */
        if (pathSeg.type === pathSeg.type.toLowerCase()) {
            if (type === 'v') {
                s.vals[0] += s.p[1];
            }
            else if (type === 'a') {
                s.vals[5] += s.p[0];
                s.vals[6] += s.p[1];
            }
            else {
                for (let i = 0; i < s.vals.length; i++) {
                    s.vals[i] += s.p[i % 2];
                }
            }
        }
        if (type === 'm') {
            if (beziers.length) {
                // This is a subpath, close as if the previous command was a 
                // Z or z.
                if (prevType !== 'z') {
                    push_bezier_1.pushBezier(beziers, z_1.z(s), s, max);
                }
                // Start new path
                beziersArrays.push(beziers);
                beziers = [];
            }
            s.initialPoint = s.p = s.vals;
            continue;
        }
        let f = pathFs[type];
        if (!f) {
            throw new Error('Invalid SVG - command not recognized.');
        }
        let ps = f(s);
        s.p = ps[3]; // Update current point
        push_bezier_1.pushBezier(beziers, ps, s, max);
    }
    if (beziers.length) {
        //beziersArrays.push(beziers);
        // This is a subpath, close as if the previous command was a 
        // Z or z.
        if (prevType !== 'z') {
            push_bezier_1.pushBezier(beziers, z_1.z(s), s, max);
        }
        // Start new path
        beziersArrays.push(beziers);
    }
    return beziersArrays;
}
exports.getBeziersFromRawPaths = getBeziersFromRawPaths;
