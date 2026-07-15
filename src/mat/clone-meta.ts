import { MatMeta } from './mat-meta.js';


function cloneMeta(meta: MatMeta): MatMeta {
    // const {
    //     boundingHulls, cpTrees, dullCorners,
    //     loops, looseBoundingBoxes, pointToCpNode, sharpCorners,
    //     tightBoundingBoxes, salientCulls, satCulls, maxCoordPowerOf2,
    //     squaredDiagonalLength
    // } = meta;

    // TODO2
    return { ...meta }
}


export { cloneMeta }
