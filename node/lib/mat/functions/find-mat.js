"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mat_constants_1 = require("../../mat-constants");
const mat_tree_1 = require("../classes/mat-tree");
const circle_1 = require("../../geometry/classes/circle");
const point_on_shape_1 = require("../../geometry/classes/point-on-shape");
const add_2_prong_1 = require("./add-2-prong");
const find_2_prong_1 = require("./find-2-prong");
const build_mat_1 = require("./build-mat");
/**
 * Find the MAT from the given Shape.
 * @param shape
 */
function findMat(shape) {
    findAndAddHoleClosing2Prongs(shape);
    findAndAdd2ProngsOnAllPaths(shape);
    if (typeof window !== 'undefined' && window._debug_) {
        const _debug_ = window._debug_;
        _debug_.generated.timing.after2Prongs =
            performance.now();
    }
    //---- Connect the n-prong centers and add the 3-prongs.
    let contactPoints = shape.contactPointsPerLoop[0];
    let cpNode = contactPoints.head;
    do {
        if ((cpNode.item.matCircle.cpNodes.length === 2) &&
            !(cpNode.next.prevOnCircle === cpNode)) {
            break;
        }
        cpNode = cpNode.next;
    } while (cpNode !== contactPoints.head);
    let cptest = cpNode.prevOnCircle;
    let branchForth = build_mat_1.default(shape, cptest, undefined, undefined, false);
    let branchBack = build_mat_1.default(shape, cptest.prevOnCircle, undefined, undefined, false);
    branchForth.branches.push(branchBack.branches[0]);
    branchBack.branches[0].branches[0] = branchForth;
    let mat = new mat_tree_1.default(branchForth);
    if (typeof window !== 'undefined' && window._debug_) {
        const _debug_ = window._debug_;
        _debug_.generated.timing.after3Prongs =
            performance.now();
    }
    return fixMat(mat);
}
/**
 * Finds and adds two-prongs that removes any holes in the shape.
 * @param {Shape} shape
 * @returns {undefined}
 */
function findAndAddHoleClosing2Prongs(shape) {
    let extremes = shape.extremes;
    for (let k = 1; k < extremes.length; k++) {
        let extreme = extremes[k];
        let r = mat_constants_1.default.maxOsculatingCircleRadius;
        let p = [extreme.p[0], extreme.p[1] - r];
        let osculatingCircle = new circle_1.default(p, r);
        let posA2 = new point_on_shape_1.default(extreme.bezierNode, extreme.t, mat_constants_1.default.pointType.extreme, 0, //order 
        0);
        // A normal traversal should give (cyclically) A1->A2->B1->B2
        let twoProngInfo = find_2_prong_1.default(shape, posA2, true);
        let { circle, z } = twoProngInfo;
        let posA1 = z;
        let key = point_on_shape_1.default.makeSimpleKey(posA2.p);
        if (shape.straightUpHash[key]) {
            // Skip these when doing normal 2-prong procedure.
            shape.skip2ProngHash[key] = posA2;
        }
        add_2_prong_1.default(shape, circle, posA2, posA1, true);
    }
}
/**
 * Add 2 prongs.
 *
 * See comments on the add2Prong function.
 */
function findAndAdd2ProngsOnAllPaths(shape) {
    let for2ProngsArray = shape.for2ProngsArray;
    for (let k = 0; k < for2ProngsArray.length; k++) {
        let for2Prongs = for2ProngsArray[k];
        findAndAdd2Prongs(shape, k, for2Prongs);
    }
}
function findAndAdd2Prongs(shape, k, for2Prongs) {
    let len = for2Prongs.length;
    //let index = indexInterlaced(len); // Keep for debuggin.
    let index = indexLinear(len);
    for (let i = 0; i < len; i++) {
        let posNode = for2Prongs[index[i]];
        let pos = posNode.item;
        let key = point_on_shape_1.default.makeSimpleKey(pos.p);
        if (shape.skip2ProngHash[key]) {
            continue;
        }
        let twoProngInfo = find_2_prong_1.default(shape, pos, false);
        if (twoProngInfo) {
            let { circle, z } = twoProngInfo;
            add_2_prong_1.default(shape, circle, pos, z, false);
        }
        else {
            // failed
        }
    }
    /*
     * Don't delete - keep for future debugging.
     * Check if point orders follow each other - they absolutely must.
     */
    /*
    if (typeof FloMat !== 'undefined' && FloMat._debug_) {
        let contactPoints = shape.contactPointsPerLoop[k];
        let cpNode = contactPoints.head;
        let first = true;
        let prev = undefined;
        do {
            if (first) {
                first = false;
                prev = cpNode.item;
                cpNode = cpNode.next;
                continue;
            }
        
            let cmp = ContactPoint.compare(prev, cpNode.item);
            if (cmp >= 0) {
                console.log(cmp);
            }
            
            prev = cpNode.item;
            cpNode = cpNode.next;
        } while (cpNode !== contactPoints.head);
    }
    */
}
/**
 * This is unfortunately currently required since I can't get the buildMat
 * recursive algorithm right on the first pass.
 * @param mat
 */
function fixMat(mat) {
    f(mat.startNode, undefined);
    function f(matNode, priorNode) {
        if (matNode.branches.length === 3 &&
            (matNode.branches[2].matCircle === matNode.matCircle)) {
            let firstRight = matNode.branches[2];
            let secondRight = firstRight.branches[1];
            matNode.branches[2] = secondRight;
            secondRight.branches[0] = matNode;
        }
        for (let node of matNode.branches) {
            if (node === priorNode) {
                // Don't go back in tracks.
                continue;
            }
            f(node, matNode);
        }
    }
    return mat;
}
/**
 * Creates a kind of interlaced index vector, e.g. TODO
 *
 * @param n
 * @returns {number[]}
 */
/*
function indexInterlaced(n) {
    
    let arr = [];
    helper(0, n, arr);
    
    return arr;
    
    function helper(start, end) {
        
        if (end === start) {
            return;
        }
        
        if ((end - start) === 1) {
            arr.push(start);
            return;
        }
        
        
        let halfway = start + Math.floor((end-start) / 2);
        
        arr.push(halfway);
        helper(start, halfway);
        helper(halfway+1, end);
    }
}
*/
function indexInterlaced(n) {
    let source = {};
    let arr = [];
    // l <=> the lowest power of 2 so that 2^l > n
    let l = Math.pow(2, Math.floor(Math.log2(n)));
    while (l >= 1) {
        let k = 0;
        while (k < n) {
            if (!source[k]) {
                arr.push(k);
                source[k] = true;
            }
            k = k + l;
        }
        l = l / 2;
    }
    return arr;
}
/**
 * Simple linear array indexing.
 * @param n
 * @returns {number[]}
 */
function indexLinear(n) {
    let arr = [];
    for (let i = 0; i < n; i++) {
        arr.push(i);
    }
    return arr;
}
exports.default = findMat;
