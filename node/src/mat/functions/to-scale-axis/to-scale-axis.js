"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_vertices_as_array_1 = require("../get-vertices-as-array");
const get_largest_vertex_1 = require("./get-largest-vertex");
const create_spacial_tree_1 = require("./create-spacial-tree");
const traverse_spacial_tree_1 = require("./traverse-spacial-tree");
const cull_1 = require("./cull");
const get_engulfed_vertices_1 = require("./get-engulfed-vertices");
function toAmScaleAxis(mat_, s) {
    /*
    let mat = Vertex.clone(mat_);

    let vertices = getVerticesAsArray(mat);

    // Get Vertices as an array sorted by scaled engulfing radius.
    let vertexInfos = vertices
    .map(function(vertex) {
        return { node: vertex, r: s * vertex.circle.radius };
    })
    .sort(function(a, b) {
        return a.r - b.r;
    });


    // Also create a map that maps each Vertex to a corresonding VertexInfo.
    let vertexInfoMap: Map<Vertex, { node: Vertex, r: number}> = new Map();
    vertexInfos.forEach(function(vertexInfo) {
        vertexInfoMap.set(vertexInfo.node, vertexInfo);
    });


    // In descending engulfing radius check each node if it engulfs its
    // neighbors and mark it as such, also possibly updating the neighbors'
    // engulfing radius.
    for (let i=0; i<vertexInfos.length; i++) {
        let vertexInfo = vertexInfos[i];

        let vertex = vertexInfo.node;
        
        let edges = vertex.getEdges();
        for (let edge of edges) {
            let edgeInfo = vertexInfoMap.get(edge.toVertex);
            let edgeVertex = edgeInfo.node;
            let edgeR = edgeInfo.r;

            let r = s*vertex.circle.radius;

            // TODO - l must be the bezier length connecting the mat circle
            // centers and not the straight line length.
            let branchCC = edge.toVertex.circle.center;
            let cc = vertex.circle.center;
            let l = distanceBetween(branchCC, cc);

            if (r > l + edgeR) {
                edgeInfo.r = r - l;
                //markAsCull(branchVertex);
            }
        }
    }


    let cullHash = {};

    let cullNodes: TVertexInclPrior[] = [];
    cullIt(cullHash, cullNodes, sat.startNode);
     
    cullTheNodes(cullNodes);
    
    if (typeof _debug_ !== 'undefined') {
        _debug_.generated.timing.afterSat = performance.now();
        _debug_.sats.push(sat);
    }
    
    return sat;


    return undefined;
    */
}
/**
 * Apply the Scale Axis Transform (SAT) to the MAT.
 * @param cpNode - The Medial Axis Transform (MAT) on which to apply the SAT.
 * @param s - The scale factor >= 1 (e.g. 1.3)
 */
function toScaleAxis(cpNode, s) {
    //--------------------------------------------------------------------------
    // Start with the biggest circle (since it is the most likely to eclipse 
    // other circles), multiply its radius by s and see which circles are fully 
    // contained in it and trim it away in the MAT tree.
    //--------------------------------------------------------------------------
    // Make a copy of the MAT tree - we're not going to modify the original.
    //let cpNode = clone(cpNode);
    //return vertex;
    //let vertices =  vertex.asArray();
    let Circles = get_vertices_as_array_1.getVerticesAsArray(cpNode);
    // Grab the MAT tree at its biggest node.
    let circle = get_largest_vertex_1.getLargestVertex(Circles);
    let tree = create_spacial_tree_1.createSpacialTree(s, Circles);
    let culls = new Set();
    traverse_spacial_tree_1.traverseSpacialTree(tree, circle => {
        // If this circle cannot engulf any others or it is already marked for 
        // culling so that another bigger circle engulfs it.
        if (circle.radius === 0 || culls.has(circle)) {
            return;
        }
        get_engulfed_vertices_1.getEngulfedVertices(s, tree, circle)
            .forEach(culls.add);
    });
    cull_1.cull(culls, cpNode);
    if (typeof _debug_ !== 'undefined') {
        _debug_.generated.timing.afterSat = performance.now();
        _debug_.sats.push(cpNode);
    }
    return cpNode;
}
exports.toScaleAxis = toScaleAxis;
// TODO
// This algorithm might be made somewhat faster by building tree to a depth 
// where there is say less than 4 other circles and only then split the 
// branch once this threshold has been exceeded.
// 
// Also, when searching, search only in relevant branches even when circle 
// overlaps more than one group. 
