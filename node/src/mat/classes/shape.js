"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mat_constants_1 = require("../../mat-constants");
const Vector = require("flo-vector2d");
const Bezier3 = require("flo-bezier3");
const Svg = require("../../svg/svg");
const linked_loop_1 = require("../../linked-list/linked-loop");
const loop_1 = require("../../linked-list/loop");
const list_node_1 = require("../../linked-list/list-node");
const bezier_piece_1 = require("../classes/bezier-piece");
const contact_point_1 = require("../classes/contact-point");
const point_on_shape_1 = require("../classes/point-on-shape");
const vertex_1 = require("../classes/vertex");
const get_contact_circles_at_bezier_bezier_interface_1 = require("../functions/get-contact-circles-at-bezier-bezier-interface");
const get_bezier_osculating_circles_1 = require("../functions/get-bezier-osculating-circles");
const find_mat_1 = require("../functions/find-mat");
class Shape {
    /**
     * A Shape represents the loop of individual cubic bezier curves composing
     * an SVG element. When constructed, some initial analysis is done.
     * @param bezierArrays - An array (loop) of cubic bezier arrays. Each loop
     * represents a closed path of the shape.
     */
    constructor(bezierLoops) {
        /** A map (per loop) mapping bezier indexes to the set of contact points
         * attached to that bezier */
        this.bezierCpSetPerLoop = [];
        /** Hash of 2-prongs that need to be skipped in 2-prong procedure
        since we already have a hole-closing 2-prong there. */
        this.skip2ProngHash = {};
        /** Hash of PointOnShapes that has a normal pointing straight up. */
        this.straightUpHash = {};
        /** A hash of all the dull corners (i.e. those with angle > 180 deg) */
        this.dullCornerHash = {};
        // TODO - check if this will run in node (due to window object)
        if (typeof _debug_ !== 'undefined') {
            _debug_.generated.timing.start = performance.now();
        }
        this.bezierLoops = orient(bezierLoops);
        if (typeof _debug_ !== 'undefined') {
            this.addDebugInfo();
        }
        this.extremes = this.bezierLoops.map(Svg.getTopMost);
        // This is to find the topmost points on each loop.
        this.extremes.sort(function (a, b) { return a.p[1] - b.p[1]; });
        this.bezierLoops.sort(function (a_, b_) {
            let a = Svg.getTopMost(a_);
            let b = Svg.getTopMost(b_);
            return a.p[1] - b.p[1];
        });
        // Re-index after ordering.
        for (let i = 0; i < this.bezierLoops.length; i++) {
            this.bezierLoops[i].indx = i;
        }
        // Initialize cp cache
        for (let i = 0; i < this.bezierLoops.length; i++) {
            let loop = this.bezierLoops[i];
            let cpSetMap = new Map();
            loop.forEach(function (curveNode) {
                let cpSet = new Set();
                cpSetMap.set(curveNode.item, cpSet);
            });
            this.bezierCpSetPerLoop.push(cpSetMap);
        }
        // Get metrics of the outer loop. ??
        this.shapeBounds = Svg.getLoopBounds(bezierLoops[0]);
        // Gets interesting points on the shape, i.e. those that makes 
        // sense to use for the 2-prong procedure.
        let pointOnShapeArrPerLoop = Shape.getInterestingPointsOnShape(this);
        this.pointsOnShapePerLoop = pointOnShapeArrPerLoop.map((array, i) => createCoupledLoops(array, i));
        // TODO Finish implementation. This is to space the points more
        // evenly. 
        //respacePoints(this.contactPointsPerLoop, 30);
        let { sharpCornersArray, for2ProngsArray } = Shape.getPotential2Prongs(this);
        this.for2ProngsArray = for2ProngsArray;
        // Take account of sharp and dull corners for debugging and update 
        // straightUpHash.
        Shape.forEachPointOnShape(this, pos => {
            if (pos.type === mat_constants_1.MAT_CONSTANTS.pointType.sharp) {
                if (typeof _debug_ !== 'undefined') {
                    _debug_.generated.elems.sharpCorners.push({
                        data: { pos },
                        $svg: _debug_.fs.drawElem.drawSharpCorner(pos, _debug_.config.toDraw.sharpCorners &&
                            _debug_.config.toDraw.sharpCorners[_debug_.fs.elemType.sharpCorners({ pos })])
                    });
                    //console.log(pos)
                }
            }
            else {
                if (point_on_shape_1.PointOnShape.isPointingStraightUp(pos)) {
                    let key = point_on_shape_1.PointOnShape.makeSimpleKey(pos.p);
                    this.straightUpHash[key] = pos;
                }
                if (typeof _debug_ !== 'undefined') {
                    if (pos.type === mat_constants_1.MAT_CONSTANTS.pointType.dull) {
                        _debug_.generated.elems.dullCorners.push({
                            data: { pos },
                            $svg: _debug_.fs.drawElem.drawDullCorner(pos, _debug_.config.toDraw.dullCorners &&
                                _debug_.config.toDraw.dullCorners[_debug_.fs.elemType.dullCorners({ pos })])
                        });
                    }
                }
            }
        });
        this.contactPointsPerLoop =
            createSharpCornerCpLoops(this, sharpCornersArray);
        if (typeof _debug_ !== 'undefined') {
            _debug_.generated.timing.after1Prongs = performance.now();
        }
    }
    get mat() {
        return find_mat_1.findMat(this);
    }
    addDebugInfo() {
        for (let loop of this.bezierLoops) {
            let i = 0;
            loop.forEach(function (path) {
                let drawElem = _debug_.fs.drawElem;
                let ps = path.item;
                let hull = Bezier3.getBoundingHull(ps);
                let generated = _debug_.generated;
                generated.elems.boundingHulls.push({
                    data: hull,
                    $svg: drawElem.drawBoundingHull(hull, _debug_.config.toDraw.boundingHulls &&
                        _debug_.config.toDraw.boundingHulls[_debug_.fs.elemType.boundingHulls(hull)], i % 2 === 0 ? 'thin5 black nofill' : 'thin10 black nofill')
                });
                let looseBoundingBox = Bezier3.getBoundingBox(ps);
                generated.elems.looseBoundingBoxes.push({
                    data: looseBoundingBox,
                    $svg: drawElem.drawLooseBoundingBox(looseBoundingBox, _debug_.config.toDraw.looseBoundingBoxes &&
                        _debug_.config.toDraw.looseBoundingBoxes[_debug_.fs.elemType.looseBoundingBoxes(looseBoundingBox)])
                });
                let tightBoundingBox = Bezier3.getBoundingBoxTight(ps);
                generated.elems.tightBoundingBoxes.push({
                    data: tightBoundingBox,
                    $svg: drawElem.drawTightBoundingBox(tightBoundingBox, _debug_.config.toDraw.tightBoundingBoxes &&
                        _debug_.config.toDraw.tightBoundingBoxes[_debug_.fs.elemType.tightBoundingBoxes(looseBoundingBox)])
                });
                i++;
            });
        }
    }
    /**
     * Applies f to each PointOnShape within the shape
     * @param shape - The shape
     * @param f - The function to call.
     */
    static forEachPointOnShape(shape, f) {
        let pointsOnShapePerLoop = shape.pointsOnShapePerLoop;
        for (let k = 0; k < pointsOnShapePerLoop.length; k++) {
            let pointsOnShape = pointsOnShapePerLoop[k];
            let posNode = pointsOnShape.head;
            do {
                let pos = posNode.item;
                f(pos);
                posNode = posNode.next;
            } while (posNode !== pointsOnShape.head);
        }
    }
    /**
     * Get potential 2-prong points on shape.
     * @param shape
     */
    static getPotential2Prongs(shape) {
        let pointsOnShapePerLoop = shape.pointsOnShapePerLoop;
        let sharpCornersArray = [];
        let for2ProngsArray = [];
        for (let k = 0; k < pointsOnShapePerLoop.length; k++) {
            let pointsOnShape = pointsOnShapePerLoop[k];
            let sharpCorners = [];
            let for2Prongs = [];
            let posNode = pointsOnShape.head;
            do {
                let pos = posNode.item;
                if (pos.type === mat_constants_1.MAT_CONSTANTS.pointType.sharp) {
                    sharpCorners.push(pos);
                }
                else {
                    for2Prongs.push(posNode);
                }
                posNode = posNode.next;
            } while (posNode !== pointsOnShape.head);
            sharpCornersArray.push(sharpCorners);
            for2ProngsArray.push(for2Prongs);
        }
        return { sharpCornersArray, for2ProngsArray };
    }
    /**
     * Get useful points on the shape - these incude osculating points and points at
     * the bezier-bezier interfaces.
     * @param shape
     */
    static getInterestingPointsOnShape(shape) {
        let bezierLoops = shape.bezierLoops;
        let allPointsArray = [];
        for (let k = 0; k < bezierLoops.length; k++) {
            let bezierLoop = bezierLoops[k];
            allPointsArray.push(Shape.getInterestingPointsOnLoop(shape, bezierLoop));
        }
        return allPointsArray;
    }
    /**
     * TODO - uncomment and finish
     * Get all points where shape intersect itself.
     */
    /*
    function getSelfIntersections(shape: Shape) {
        //aaa
    }
    */
    /**
     * @param shape
     * @param bezierLoop
     */
    static getInterestingPointsOnLoop(shape, bezierLoop) {
        let dullCornerHash = shape.dullCornerHash;
        let points = [];
        let allPoints = [];
        let node = bezierLoop.head;
        do {
            let pointsOnShape1 = get_contact_circles_at_bezier_bezier_interface_1.getContactCirclesAtBezierBezierInterface([node.prev, node], dullCornerHash);
            allPoints.push(...pointsOnShape1);
            let pointsOnShape2 = get_bezier_osculating_circles_1.getBezierOsculatingCircles(node);
            allPoints.push(...pointsOnShape2);
            // TODO - maybe remove; experimenting
            for (let i = 1; i < 2; i++) {
                let pos = new point_on_shape_1.PointOnShape(node, i / 2, mat_constants_1.MAT_CONSTANTS.pointType.standard, 0);
                allPoints.push(pos);
            }
            node = node.next;
        } while (node !== bezierLoop.head);
        // Ensure order - first point may be ordered last at this stage
        // (due to bezier-bezier interface checking)
        let firstPoint = allPoints[0];
        let lastPoint = allPoints[allPoints.length - 1];
        if (point_on_shape_1.PointOnShape.compare(firstPoint, lastPoint) > 0) {
            allPoints.push(firstPoint); // Add the first point to the end
            allPoints.splice(0, 1); // ... and remove the front point.
        }
        allPoints.sort(point_on_shape_1.PointOnShape.compare);
        // Check if at least one 2-prong has been added. If not, add one.
        let atLeast1 = false;
        for (let i = 0; i < allPoints.length; i++) {
            if (allPoints[i].type !== mat_constants_1.MAT_CONSTANTS.pointType.sharp) {
                atLeast1 = true;
                break;
            }
        }
        //if (bezierLoop.indx === 0 && !atLeast1) {
        if (!atLeast1) {
            // Not a single potential 2-prong found on envelope. Add one 
            // to make the algorithm simpler from here on.
            let node = bezierLoop.head;
            let pos = new point_on_shape_1.PointOnShape(node, 0.4999995, // Can really be anything in the range (0,1)
            mat_constants_1.MAT_CONSTANTS.pointType.standard, 0);
            allPoints.push(pos);
        }
        return allPoints;
    }
    /**
     * Returns the boundary piece that starts at the immediate previous point on
     * the shape and ends at the immediate next point.
     */
    static getNeighbouringPoints(shape, pos) {
        let k = pos.bezierNode.loop.indx;
        let cptree = shape.contactPointsPerLoop[k].cptree;
        // TODO - ugly - improve code
        let cps = cptree.findBounds(new list_node_1.ListNode(undefined, new contact_point_1.ContactPoint(pos, undefined), undefined, undefined, undefined));
        if (!cps[0] && !cps[1]) {
            // The tree is still empty
            return [undefined, undefined];
            //return undefined;
        }
        if (!cps[0] || !cps[1]) {
            // Smaller than all -> cptree.min() === cps[1].data OR
            // Larger than all -> cptree.max() === cps[0].data
            return [
                //LlRbTree.max(cptree.root), 
                //LlRbTree.min(cptree.root)
                cptree.max(cptree.root),
                cptree.min(cptree.root)
            ];
        }
        return [
            cps[0].data,
            cps[1].data
        ];
    }
    /**
     *
     * @param k Loop indx
     * @param cp
     */
    addCpToBezierCpSet(k, cp) {
        let shape = this;
        let curve = cp.pointOnShape.bezierNode.item;
        let bezierCpSetMap = shape.bezierCpSetPerLoop[k];
        let cpSet = bezierCpSetMap.get(curve);
        cpSet.add(cp);
    }
    /**
     *
     * @param k Loop indx
     * @param cp
     */
    removeCpFromBezierCpSet(k, cp) {
        let shape = this;
        let curve = cp.pointOnShape.bezierNode.item;
        let bezierCpSetMap = shape.bezierCpSetPerLoop[k];
        let cpSet = bezierCpSetMap.get(curve);
        cpSet.delete(cp);
    }
}
/**
 *
 */
