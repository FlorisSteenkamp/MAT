export interface IDrawFunctions {
    circle: (g: SVGGElement, circle: {
        center: number[];
        radius: number;
    }, classes?: string, delay?: number) => SVGElement[];
    crossHair: (g: SVGGElement, p: number[], classes?: string, r?: number, delay?: number) => SVGElement[];
    dot: (g: SVGGElement, p: number[], r?: number, color?: string, delay?: number) => SVGElement[];
    line: (g: SVGGElement, l: number[][], classes?: string, delay?: number) => SVGElement[];
    rect: (g: SVGGElement, ps: number[][], class_?: string, delay?: number) => SVGElement[];
    beziers: (g: SVGGElement, beziers: number[][][], classes?: string, delay?: number) => SVGElement[];
    bezier: (g: SVGGElement, bezier: number[][], class_?: string, delay?: number) => SVGElement[];
    quadBezier: (g: SVGGElement, ps: number[][], class_?: string, delay?: number) => SVGElement[];
    polygon: (g: SVGGElement, ls: number[][], class_?: string, delay?: number) => SVGElement[];
    polyline: (g: SVGGElement, ls: number[][], class_?: string, delay?: number) => SVGElement[];
    bezierPiece: (g: SVGGElement, ps_: number[][], tRange: number[], class_: string, delay?: number) => SVGElement[];
}
