import { expect, test } from '@jest/globals';
import { findMats } from '../node/index.js';


test('node require', function() {
    let bezierLoops = [
        [
            [[50.000, 95.000],[92.797, 63.905]], 
            [[92.797, 63.905],[76.450, 13.594]],
            [[76.450, 13.594],[23.549, 13.594]],
            [[23.549, 13.594],[7.202,  63.90]],
            [[7.202,  63.900],[50.000, 95.000]]
        ]
    ];

	// it should load the library correctly by running a simple test
	(function() {
        let result = findMats(bezierLoops);
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBeInstanceOf(Object);
        expect(result[0].cpNode).toBeInstanceOf(Object);
        expect(result[0].cpNode.pointOnShape).toBeInstanceOf(Object);
	})();
});