Shape.getTotalCurvature = getTotalBy(function (bezierNode) {
    let bezierCurvature = Bezier3.totalCurvature(bezierNode.item, [0, 1]);
    let interfaceCurvature = Svg.getCurvatureAtInterface(bezierNode);
    return bezierCurvature + interfaceCurvature;
});
/**
 *
 */
Shape.getTotalAbsoluteCurvature = getTotalBy(function (bezierNode) {
    return Bezier3.totalAbsoluteCurvature(bezierNode.item, [0, 1]) +
        Math.abs(Svg.getCurvatureAtInterface(bezierNode));
});
/**
 *
 */
Shape.forAllBeziers = function (f, shape) {
    let bezierLoops = shape.bezierLoops;
    for (let i = 0; i < bezierLoops.length; i++) {
        let bezierLoop = bezierLoops[i];
        let node = bezierLoop.head;
        do {
            //let ps = node.item.bezier3;
            let ps = node.item;
            f(ps);
            node = node.next;
        } while (node !== bezierLoop.head);
    }
};
/**
 * asas
 */
Shape.getBoundaryBeziers = function (shape, k) {
    let bezierLoop = shape.bezierLoops[k];
    let bezierPieces = [];
    bezierLoop.forEach(function (bezierNode) {
        let bezierPiece = new bezier_piece_1.BezierPiece(bezierNode, [0, 1]);
        bezierPieces.push(bezierPiece);
    });
    return bezierPieces;
};
/**
* Returns the ordered cubic bezier pieces (i.e a bezier with a t range)
* from the given boundary piece.
* @param δ - An ordered pair that represents the start and ending points of
* the boundary piece
* @param keepStraight - If true then don't go around any mat circles
* @param ifSamePointReturnEmpty = If the two δ points representing a
* boundary piece compare as equal, then if this parameter is set to true
* a single point will be returned else the entire boundary will be
* returned.
*/
Shape.getBoundaryPieceBeziers = function (δ, keepStraight = false, ifSamePointReturnPointOnly = false) {
    let cp0 = δ[0];
    let cp1 = δ[1];
    let bezierPieces = [];
    if (ifSamePointReturnPointOnly) {
        let posThis = cp0.item.pointOnShape;
        let posNext = cp0.next.item.pointOnShape;
        if (posNext.bezierNode === posThis.bezierNode &&
            posNext.t === posThis.t &&
            posNext.order === posThis.order) {
            let pos = cp0.item.pointOnShape;
            let bezierPiece = new bezier_piece_1.BezierPiece(pos.bezierNode, [pos.t, pos.t]);
            return [bezierPiece];
        }
    }
    // As opposed to going around the circle and taking the last exit
    let goStraight = true;
    do {
        if (!goStraight && !keepStraight) {
            goStraight = true;
            // Actually, next, next, ..., i.e. take last exit
            cp0 = cp0.prevOnCircle;
            continue;
        }
        goStraight = false;
        let posThis = cp0.item.pointOnShape;
        let posNext = cp0.next.item.pointOnShape;
        if (posNext.bezierNode === posThis.bezierNode &&
            (posNext.t > posThis.t || (posNext.t === posThis.t && posNext.order > posThis.order))) {
            let pos = cp0.item.pointOnShape;
            let bezierPiece = new bezier_piece_1.BezierPiece(pos.bezierNode, [pos.t, posNext.t]);
            bezierPieces.push(bezierPiece);
        }
        else {
            let pos = cp0.item.pointOnShape;
            let bezierPiece = new bezier_piece_1.BezierPiece(pos.bezierNode, [pos.t, 1]);
            bezierPieces.push(bezierPiece);
            addSkippedBeziers(bezierPieces, posThis.bezierNode, posNext.bezierNode, posNext.t);
        }
        cp0 = cp0.next;
    } while (cp0 !== cp1);
    return bezierPieces;
    /**
     * Adds pieces of skipped beziers
     */
    function addSkippedBeziers(bezierPieces, bezierNode0, bezierNode1, t1) {
        //let ii = 0;
        let bNode = bezierNode0;
        do {
            //ii++;
            bNode = bNode.next;
            if (bNode === bezierNode1) {
                let bezierPiece = new bezier_piece_1.BezierPiece(bNode, [0, t1]);
                bezierPieces.push(bezierPiece);
            }
            else {
                let bezierPiece = new bezier_piece_1.BezierPiece(bNode, [0, 1]);
                bezierPieces.push(bezierPiece);
            }
        } while (bNode !== bezierNode1 /* && ii < 100*/);
        /*
        if (ii === 100) {
            console.log('maxed')
        }
        */
    }
};
exports.Shape = Shape;
/**
 * Creates the initial ContactPoint loops from the given sharp corners.
 * @param shape
 * @param sharpCornersArray
 */
