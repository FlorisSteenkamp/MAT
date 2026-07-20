
const { max, min } = Math;

function clip(
        v: number,
        vMin: number,
        vMax: number): number {

    return max(vMin, min(vMax, v));
}


export { clip }
