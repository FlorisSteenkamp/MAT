"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Medial (or Scale) Axis Transform (MAT) maximal contact circle class,
 * i.e. a representative data point of the MAT.
 *
 * @constructor
 * @param {Circle} circle
 * @param {ListNode[]} cpNodes - The contact points of this circle on the shape.
 * @note Do not do 'new MatCircle', rather use 'MatCircle.create'.
 */
class MatCircle {
    constructor(circle, cpNodes) {
        this.circle = circle;
        this.cpNodes = cpNodes;
        this.visited = 0; // TODO - does not belong inside the class
    }
    /**
     * MatCircle creator.
     * @param {Circle} circle
     * @param {ListNode[]} cpNodes An array of 'orphaned'
     *        (i.e. without belonging to a MatCircle) contact points.
     * Notes: Due to the mutual dependency between the matCircle and
     * contactPoints fields, a normal constructor can not instantiate a
     * MatCircle in one step - hence this creator.
     */
    static create(circle, cpNodes) {
        let matCircle = new MatCircle(circle, undefined);
        for (let i = 0; i < cpNodes.length; i++) {
            cpNodes[i].item.matCircle = matCircle;
        }
        matCircle.cpNodes = cpNodes;
        return matCircle;
    }
}
exports.default = MatCircle;
