'use strict'

var mocha;
var chai;
var FloMat;

// Don't change this
// https://stackoverflow.com/questions/17575790/environment-detection-node-js-or-browser
var isBrowser = new Function("try {return this===window;}catch(e){ return false;}");

if (isBrowser()) {

} else {
    mocha  = require('mocha');
    chai   = require('chai');
    //FloMat = require('flo-mat');
    FloMat = require('../../node/index.js');
}

var { assert, expect } = chai;

describe('node require', function() {
    let bezierLoops = [
        [
            [[50.000, 95.000],[92.797, 63.905]], 
            [[92.797, 63.905],[76.450, 13.594]],
            [[76.450, 13.594],[23.549, 13.594]],
            [[23.549, 13.594],[7.202,  63.90]],
            [[7.202,  63.900],[50.000, 95.000]]
        ]
    ];

	it('should load the library correctly by running a simple test', 
	function() {
        //console.log(FloMat);
        let result = FloMat.findMats(bezierLoops);
        expect(result).to.be.an('array');
        expect(result[0]).to.be.an('object');
        expect(result[0].cpNode).to.be.an('object');
        expect(result[0].cpNode.cp).to.be.an('object');
        //console.log(result);
	});
});