
declare var _debug_: MatDebug; 

import { MatDebug } from '../../../debug/debug';

import { Loop } from '../../../loop';

import { getLoopBounds } from '../get-loop-bounds';

import { ILoopTree } from './i-loop-tree';

import { getIntersections } from './get-intersections';
import { completePath     } from './complete-path';
import { getTightestContainingLoop } from './get-tightest-containing-loop';
import { beziersToSvgPathStr } from '../beziers-to-svg-path-str';


/**
 * Uses the algorithm of Lavanya Subramaniam (PARTITION OF A NON-SIMPLE POLYGON 
 * INTO SIMPLE POLYGONS) but modified to use cubic bezier curves (as opposed to
 * polygons) and to additionally take care of paths with multiple subpaths, i.e.
 * such as disjoint nested paths.
 * @param loops An array of possibly intersecting paths
 */
function simplifyPaths(loops: Loop[]) {
    let s = '';
    for (let loop of loops) {
        s = s + '\n\n' + beziersToSvgPathStr(loop.curves.map(c => c.ps), 5)
    }
    //console.log(s)

    //---------- TEMP FOR TESTING --------------//
    //return [orient(paths)];
    //---------- TEMP FOR TESTING --------------//
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

    for (let loop of loops) {
        // TODO - handle special case of 1 curve
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
    //console.log(loopTrees);
    let iLoopSets = loopTrees.map(getLoopsFromTree);
    //console.log(iLoopSets);
    
    let simplePathss = iLoopSets.map(
        loopSet => loopSet.map(ILoopToLoop)
    );

    //console.log(simplePathss)

    let str = '';
    for (let simplePaths of simplePathss) {
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
    //console.log(str)

    return simplePathss;
}


/**
 * 
 * @param iLoop 
 */
function ILoopToLoop(iLoop: ILoopTree) {
    return new Loop(iLoop.beziers);
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
function ascendingByTopmostPoint(loopA: Loop, loopB: Loop) {
    let boundsA = getLoopBounds(loopA);
    let boundsB = getLoopBounds(loopB);

    let a = boundsA.minY.p[1];
    let b = boundsB.minY.p[1];

    return a-b;
}


export { simplifyPaths }
