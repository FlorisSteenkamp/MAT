
declare var _debug_: MatDebug; 

import { MatDebug } from '../../../debug/debug';

import { Loop } from '../../../loop/loop';

import { getLoopBounds } from '../get-loop-bounds';

import { ILoopTree } from './i-loop-tree';

import { getIntersections } from './get-intersections';
import { completePath     } from './complete-path';
import { getTightestContainingLoop } from './get-tightest-containing-loop';


/**
 * Uses the algorithm of Lavanya Subramaniam (PARTITION OF A NON-SIMPLE POLYGON 
 * INTO SIMPLE POLYGONS) but modified to use cubic bezier curves (as opposed to
 * polygons) and to additionally take care of paths with multiple subpaths, i.e.
 * such as disjoint nested paths.
 * @param loops An array of possibly intersecting paths
 */
function simplifyPaths(loops: Loop[]) {
    /** A map from each curve to an array of intersections on that curve. */
    let intersections = getIntersections(loops);

    let loopsTaken: Set<Loop> = new Set();

    let root: ILoopTree = {
        parent      : undefined,
        children    : new Set(),
        beziers     : undefined,
        loop        : undefined,
        orientation : undefined,
        windingNum  : 0
    };

    loops.sort(ascendingByTopmostPoint);
    
    if (typeof _debug_ !== 'undefined') {
        for (let loop of loops) {
            _debug_.fs.nameObj(loop);
        }
    }

    //console.log(loops)
    for (let loop of loops) {
        // TODO - handle special case of 1 curve - maybe just delete lines below
        if (loop.curves.length <= 1) {
            continue;
        }

        if (loopsTaken.has(loop)) { continue; }
        loopsTaken.add(loop);

        let parent = getTightestContainingLoop(root, loop);

        completePath(
            intersections, loopsTaken, 
            parent,
            loop
        );
    }


    // Take the forest of trees, create a new root making it a tree and snip
    // branches such that each branch determines a new set of loops each 
    // representing an individual independent shape that possess its own Medial
    // Axis Transform (still to be determined).

    let loopTrees = splitLoopTrees(root);
    let iLoopSets = loopTrees.map(getLoopsFromTree);
    
    let loopss = iLoopSets.map(
        loopSet => loopSet.map(iLoop => Loop.fromCubicBeziers(iLoop.beziers))
    );

    let xMap: Map<number[][],{ ps: number[][] }> = new Map();

    for (let intersection of intersections) {
        for (let x of intersection[1]) {
            if (x.isDummy) { continue; }

            xMap.set(x.outPs, { ps: x.opposite.outPs })
        }
    }

    return { loopss, xMap };
}


function splitLoopTrees(root: ILoopTree) {

    let iLoopTrees: ILoopTree[] = [];
    let nodeStack: ILoopTree[] = [root];

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
function getLoopsFromTree(root: ILoopTree) {
    let loopTrees: ILoopTree[] = [];

    let stack = [root];
    while (stack.length) {
        let node = stack.pop();

        f(node);
    }
    return loopTrees;
    
    function f(parent: ILoopTree) {
        //console.log(parent.windingNum);
        if (Math.abs(parent.windingNum) <= 1) { 
            loopTrees.push(parent);
        }

        for (let child of parent.children) {
            stack.push(child);
        }
    }
}


/**
 * Returns < 0 if loopA's topmost point is higher (i.e. smaller) than that of
 * loopB. Using this function in a sort will sort from highest topmost point 
 * loops to lowest.
 * @param loopA 
 * @param loopB 
 * @hidden
 */
function ascendingByTopmostPoint(loopA: Loop, loopB: Loop) {
    let boundsA = getLoopBounds(loopA);
    let boundsB = getLoopBounds(loopB);

    let a = boundsA.minY.p[1];
    let b = boundsB.minY.p[1];

    return a-b;
}


export { simplifyPaths, ascendingByTopmostPoint }
