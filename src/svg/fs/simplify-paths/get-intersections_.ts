
declare var _debug_: MatDebug;

import { MatDebug } from '../../../debug/debug';

import { bezier3Intersection, evaluate, getBoundingHull } from 'flo-bezier3';
import linesIntersections from 'flo-lines-intersections';

import { Loop } from '../../../loop';
import { Curve } from '../../../curve';

import { IXInfo } from './i-x-info';
import { PointOnShape } from '../../../point-on-shape';
import { pairSet_add, pairSet_has } from './pair-set';

// TODO - DELTA is arbitrary
const DELTA = 1e-6;


interface ILineInfo {
    hull : number[][];
    loop : Loop;
    curve : Curve;
}


/**
 * Find and return all intersections on all given loops.
 * @param loops 
 */
function getIntersections(loops: Loop[]) {

    let { ls, lineInfoMap } = getLineInfos(loops);
    let lineIntersections = getLineIntersections(ls, lineInfoMap);

    // Check curve intersection amongst possibilities

    /** A map from bezier nodes to all its intersecting beziers */
    let intersections: Map<Curve, IXInfo[]> = new Map();

    let checkedPairs = new Map<Curve,Set<Curve>>();

    for (let i=0; i<lineIntersections.length; i++) {
        let lineIntersection = lineIntersections[i];

        //_debug_.fs.draw.crossHair(lineIntersection.p, 'nofill thin1 blue', 1);	
        //console.log(lineIntersection.p)
        
        let curves = [
            lineInfoMap.get(lineIntersection.l1).curve, 
            lineInfoMap.get(lineIntersection.l2).curve, 
        ];

        if (pairSet_has(checkedPairs, curves)) {
            continue;
        }

        pairSet_add(checkedPairs, curves);

        let pss = curves.map(curve => curve.ps);

        let tPairs = bezier3Intersection(pss[0], pss[1]);
        /*
        console.log('-------');
        console.log(tPairs.toString());
        console.log(pss[0].toString());
        console.log(pss[1].toString());
        console.log('-------');
        */

        for (let tPair of tPairs) {
            // TODO - the below check is temporary - there is a better way
            // TODO - eliminate the fact that intersections are found twice
            if (
                (Math.abs(tPair[0]) < DELTA && Math.abs(tPair[1] - 1) < DELTA) ||
                (Math.abs(tPair[1]) < DELTA && Math.abs(tPair[0] - 1) < DELTA)) {

                continue;
            }

            /*
            if (_debug_ !== undefined) {
                let p = evaluate(pss[0], tPair[0]);
                _debug_.fs.draw.crossHair(p, 'nofill thin1 red', 2);	
            }
            */

            let xInfos: IXInfo[] = [];
            xInfos.push({
                loop: curves[0].loop,
                pos: new PointOnShape(curves[0], tPair[0]),
                opposite: undefined,
                loopTree: undefined,
            });
            xInfos.push({
                loop: curves[1].loop,
                pos: new PointOnShape(curves[1], tPair[1]),
                opposite: xInfos[0],
                loopTree: undefined,
            });
            xInfos[0].opposite = xInfos[1];


            for (let j=0; j<2; j++) {
                let intersectingCurves = intersections.get(curves[j]);
                if (!intersectingCurves) { 
                    intersectingCurves = [];
                    intersections.set(curves[j], intersectingCurves);
                }
    
                intersectingCurves.push(xInfos[j]);
            }
        }
    }

    return intersections;
}


/**
 * Returns an array of lines of the bounding hulls of the Loop beziers' control
 * points including a map that maps each line to its hull, path and curve.
 * @param loops An array of Loops
 */
function getLineInfos(loops: Loop[]) {
    /** Map that maps a line segment to some info. */
    let lineInfoMap: Map<number[][], ILineInfo> = new Map();
    let ls: number[][][] = [];

    // Get lines making up the hulls of the paths
    for (let loop of loops) {
        loop.curves.forEach(function(curve) {
            let hull = getBoundingHull(curve.ps);         

            // Map each line in the hull to the hull and add the line to an 
            // array.
            for (let i=0; i<hull.length; i++) {
                let l;
                if (i === hull.length-1) {
                    l = [hull[hull.length-1], hull[0]];
                } else {
                    l = [hull[i], hull[i+1]];
                }
                
                ls.push(l);
                lineInfoMap.set(l, { hull, loop, curve });
            }
        });
    }

    return { ls, lineInfoMap }
}


function getLineIntersections(
            ls: number[][][], 
            lineInfoMap: Map<number[][], ILineInfo>) {

    // Get possible intersections between curves
    let lineIntersections: {
        p: number[];
        l1: number[][];
        l2: number[][];
    }[] = linesIntersections(ls, function(l1,l2) {
        // Same hull? Then don't check for intersection.
        let sameHull = lineInfoMap.get(l1).hull === lineInfoMap.get(l2).hull;
        if (sameHull) { 
            return true; 
        }

        // Endpoints coincide? Then don't check for intersection
        let [p1,p2] = l1;
        let [p3,p4] = l2;
        if ((p1[0] === p3[0] && p1[1] === p3[1]) || (p2[0] === p3[0] && p2[1] === p3[1]) ||
            (p1[0] === p4[0] && p1[1] === p4[1]) || (p2[0] === p4[0] && p2[1] === p4[1])) {
            return true;
        }

        return false;
    });

    return lineIntersections;
}


export { getIntersections }
