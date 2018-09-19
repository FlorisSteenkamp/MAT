"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contact_point_1 = require("../classes/contact-point");
const shape_1 = require("../classes/shape/shape");
const cp_hash_functions_1 = require("../functions/cp-hash-functions");
class Vertex {
    /**
     * Medial (or Scale) Axis Transform (MAT) maximal contact circle class,
     * i.e. a representative data point of the MAT.
     * @constructor
     * @param circle
     * @param cps - The contact points of this circle on the shape.
     */
    constructor(circle, cps) {
        this.circle = circle;
        this.cps = cps;
    }
    isHoleClosing() {
        let vertex = this;
        for (let cp of vertex.cps) {
            if (cp.isHoleClosing()) {
                return true;
            }
        }
        return false;
    }
    getEdges() {
        let fromVertex = this;
        let cps = fromVertex.cps;
        let edges = [];
        for (let i = 0; i < cps.length; i++) {
            let fromCp = cps[i];
            let toCp = fromCp.next;
            let toVertex = toCp.item.vertex;
            if (fromCp.isTerminating()) {
                continue;
            }
            edges.push({ fromCp, toCp, fromVertex, toVertex });
        }
        return edges;
    }
    /**
     * Returns a deep copy (clone) of the given Vertex. Since a Vertex
     * represents an entire MAT we have to clone an entire MAT.
     * @param vertex The Vertex to clone.
     */
    static clone(vertex) {
        return f(vertex);
        function f(vertex, priorNode, newPriorNode) {
            //let newEdges: Edge[] = [];
            let newVertex = new Vertex(vertex.circle, undefined /*,
            newEdges // TODO - maybe copy this?*/);
            newVertex.cps = vertex.cps.map(function (cp) {
                return cp;
                // TODO finish
            });
            let edges = vertex.getEdges();
            for (let edge of edges) {
                if (edge.toVertex === priorNode) {
                    // Don't go back in tracks.
                    continue;
                }
                f(edge.toVertex, vertex, newVertex);
            }
            return newVertex;
        }
    }
    static create2(circle, shape, poss, neighboringCps) {
        let vertex = new Vertex(circle, undefined);
        let newCps = poss.map((pos, i) => {
            let k = pos.bezierNode.loop.indx;
            let neighboringCp = neighboringCps
                ? neighboringCps[i]
                : shape_1.Shape.getNeighbouringPoints(shape, pos);
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
     * @param cps An array of 'orphaned' (i.e. without belonging to a Vertex)
     * contact points. Note: Due to the mutual dependency between the vertex and
     * contactPoints fields, a normal constructor can not instantiate a Vertex
     * in one step - hence this creator.
     */
    static create(circle, cps) {
        let vertex = new Vertex(circle, cps);
        for (let cp of cps) {
            cp.item.vertex = vertex;
        }
        return vertex;
    }
}
exports.Vertex = Vertex;
