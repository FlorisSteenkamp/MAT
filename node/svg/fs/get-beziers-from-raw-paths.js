"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
/** @hidden */
const pathFs = {
    a: a_1.a,
    c: // elliptical arc
    c_1.c,
    h: // cubic bezier
    h_1.h,
    l: // horizontal line
    l_1.l,
    q: // line
    q_1.q,
    s: // quadratic bezier
    s_1.s,
    t: // cubic bezier (smooth)
    t_1.t,
    v: // quadratic bezier (smooth)
    v_1.v,
    z: // vertical line
    z_1.z // close path
};
/**
 * @hidden
 * Returns order 1, 2 and 3 beziers from the given SVG DOM element. If a path
 * data tag is not "C, Q or L, etc", i.e. if it is not an absolute bezier
 * coordinate then it is converted into one.
 * @param paths An SVG element
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
    let prevType;
    for (let i = 0; i < paths.length; i++) {
        let pathSeg = paths[i];
        let type = pathSeg.type.toLowerCase();
        s.vals = pathSeg.values;
        // If pathSeg was lowercase, it is relative - make absolute
        if (pathSeg.type === type) {
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
                    beziers.push(z_1.z(s));
                }
                // Start new path
                beziersArrays.push(beziers);
                beziers = [];
            }
            s.initialPoint = s.p = s.vals;
            prevType = type;
            continue;
        }
        let f = pathFs[type];
        if (!f) {
            throw new Error('Invalid SVG - command not recognized.');
        }
        let ps = f(s);
        s.p = ps[ps.length - 1]; // Update current point
        beziers.push(ps);
        prevType = type;
    }
    if (beziers.length) {
        // This is a subpath, close as if the previous command was a Z or z.
        if (prevType !== 'z') {
            beziers.push(z_1.z(s));
        }
        // Start new path
        beziersArrays.push(beziers);
    }
    return beziersArrays;
}
exports.getBeziersFromRawPaths = getBeziersFromRawPaths;
//# sourceMappingURL=get-beziers-from-raw-paths.js.map