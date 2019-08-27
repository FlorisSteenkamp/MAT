
declare var _debug_: MatDebug;

import { MatDebug } from '../../../debug/debug';

import { bezier3Intersection, getBoundingBox } from 'flo-bezier3';

import { Loop } from '../../../loop/loop';
import { Curve } from '../../../curve';

import { X } from '../../../x/x';
import { PointOnShape } from '../../../point-on-shape';
import { pairSet_add, pairSet_has } from './pair-set';
import { sweepLine } from '../../../sweep-line/sweep-line';
import { areBoxesIntersecting } from '../../../sweep-line/are-boxes-intersecting';

// TODO - DELTA is somewhat arbitrary
const DELTA = 1e-10;


interface IBoxInfo {
    box : number[][];
    loop : Loop;
    curve : Curve;
}


/**
 * Find and return all intersections on all given loops.
 * @param loops 
 */
function getIntersections(loops: Loop[]) {
    // intersection <=> X

    let { boxes, boxInfoMap } = getBoxInfos(loops);
    //let boxIntersections = findBbIntersections(boxes);
    let boxIntersections = sweepLine(
        boxes, 
        box => Math.min(box[0][0], box[1][0]),
        box => Math.max(box[0][0], box[1][0]),
        areBoxesIntersecting(true)
    );


    //console.log(boxIntersections);
    /*
    if (typeof _debug_ !== 'undefined') {
        let g = document.getElementsByTagName('g')[0];
        for (let boxIntersection of boxIntersections) {
            let [box1, box2] = boxIntersection;
            let box1_ = [[box1[0][0], box1[0][1]], [box1[1][0], box1[1][1]]];
            let box2_ = [[box2[0][0], box2[0][1]], [box2[1][0], box2[1][1]]];
            if (box1_[0][0] === box1_[1][0]) {
                box1_[1][0] += 1;
            }
            if (box1_[0][1] === box1_[1][1]) {
                box1_[1][1] += 1;
            }
            if (box2_[0][0] === box2_[1][0]) {
                box2_[1][0] += 1;
            }
            if (box2_[0][1] === box2_[1][1]) {
                box2_[1][1] += 1;
            }
            _debug_.fs.draw.rect(g, box1_, 'red thin10 nofill');
            _debug_.fs.draw.rect(g, box2_, 'green thin10 nofill');
        }
    }
    */

    // Check curve intersection amongst possibilities

    /** A map from each curve to its intersectings */
    let xMap: Map<Curve, X[]> = new Map();

    let checkedPairs = new Map<Curve,Set<Curve>>();

    for (let i=0; i<boxIntersections.length; i++) {
        let [box1, box2] = boxIntersections[i];

        let curves = [
            boxInfoMap.get(box1).curve, 
            boxInfoMap.get(box2).curve, 
        ];

        if (pairSet_has(checkedPairs, curves)) {
            continue;
        }

        pairSet_add(checkedPairs, curves);

        let pss = curves.map(curve => curve.ps);

        let tPairs = bezier3Intersection(pss[0], pss[1], 1e-12);
        if (!tPairs.length) { continue; }

        for (let tPair of tPairs) {
            let curves_ = confirmIntersection(checkedPairs, curves, tPair);

            if (curves_ === undefined) { continue; }

            let xs: X[] = [];

            for (let j of [0,1]) {
                let curve = curves_[j];

                let x = new X(
                    new PointOnShape(curve, tPair[j])
                );

                if (typeof _debug_ !== 'undefined') {
                    if (j === 0) {
                        _debug_.generated.elems.intersection.push(x);
                    }
                }

                // Get intersections stored at this curve
                let curveXs = xMap.get(curve) || [];
                if (!curveXs.length) { xMap.set(curve, curveXs); }

                // Add an intersection to this curve
                curveXs.push(x);

                xs.push(x);
            }

            xs[0].opposite = xs[1];
            xs[1].opposite = xs[0];
        }
    }

    //console.log(`X.lenth: ${_debug_.generated.elems.intersection.length}`);
    /*
    {
        let xs = _debug_.generated.elems.intersection;
        for (let x of xs) {
            console.log(x.pos.p);
        }
    }
    */

    return xMap;
}


/**
 * 
 */
function confirmIntersection(
        checkedPairs: Map<Curve, Set<Curve>>, 
        curves: Curve[], 
        tPair: number[]) {

    let curves_ = curves.slice();

    // TODO - the below check is temporary - there is a better way
    // TODO - eliminate the fact that intersections are found twice
    if (
        ((Math.abs(tPair[0]    ) < DELTA && Math.abs(tPair[1] - 1) < DELTA) ||
         (Math.abs(tPair[0] - 1) < DELTA && Math.abs(tPair[1]    ) < DELTA) ||
         (Math.abs(tPair[0]    ) < DELTA && Math.abs(tPair[1]    ) < DELTA) ||
         (Math.abs(tPair[0] - 1) < DELTA && Math.abs(tPair[1] - 1) < DELTA)) &&
         (curves_[0].next === curves_[1] || curves_[1].next === curves_[0])
        ) {
        
        return undefined;
    }

    if (Math.abs(tPair[0] - 1) < DELTA) {
        /*
        // If the intersection occurs at the end, move it to the start
        // so we don't have a very small bezier piece left.
        curves_[0] = curves_[0].next;
        tPair[0] = 0;

        // Recheck
        if (pairSet_has(checkedPairs, [curves_[0], curves_[1]])) {
            return undefined;
        }*/

        // Above seems wrong, there will already be an intersection at the
        // start so no need to move it.
        return undefined;
    }

    if (Math.abs(tPair[1] - 1) < DELTA) {
        // If the intersection occurs at the end, move it to the start
        // so we don't have a very small bezier piece left.
        /*
        curves_[1] = curves_[1].next;
        tPair[1] = 0;

        // Recheck
        if (pairSet_has(checkedPairs, [curves_[0], curves_[1]])) {
            return undefined;
        }
        */

        // Above seems wrong, there will already be an intersection at the
        // start so no need to move it.
        return undefined;
    }

    return curves_;
}


/**
 * Returns an array of lines of the bounding hulls of the Loop beziers' control
 * points including a map that maps each line to its hull, path and curve.
 * @param loops An array of Loops
 */
function getBoxInfos(loops: Loop[]) {
    /** Map that maps a line segment to some info. */
    let boxInfoMap: Map<number[][], IBoxInfo> = new Map();
    let boxes: number[][][] = [];

    // Get lines making up the hulls of the paths
    for (let loop of loops) {
        loop.curves.forEach(function(curve) {
            let box = getBoundingBox(curve.ps);         

            boxes.push(box);
            boxInfoMap.set(box, { box, loop, curve });
        });
    }

    return { boxes, boxInfoMap }
}


export { getIntersections }
