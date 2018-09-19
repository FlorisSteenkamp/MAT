"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vertex_1 = require("./vertex");
/**
 * Vertex creator.
 * @param circle
 * @param cpNodes An array of 'orphaned' (i.e. without belonging to a Vertex)
 * contact points. Note: Due to the mutual dependency between the vertex and
 * contactPoints fields, a normal constructor can not instantiate a Vertex
 * in one step - hence this creator.
 */
function create(circle, cpNodes) {
    let vertex = new vertex_1.Vertex(circle);
    for (let cpNode of cpNodes) {
        cpNode.cp.vertex = vertex;
    }
    return vertex;
}
exports.create = create;
