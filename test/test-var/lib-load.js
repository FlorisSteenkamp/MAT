'use strict'

var FloMat; // Already defined in script

f();

function f() {
    let bezierLoops = [
        [
            [[50.000, 95.000],[92.797, 63.905]], 
            [[92.797, 63.905],[76.450, 13.594]],
            [[76.450, 13.594],[23.549, 13.594]],
            [[23.549, 13.594],[7.202,  63.90]],
            [[7.202,  63.900],[50.000, 95.000]]
        ]
    ];
    
    //console.log(FloMat);
    let result = FloMat.findMats(bezierLoops);
    console.log(result);
};
