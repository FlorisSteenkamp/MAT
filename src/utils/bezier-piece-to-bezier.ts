import { BezierPiece, fromTo } from "flo-bezier3";


function bezierPieceToBezier(
        piece: BezierPiece) {

    const { ps, ts } = piece;

    return fromTo(ps, ts[0], ts[1]);
}


export { bezierPieceToBezier }
