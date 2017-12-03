'use strict'

let LlRbTree = require('../ll-rb-tree/ll-rb-tree.js');
let ListNode = require('./list-node.js');
	

/**
 * Represents a two-way linked loop. 
 * @constructor 
 *
 * @param comparator - Tree item comparator
 * @param {number} indx - Loop identifier.
 * @note If called with an array, must be called with a sorted array if  
 * comparator is not given. 
 */
function LinkedLoop(array, comparator, indx) {
	if (comparator) {
		this.cptree = new LlRbTree(comparator);
	} 
	
	this.indx = indx;
	
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
		LlRbTree.insert(loop.cptree, node);
	};
	
	return node;
}


/**
 * 
 */
LinkedLoop.remove = function(loop, node) {
	
	let prev = node.prev;
	let next = node.next;
	
	if (node === loop.head) {
		loop.head = next; 
	}
	
	prev.next = next;
	next.prev = prev;
	
	if (loop.cptree) { 
		// TODO - could be made faster by removing on item directly
		//loop.cptree.remove(item); 
		LlRbTree.remove(loop.cptree, node);
	};
}


/**
 * @description 
 */
LinkedLoop.getAsArray = function(loop) {
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
LinkedLoop.forEach = function(loop, f) {
	
	let node = loop.head;
	do {
		f(node);
		
		node = node.next;
	} while (node !== loop.head);
}


/**
 * @description Returns the item at the specified index position.
 * @note This is slow ( O(n) ); use in debugging code only.
 */
LinkedLoop.getByIndx = function(linkedLoop, n) {
	return ListNode.advanceNSteps(linkedLoop.head, n);
}


/**
 * 
 */
LinkedLoop.prototype.addAllFromScratch = function(arr) {

	if (arr.length === 0) { return; }
	
	var head;
	var prevNode = null;
	let node;
	
	for (let i=0; i<arr.length; i++) {
		
		node = new ListNode(
			this,
			arr[i],
			prevNode,
			null,
			i
		);
		
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
}
	

module.exports = LinkedLoop;
