'use strict'

/*
 * Concise, Destructive, Left Leaning Red Black Tree implementation.
 * See: https://www.cs.princeton.edu/~rs/talks/LLRB/LLRB.pdf
 * See: https://en.wikipedia.org/wiki/Left-leaning_red%E2%80%93black_tree
 * See: http://www.teachsolaisgames.com/articles/balanced_left_leaning.html 
 */

const LEFT  = false;
const RIGHT = true;

const RED   = true;const BLACK = false;


/**
 * Red Black Tree node.
 * @constructor 
 * @param {*} data
 */
function Node(data) {
	this.data = data;
	this.red  = true;
}


Node.isRed = function(node) {
    return node && node.red;
}


/** 
 * @constructor 
 */	
function LlRbTree(comparator) {
	this.comparator = comparator;
    this.root = null;
}


function getMinOrMaxNode(dir, node) {
	return function(node) {
		while (node[dir]) {
	    	node = node[dir];
	    }
	    return node;	
	}
}


LlRbTree.getMinNode = getMinOrMaxNode(LEFT);
LlRbTree.getMaxNode = getMinOrMaxNode(RIGHT);

LlRbTree.min = function(node) {
	return LlRbTree.getMinNode(node).data;
}

LlRbTree.max = function(node) {
	return LlRbTree.getMaxNode(node).data;
}


/**
 * @return The 2 nodes bounding the data. If overflow occurs, min is 
 * returned as the second one. If bounds cannot be found (tree is empty 
 * or contains 1 item) returns null. If the data falls on a node, that 
 * node and the next (to the right) is returned. 
 */
LlRbTree.findBounds = function(tree, data) {
	let node = tree.root;
	
	if (node === null) { return null; }

	var bounds = [];
    while (node) {
        var c = tree.comparator(data, node.data);  
        if (c >= 0) { 
        	bounds[0] = node;
        } else {
        	bounds[1] = node;
        }
        
        node = node[c >= 0];
    }

    return bounds;
}


/**
 * Find the node in the tree with the given data using ===. 
 * 
 * @return {Node} node or null if not found.
 */
LlRbTree.find = function(tree, data) {
    let node = tree.root;

    while (node) {
        let c = tree.comparator(data, node.data);
        if (c === 0) {
            return node;
        } else {
        	node = node[c > 0];
        }
    }

    return null;
}


/**
 * Inserts a node with given data into the tree.
 */
LlRbTree.insert = function(tree, data) {
	tree.root = insert(tree.root, data);
	tree.root.red = false; 
	
	function insert(h, data) {
		if (h == null) {
			return new Node(data);
		}
		
		if (Node.isRed(h[LEFT]) && Node.isRed(h[RIGHT])) {
			flipColors(h);
		}
		
		let cmp = tree.comparator(data, h.data);
		if (cmp === 0) {
			h.data = data;
		} else if (cmp < 0) {
			h[LEFT] = insert(h[LEFT], data);
		} else {
			h[RIGHT] = insert(h[RIGHT], data);
		}
		
		if (Node.isRed(h[RIGHT]) && !Node.isRed(h[LEFT])) {
			h = rotate(LEFT, h);
		}
		if (Node.isRed(h[LEFT]) && Node.isRed(h[LEFT][LEFT])) {
			h = rotate(RIGHT, h);
		}
		
		return h;
	}
}


function rotate(dir, h) {
	let x = h[!dir];
	h[!dir] = x[dir];
	x[dir] = h;
	x.red = h.red;
	h.red = true;
	
	return x;
}


function flipColors(h) {
	h.red = !h.red;
	h[LEFT].red = !h[LEFT].red;
	h[RIGHT].red = !h[RIGHT].red;
}


function moveRedLeft(h) {
	flipColors(h);
	if (Node.isRed(h[RIGHT][LEFT])) {
		h[RIGHT] = rotate(RIGHT, h[RIGHT]);
		h = rotate(LEFT, h);
		flipColors(h);
	}
	
	return h;
}


function moveRedRight(h) {
	flipColors(h);
	if (Node.isRed(h[LEFT][LEFT])) {
		h = rotate(RIGHT, h);
		flipColors(h);
	}
	
	return h;
}


/**
 * Removes an item from the tree based on the given data (using ===). 
 * 
 * Note: Currently, a precondition is that the data must exist in the 
 * tree. In the future we can easily modify the code to relax this 
 * requirement. 
 */
LlRbTree.remove = function(tree, data) {
	tree.root = remove(tree.root, data);
	if (tree.root) { tree.root.red = false; }
	
	function remove(h, data) {
		if (tree.comparator(data, h.data) < 0) {
			if (!Node.isRed(h[LEFT]) && !Node.isRed(h[LEFT][LEFT])) {
				h = moveRedLeft(h);
			}
			h[LEFT] = remove(h[LEFT], data);
			
			return fixUp(h);
		} 
		
		
		if (Node.isRed(h[LEFT])) {
			h = rotate(RIGHT, h);
		}
		
		if (!h[RIGHT] && tree.comparator(data, h.data) === 0) {
			return null;
		}
		if (!Node.isRed(h[RIGHT]) && (!Node.isRed(h[RIGHT][LEFT]))) {
			h = moveRedRight(h);
		}
		
		if (tree.comparator(data, h.data) === 0) {
			h.data = LlRbTree.min(h[RIGHT]);  
			h[RIGHT] = removeMin(h[RIGHT]);
		} else {
			h[RIGHT] = remove(h[RIGHT], data);
		}
		
		return fixUp(h);
	}
	
	
	function removeMin(h) {
		if (!h[LEFT]) {
			return null;
		}
		if (!Node.isRed(h[LEFT]) && !Node.isRed(h[LEFT][LEFT])) {
			h = moveRedLeft(h);
		}
		h[LEFT] = removeMin(h[LEFT]);
		
		return fixUp(h);
	}	
}


/**
 * Fix right-leaning red nodes.
 */
function fixUp(h)	{
    if (Node.isRed(h[RIGHT])) {
        h = rotate(LEFT, h);
    }

    if (Node.isRed(h[LEFT]) && Node.isRed(h[LEFT][LEFT])) {
        h = rotate(RIGHT, h);
    }

    // Split 4-nodes.
    if (Node.isRed(h[LEFT]) && Node.isRed(h[RIGHT])) {
        flipColors(h);
    }

    return h;
}


module.exports = LlRbTree;
