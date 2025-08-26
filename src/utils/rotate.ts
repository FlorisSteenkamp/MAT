import { rotate } from "flo-vector2d";
import { degToRad } from "./deg-to-rad";

const { sin, cos } = Math;


function rotateRad(v: number[], θ: number) {
    return rotate(sin(θ), cos(θ))(v);
}


function rotateDeg(v: number[], θ: number) {
    return rotate(sin(degToRad(θ)), cos(degToRad(θ)))(v);
}


export { rotateRad, rotateDeg }
