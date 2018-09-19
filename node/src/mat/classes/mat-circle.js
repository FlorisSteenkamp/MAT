"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contact_point_1 = require("../classes/contact-point");
const shape_1 = require("../classes/shape");
const edge_1 = require("./edge");
const cp_hash_functions_1 = require("../functions/cp-hash-functions");
/**
 * Medial (or Scale) Axis Transform (MAT) maximal contact circle class,
 * i.e. a representative data point of the MAT.
 *
 * @constructor
 * @param circle
 * @param cps - The contact points of this circle on the shape.
 */
class Vertex {
    constructor(circle, cps, edges) {
        this.circle = circle;
        this.cps = cps;
        if (this.edges === undefined) {
            this.edges = [];
        }
    }
    /**
     * Returns a deep copy (clone) of the given Vertex. Since a Vertex
     * represents an entire MAT we have to clone an entire MAT.
     * @param vertex The Vertex to clone.
     */
    static clone(vertex) {
        return f(vertex);
        function f(vertex, priorNode, newPriorNode) {
            let newEdges = [];
            let newVertex = new Vertex(vertex.circle, undefined, newEdges // TODO - maybe copy this?
            );
            newVertex.cps = vertex.cps.map(function (cp) {
                return cp;
                // TODO finish
            });
            for (let edge of vertex.edges) {
                if (edge.toVertex === priorNode) {
                    // Don't go back in tracks.
                    let newEdge = new edge_1.Edge(edge.fromCp, edge.toCp);
                    newEdges.push(newEdge);
                    continue;
                }
                f(edge.toVertex, vertex, newVertex);
                let newEdge = new edge_1.Edge(edge.fromCp, edge.toCp);
                newEdges.push(newEdge);
            }
            return newVertex;
        }
    }
    static create2(circle, shape, poss, neighboringCps) {
        let vertex = new Vertex(circle, undefined);
        let newCps = poss.map((pos, i) => {
            let k = pos.bezierNode.loop.indx;
            // Sometimes prevCps are known when passed into this contructor
            // (such as when 3-prongs are found) and sometimes not such as
            // when 2-prongs are found. We take care of that here.
            let neighboringCp = neighboringCps
                ? neighboringCps[i]
                : shape_1.Shape.getNeighbouringPoints(shape, pos);
            /*
            let cmpBef = neighboringCp[0] === undefined ? undefined : PointOnShape.compare(neighboringCp[0].item.pointOnShape, pos);
            let cmpAft = neighboringCp[1] === undefined ? undefined : PointOnShape.compare(pos, neighboringCp[1].item.pointOnShape);
            if (cmpBef === 0 || cmpAft === 0) {
                console.log(`x-PRONG Orders is equal : i: ${i} - cmpBef: ${cmpBef}, cmpAft: ${cmpAft}`);
                //return;
            }
            //let len = _debug_.generated.threeProngs.length-1;
            if (cmpBef > 0) {
                console.log(`x-PRONG Order is wrong (bef) : i: ${i} - cmp: ${cmpBef}`);
                //console.log(threeProng);
            }
            if (cmpAft > 0) {
                console.log(`x-PRONG Order is wrong (aft) : i: ${i} - cmp: ${cmpAft}`);
                //console.log(threeProng);
            }
            */
            let newCp = shape.contactPointsPerLoop[k].insert(new contact_point_1.ContactPoint(pos, vertex), neighboringCp[0]);
            cp_hash_functions_1.addCpToHash(shape, newCp.item);
            return newCp;
        });
        let len = poss.length;
        for (let i = 0; i < len; i++) {
            let indxPrev = i === 0 ? len - 1 : i - 1;
            let indxNext = i === len - 1 ? 0 : i + 1;
            newCps[i].prevOnCircle = newCps[indxPrev];
            newCps[i].nextOnCircle = newCps[indxNext];
        }
        vertex.cps = newCps;
        return vertex;
    }
    /**
     * Vertex creator.
     * @param circle
     * @param cps An array of 'orphaned'
     *        (i.e. without belonging to a Vertex) contact points.
     * Notes: Due to the mutual dependency between the vertex and
     * contactPoints fields, a normal constructor can not instantiate a
     * Vertex in one step - hence this creator.
     */
    static create(circle, cps) {
        let vertex = new Vertex(circle, undefined);
        for (let i = 0; i < cps.length; i++) {
            cps[i].item.vertex = vertex;
        }
        vertex.cps = cps;
        return vertex;
    }
}
exports.Vertex = Vertex;