function createSharpCornerCpLoops(shape, sharpCornersArray) {
    let contactPointsPerLoop = [];
    let comparator = (a, b) => contact_point_1.ContactPoint.compare(a.item, b.item);
    for (let k = 0; k < sharpCornersArray.length; k++) {
        let sharpCorners = sharpCornersArray[k];
        let cpLoop = new linked_loop_1.LinkedLoop([], comparator, k);
        //let prevCps: ListNode<ContactPoint>[] = undefined;
        let prevCp = undefined;
        for (let i = 0; i < sharpCorners.length; i++) {
            let pos = sharpCorners[i];
            let cp = new contact_point_1.ContactPoint(pos, undefined);
            shape.addCpToBezierCpSet(k, cp);
            prevCp = cpLoop.insert(cp, prevCp, undefined);
            let mCircle = vertex_1.Vertex.create(point_on_shape_1.PointOnShape.getOsculatingCircle(pos), [prevCp]);
            prevCp.prevOnCircle = prevCp; // Trivial loop
            prevCp.nextOnCircle = prevCp; // ...
        }
        contactPointsPerLoop.push(cpLoop);
    }
    return contactPointsPerLoop;
}
/**
 * Destructively orient the bezier loops so that the outermost loop is
 * positively oriented (i.e. counter-clockwise) and the rest negatively
 * oriented.
 */
