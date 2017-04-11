'use strict'

let LlRbTree = require('../ll-rb-tree/ll-rb-tree.js');
let ListNode = require('./list-node.js');
	

/**
 * Represents a two-way linked loop. 
 * @constructor 
 *
 * @param comparator Tree item comparator
 *
 * NOTE: Must be called with a *sorted* array if comparator is not 
 * given. 
 */
function LinkedLoop(array, comparator) {
	if (comparator) {
		this.cptree = new LlRbTree(comparator);
	} 
	
	this.addAllFromScratch(array || []);
}


/**
 * Insert an item into the linked loop after specified point 
 * 
 * @param item  {*} - Item to insert.
 * @param prev - Insert new item right after this item.
 * @param coupledNode
 */
LinkedLoop.insert = function(loop, item, prev_, coupledNode) {

	let node = new ListNode(
			item, undefined, undefined 
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
		LlRbTree.insert(loop.cptree, node);
	};
	
	return node;
}


LinkedLoop.remove = function(loop, item) {
	
	let prev = item.prev;
	let next = item.next;
	
	if (item === loop.head) {
		loop.head = next; 
	}
	
	prev.next = next;
	next.prev = prev;
	
	if (loop.cptree) { 
		// TODO - could be made faster by removing on item directly
		//loop.cptree.remove(item); 
		LlRbTree.remove(loop.cptree, item);
	};
}


/**
 * Returns the item at the specified index position..
 * 
 * NOTE: This is slow ( O(n) ); use in debugging code only.
 */
LinkedLoop.getByIndx = function(linkedLoop, n) {
	return ListNode.advanceNSteps(linkedLoop.head, n);
}


LinkedLoop.prototype.addAllFromScratch = function(arr) {

	if (arr.length === 0) { return; }
	
	// TODO Remove nodeArr occurences and put them in debug parts only.
	var nodeArr = [];
	
	var head;
	var prevNode = null;
	let node;
	
	for (let i=0; i<arr.length; i++) {
		
		node = new ListNode(
			arr[i],
			prevNode,
			null,
			i
		);
		
		nodeArr.push(node);
		
		if (prevNode) { prevNode.next = node; }
		prevNode = node; 
		
		if (i === 0) { head = node; }
		
		
		if (this.cptree) { 
			LlRbTree.insert(this.cptree, node)  
		};
	}
	
	// Close loop
	head.prev = node;
	node.next = head;
		
		
	this.head = head;
	this.nodeArr = nodeArr; // This is a hash cache in shape of array		
}
	

module.exports = LinkedLoop;




