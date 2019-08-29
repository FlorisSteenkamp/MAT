
import { Loop } from "./loop";
import { getX, getY, getDx, getDy } from "flo-bezier3";
import { gaussQuadrature } from 'flo-gauss-quadrature';
import { multiply, add, negate, evaluate } from 'flo-poly';


/** 
 * @hidden
 * See e.g. https://mathinsight.org/greens_theorem_find_area
 */
function getLoopArea(loop: Loop) {
    let totalArea = 0;
    for (let curve of loop.curves) {
        let ps = curve.ps;

        let x = getX(ps);
        let y = getY(ps);
        let dx = getDx(ps);
        let dy = getDy(ps);

        // xy' named as xy_
        let xy_ = multiply(x, dy);
        let yx_ = negate(multiply(y, dx));

        let poly = add(xy_, yx_);
        let f = evaluate(poly);

        let area = gaussQuadrature(f, [0,1], 16);

        totalArea += area;
    }

    return -totalArea / 2;
}


export { getLoopArea }
