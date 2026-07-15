import type { Mutable } from '../utils/mutable.js';
import { matOptionRanges, type MatOptions } from './mat-options.js';


function clipOptions(
        maxCoordPowerOf2: number,
        options: Required<MatOptions>): Required<MatOptions> {

    const scaleSigBits = 10;  // 1024 x 1024

    const options_: Mutable<Required<MatOptions>> = { ...options };

    for (const k in matOptionRanges) {
        const key = k as keyof typeof matOptionRanges;
        let o = options_[key];
        const c = matOptionRanges[key];
        const { range, scaleByMaxCoordinate } = c;
        if (o < range[0]) { o = range[0]; }
        if (o > range[1]) { o = range[1]; }

        // Adjust length tolerance according to a reference max coordinate
        if (!!scaleByMaxCoordinate) {
            o *= 2**(maxCoordPowerOf2 - scaleSigBits);
        }

        options_[key] = o;
    }

    return options_;
}


export { clipOptions }
