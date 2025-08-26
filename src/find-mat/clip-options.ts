import { MatOptionMeta, matOptionRanges, MatOptions } from './mat-options.js';


function clipOptions(
        maxCoordinate: number,
        maxRadius: number,
        options: Required<MatOptions>): Required<MatOptions> {

    const expMaxCoord = Math.ceil(Math.log2(maxCoordinate));
    const expMaxRadius = Math.ceil(Math.log2(maxRadius));
    const scaleSigBits = 10;  // 1024 x 1024

    const options_ = { ...options };
    for (const k in matOptionRanges) {
        // @ts-ignore
        let o = options_[k];
        // @ts-ignore
        const c = matOptionRanges[k] as MatOptionMeta;
        const { range, scaleByMaxCoordinate, scaleByMaxRadius } = c;
        if (o < range[0]) { o = range[0]; }
        if (o > range[1]) { o = range[1]; }

        // Adjust length tolerance according to a reference max coordinate
        if (!!scaleByMaxCoordinate) {
            o = o * (2**expMaxCoord * 2**(-scaleSigBits));
        } else if (!!scaleByMaxRadius) {
            o = o * (2**expMaxRadius * 2**(-scaleSigBits));
        }

        // @ts-ignore
        options_[k] = o;
    }

    return options_;
}


export { clipOptions }