function orient(bezierLoops) {
    let orientations = bezierLoops.map(Svg.isPathPositivelyOrientated);
    //console.log(orientations);
    //return bezierLoops;		
    if (!orientations[0]) {
        return bezierLoops;
    }
    else {
        let loops = bezierLoops.map(function (loop, k) {
            return reverseBeziersOrientation(loop, k);
        });
        return loops;
    }
}
/**
 * Completely reverse the loop direction of the given bezier loop. Returns the
 * reversed loop.
 * @param bezierLoop
 * @param k
 */
function reverseBeziersOrientation(bezierLoop, k) {
    let beziers = [];
    let bezierArray = bezierLoop.items; //getAsArray();
    let idx = 0;
    for (let i = bezierArray.length - 1; i >= 0; i--) {
        let curve = Bezier3.reverse(bezierArray[i]);
        idx++;
        beziers.push(curve);
    }
    return new loop_1.Loop(beziers, k);
}
/**
 * Returns true if bezier box is entirely outside circle box, false otherwise.
 *
 * Given a circle, bound it tightly by an axes-aligned box (i.e. circle
 * box). And given a bezier, bound tightly by a rectangle (not
 * necessarily axes aligned) (i.e. bezier box).
 */
function isBezierBoxWhollyOutsideCircleBox(ps, circle) {
    //---- Cache
    let r = circle.radius;
    let ox = circle.center[0];
    let oy = circle.center[1];
    let radius_2 = r * r;
    //---- Translate bezier tight bounding box (4 point rectangle) so that circle center is at origin. 
    let boxTight = Vector.translatePs([-ox, -oy], Bezier3.getBoundingBoxTight(ps));
    //---- Rotate circle and rectangle together so that box rectangle is aligned with axes.
    let boxDiagonal = Vector.fromTo(boxTight[0], boxTight[1]);
    let l = Vector.len(boxDiagonal);
    let sinθ = boxDiagonal[1] / l;
    let cosθ = boxDiagonal[0] / l;
    const rotateByθ = Vector.rotate(sinθ, -cosθ);
    let b0 = rotateByθ(boxTight[0]);
    let b1 = rotateByθ(boxTight[2]);
    let anyBoxVerticalInside = (b0[0] > -r && b0[0] < r) ||
        (b1[0] > -r && b1[0] < r);
    let boxVerticalsCapture = (b0[0] < -r && b1[0] > r) ||
        (b1[0] < -r && b0[0] > r);
    let anyBoxHorizontalInside = (b0[1] > -r && b0[1] < r) ||
        (b1[1] > -r && b1[1] < r);
    let boxHorizontalsCapture = (b0[1] < -r && b1[1] > r) ||
        (b1[1] < -r && b0[1] > r);
    if ((anyBoxVerticalInside && (anyBoxHorizontalInside || boxHorizontalsCapture)) ||
        (anyBoxHorizontalInside && (anyBoxVerticalInside || boxVerticalsCapture)) ||
        (boxVerticalsCapture && boxHorizontalsCapture)) {
        return false;
    }
    return true;
}
/**
 * TODO - finish implementation - the function below with the same name
 * is temporary.
 * @param contactPointArr
 */ /*
function createCoupledLoops(contactPointArr, k) {

   let comparator = (a,b) => ContactPoint.compare(a.item, b.item);
   let cpLoop = new LinkedLoop([], comparator, k);
   
   let denseContactPoints = new LinkedLoop([], undefined, k);
   
   let prevCpNode = undefined;
   let prevCoupledCpNode = undefined;
   for (let i=0; i<contactPointArr.length; i++) {
       let cp = contactPointArr[i];
       let pos = cp.pointOnShape;
       
       prevCoupledCpNode = LinkedLoop.insert(
               denseContactPoints, cp, prevCoupledCpNode
       );
       // TODO !!!!
       /*
       if (pos.type === MAT_CONSTANTS.pointType.dull) {
           if (acos(1-pos.sharpness) * 180 / Math.PI > 16) {
               prevCpNode = LinkedLoop.insert(cpLoop, cp, prevCpNode, prevCoupledCpNode);
           }
       } else if (pos.type === MAT_CONSTANTS.pointType.sharp) {
           if (acos(1-pos.sharpness) * 180 / Math.PI > 16) {
               prevCpNode = LinkedLoop.insert(cpLoop, cp, prevCpNode, prevCoupledCpNode);
           }
       } else {*/ /*
    prevCpNode = LinkedLoop.insert(cpLoop, cp, prevCpNode, prevCoupledCpNode);
//}

prevCoupledCpNode.coupledNode = prevCpNode;
}

return cpLoop;
}*/
function createCoupledLoops(pointOnShapeArr, k) {
    let posLoop = new linked_loop_1.LinkedLoop([], undefined, k);
    let prevNode = undefined;
    for (let i = 0; i < pointOnShapeArr.length; i++) {
        let pos = pointOnShapeArr[i];
        prevNode = posLoop.insert(pos, prevNode, undefined);
    }
    return posLoop;
}
/**
 * Helper function.
 * @private
 * @param f
 */
function getTotalBy(f) {
    return function (bezierLoop) {
        let node = bezierLoop.head;
        let total = 0;
        do {
            total += f(node);
            node = node.next;
        } while (node !== bezierLoop.head);
        return total;
    };
}
