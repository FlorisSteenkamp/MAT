import { CpNode } from './cp-node';
import { ContactPoint } from '../mat/classes/contact-point';
import { PointOnShape } from '../mat/classes/point-on-shape';
/**
 * Represents a specialised linked graph made for ContactPoints.
 */
declare class CpGraph {
    head: CpNode;
    private cptree;
    /**
     * @param cps - A pre-ordered array of items to add initially; it is
     * faster to add items initially than to add them in a loop with insert.
     */
    constructor(cps?: ContactPoint[]);
    /**
     * Returns the boundary piece that starts at the immediate previous point on
     * the shape and ends at the immediate next point.
     */
    static getNeighbouringPoints(cpGraph: CpGraph, pos: PointOnShape, order: number, order2: number): CpNode[];
    /**
     * Adds all given items from scratch onto the empty LinkedLoop.
     */
    private addAllFromScratch(cps);
    /**
     * Insert an item into the linked loop after the specified point and returns
     * the freshly inserted item.
     * @param cp - Item to insert
     * @param prev_ - Inserts the new item right after this item if the loop is
     * not empty, else insert the new item as the only item in the loop.
     */
    insert(cp: ContactPoint, prev_: CpNode): CpNode;
    /**
     * Removes a node from the linked loop.
     */
    remove(cpNode: CpNode): void;
    /**
     *
     */
    forEach(f: (node: CpNode) => void): void;
    /**
     * Returns the item at the specified index position.
     * @note This is slow ( O(n) ); use in debugging code only.
     */
    getByIndx(n: number): CpNode;
}
export { CpGraph };
