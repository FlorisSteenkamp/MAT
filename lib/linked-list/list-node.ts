
import LinkedLoop from './linked-loop';

/**
 * Representation of a linked loop vertex (i.e. node) having various edges, two 
 * of which enforce an ordering on the nodes, i.e. 'prev' and 'next'.
 * @param loop - The linked loop this node belongs to.
 * @param item - The actual item stored at a node.
 * @param prev - The previous item.
 * @param next - The next item.
 */
class ListNode<T> {
	loop: LinkedLoop<T>;
	item: T;
	prev: ListNode<T>;
	next: ListNode<T>;
	coupledNode: ListNode<T>;
	// TODO - we should really subclass linked-loop and/or list-node as the 
	// below only applies to the segregated shape pieces
	prevOnCircle: ListNode<T> = undefined; 
	nextOnCircle: ListNode<T> = undefined;

    constructor(
			loop: LinkedLoop<T>, 
			item: T, 
			prev: ListNode<T>, 
			next: ListNode<T>) {

    	this.loop = loop;
    	this.item = item;
    	this.prev = prev;	
        this.next = next;
	}
	

	/**
	 * Advances the node by the given number of steps. This is slow ( O(n) ); 
	 * use mostly for debugging.
	 * @param node - Node to start counting from
	 * @param n - Number of steps to advance
	 */
	public static advanceNSteps<T>(node: ListNode<T>, n: number) {
		for (let i=0; i<n; i++) {
			node = node.next;
		}
		
		return node;
	}
}


export default ListNode;
