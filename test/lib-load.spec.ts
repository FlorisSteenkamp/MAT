import { describe } from 'mocha';
import { assert, expect } from 'chai';
import { findMats } from '../node/index.js';


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
        let result = findMats(bezierLoops);
        expect(result).to.be.an('array');
        expect(result[0]).to.be.an('object');
        expect(result[0].cpNode).to.be.an('object');
        expect(result[0].cpNode.cp).to.be.an('object');
	});
});