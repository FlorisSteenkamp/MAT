
import LlRbTree from 'flo-ll-rb-tree';
import ListNode from './list-node';
	

/**
 * Represents a destructive (i.e. not functional) two-way linked loop. 
 * @param items - A pre-ordered array of items to add initially; it is 
 * faster to add items initially than to add them in a loop with insert.
 * @param comparator - Tree item comparator
 * @param indx - Loop identifier.
 */
class LinkedLoop<T> {
    items: T[];
    cptree: LlRbTree<ListNode<T>>;
    indx: number;
    public head: ListNode<T>;

    constructor(
			items: T[], 
			comparator?: (a: ListNode<T>, b: ListNode<T>) => number, 
			indx?: number) {

	    if (comparator) {
		    this.cptree = new LlRbTree(comparator, [], true);
	    } 
	
	    this.indx = indx;
        
        this.addAllFromScratch(items || []);
    }

    /**
     * Adds all given items from scratch onto the empty LinkedLoop.
     */
    private addAllFromScratch(arr: T[]) {
        if (arr.length === 0) { return; }
        
        let head:     ListNode<T>;
        let prevNode: ListNode<T> = null;
        let node:     ListNode<T>;
        
        for (let i=0; i<arr.length; i++) {
            
            node = new ListNode(
                this,
                arr[i],
                prevNode,
                null
            );
            
            if (prevNode) { prevNode.next = node; }
            prevNode = node; 
            
            if (i === 0) { head = node; }
            
            if (this.cptree) { 
                this.cptree.insert(node);
            };
        }
        
        // Close loop
        head.prev = node;
        node.next = head;
            
        
        this.head = head;
	}
	

	/**
	 * Insert an item into the linked loop after the specified point.
	 * @param item - Item to insert
	 * @param prev - Inserts the new item right after this item
	 * @param coupledNode - A node coupled to this one
	 */
	public insert(
		item: T, 
		prev_: ListNode<T>, 
		coupledNode: ListNode<T> = undefined): ListNode<T> {
	
		let loop = this;

		let node = new ListNode(
				loop, item, undefined, undefined 
		);
		
		let prev;
		let next;
		
		if (!loop.head) {
			prev = node;
			next = node;
			
			loop.head = node;
		} else {
			prev = prev_;
			next = prev.next;
		}
	
		
		next.prev = node;
		prev.next = node;
		node.prev = prev;
		node.next = next;
			
		node.coupledNode = coupledNode;
		
		if (loop.cptree) {
			loop.cptree.insert(node);
		};
		
		return node;
	}


	/**
	 * Removes a node from the linked loop.
	 */
	public remove(node: ListNode<T>) {

		let loop = this;
		
		let prev = node.prev;
		let next = node.next;
		
		if (node === loop.head) {
			loop.head = next; 
		}
		
		prev.next = next;
		next.prev = prev;
		
		if (loop.cptree) { 
			loop.cptree.remove(node, false); // TODO, make the second parameter default
		};
	}


	/**
	 * 
	 */
	public getAsArray() {
		let loop = this;

		let nodes = [];
		
		let node = loop.head;
		do {
			nodes.push(node.item);
			
			node = node.next;
		} while (node !== loop.head);
		
		return nodes;
	}


	/**
	 * 
	 */
	public forEach(f: (node: ListNode<T>) => void) {
		let loop = this;

		let node = loop.head;
		do {
			f(node);
			
			node = node.next;
		} while (node !== loop.head);
	}


	/**
	 * Returns the item at the specified index position.
	 * @note This is slow ( O(n) ); use in debugging code only.
	 */
	public getByIndx(n: number) {
		let loop = this;
		return ListNode.advanceNSteps(loop.head, n);
	}
}


export default LinkedLoop;
