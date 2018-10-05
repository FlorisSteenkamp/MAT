"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loop_1 = require("../../../loop");
const get_loop_bounds_1 = require("../get-loop-bounds");
const get_intersections_1 = require("./get-intersections");
const complete_path_1 = require("./complete-path");
const get_tightest_containing_loop_1 = require("./get-tightest-containing-loop");
/**
 * Uses the algorithm of Lavanya Subramaniam (PARTITION OF A NON-SIMPLE POLYGON
 * INTO SIMPLE POLYGONS) but modified to use cubic bezier curves (as opposed to
 * polygons) and to additionally take care of paths with multiple subpaths, i.e.
 * such as disjoint nested paths.
 * @param loops An array of possibly intersecting paths
 */
function simplifyPaths(loops) {
    /*
    let s = '';
    for (let loop of loops) {
        s = s + '\n\n' + beziersToSvgPathStr(loop.curves.map(c => c.ps), 5)
    }
    console.log(s);
    */
    /** A map from each curve to an array of intersections on that curve. */
    let intersections = get_intersections_1.getIntersections(loops);
    let loopsTaken = new Set();
    let root = {
        parent: undefined,
        children: new Set(),
        beziers: undefined,
        loop: undefined,
        orientation: undefined,
        windingNum: 0
    };
    loops.sort(ascendingByTopmostPoint);
    if (typeof _debug_ !== 'undefined') {
        for (let loop of loops) {
            _debug_.fs.nameObj(loop);
        }
    }
    for (let loop of loops) {
        // TODO - handle special case of 1 curve - mayve just delete lines below
        if (loop.curves.length <= 1) {
            continue;
        }
        if (loopsTaken.has(loop)) {
            continue;
        }
        loopsTaken.add(loop);
        let parent = get_tightest_containing_loop_1.getTightestContainingLoop(root, loop);
        complete_path_1.completePath(intersections, loopsTaken, parent, loop);
    }
    // Take the forest of trees, create a new root making it a tree and snip
    // branches such that each branch determines a new set of loops each 
    // representing an individual independent shape that possess its own Medial
    // Axis Transform (still to be determined).
    let loopTrees = splitLoopTrees(root);
    let iLoopSets = loopTrees.map(getLoopsFromTree);
    let loopss = iLoopSets.map(loopSet => loopSet.map(ILoopToLoop));
    /*
    let str = '';
    for (let simplePaths of loopss) {
        //console.log(str)
        for (let loop of simplePaths) {
            str = str + '\n\n' + beziersToSvgPathStr(
                loop.curves.map(c => c.ps),
                5
            )
        }
        //console.log(str)
        //console.log('-----------------');
    }
    console.log(str)
    */
    let xMap = new Map();
    for (let intersection of intersections) {
        for (let x of intersection[1]) {
            if (x.isDummy) {
                continue;
            }
            xMap.set(x.outPs, { ps: x.opposite.outPs });
            if (typeof _debug_ !== 'undefined') {
                _debug_.generated.elems.intersection.push(x);
            }
        }
    }
    return { loopss, xMap };
}
exports.simplifyPaths = simplifyPaths;
/**
 *
 * @param iLoop
 */
function ILoopToLoop(iLoop) {
    return new loop_1.Loop(iLoop.beziers);
}
function splitLoopTrees(root) {
    let iLoopTrees = [];
    let nodeStack = [root];
    while (nodeStack.length) {
        let parent = nodeStack.pop();
        for (let child of parent.children) {
            if (parent.windingNum === 0) {
                iLoopTrees.push(child);
            }
            nodeStack.push(child);
        }
        if (parent.windingNum === 0) {
            parent.children = new Set(); // Make it a leaf
        }
    }
    return iLoopTrees;
}
/**
 * Returns an array of LoopTrees from the given LoopTree where each returned
 * LoopTree is one of the nodes of the tree. Nodes with winding number > 1 are
 * not returned.
 * @param root
 */
function getLoopsFromTree(root) {
    let loopTrees = [];
    let stack = [root];
    while (stack.length) {
        let node = stack.pop();
        f(node);
    }
    return loopTrees;
    function f(parent) {
        if (Math.abs(parent.windingNum) <= 1) {
            loopTrees.push(parent);
        }
        for (let child of parent.children) {
            stack.push(child);
        }
    }
}
/**
 *
 * @param loopA
 * @param loopB
 */
function ascendingByTopmostPoint(loopA, loopB) {
    let boundsA = get_loop_bounds_1.getLoopBounds(loopA);
    let boundsB = get_loop_bounds_1.getLoopBounds(loopB);
    let a = boundsA.minY.p[1];
    let b = boundsB.minY.p[1];
    return a - b;
}
