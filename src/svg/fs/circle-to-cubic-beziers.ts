
import { beziersToSvgPathStr } from "./beziers-to-svg-path-str";

const C = 0.55191502449;


function circleToCubicBeziers(
        center: number[] = [0,0],
        radius: number, 
        clockwise: boolean = false) {

    let x = center[0];
    let y = center[1];
    let r = radius;
    let c = r*C;

    let pss = [
        [[x,   y+r],  [x+c,y+r],  [x+r,y+c],  [x+r, y  ]],
        [[x+r, y  ],  [x+r,y-c],  [x+c,y-r],  [x,   y-r]],
        [[x,   y-r],  [x-c,y-r],  [x-r,y-c],  [x-r, y  ]],
        [[x-r, y  ],  [x-r,y+c],  [x-c,y+r],  [x,   y+r]]
    ];

    if (!clockwise) {
        return pss;
    }

    return (
        pss.map( ps => ps.slice().reverse() ).slice().reverse()
    );
}


export { circleToCubicBeziers }
