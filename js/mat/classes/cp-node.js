// Currently unused

'use strict'

let ListNode = require('./list-node.js');


function CpNode(item, prev, next) {
	this.item = item;
	this.prev = prev;
	this.next = next;
}


module.exports = CpNode;
