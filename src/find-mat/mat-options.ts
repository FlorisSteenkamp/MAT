
interface MatOptions {
    /** 
     * The maximum value the 'curviness' of a curve can have 
     * before an additional MAT point is inserted in between.
     * (Curviness is measured as the total angle in radians between the consecutive 
     * vectors formed by the ordered control points of th bezier curve).
     * 
     * * Defaults to `0.05`.
     * * The value is clipped in the range `[0.01,3]`.
     */
    maxCurviness?: number;

    /**
     * The maximum length a curve can have before an additional MAT 
     * point is inserted. This value is scaled to a reference 1024 x 1024 
     * grid (e.g. if the shape fits in a 512 x 512 axis-aligned box the value will be 
     * halved, e.g. from 10 to 5). Together with maxCurviness it represents a 
     * tolerance for the accuracy of the MAT.
     * 
     * * Defaults to `40`.
     * * The value is clipped in `[1,1024]`.
     */
    maxLength?: number;

    /**
     * If `true` then `toScaleAxis` will be applied to the MAT (and before
     * inserting phatoms) that could dramatically simplify the MAT skeleton.
     * 
     * * Defaults to `true`
     */
    applySat?: boolean;

    /**
     * The higher this value, the more aggresively the
     * Scale Axis is applied.
     * 
     * * Only applies if `applySat` is `true`
     * * Defaults to 2
     * * The value is clipped in `[1,Number.POSITIVE_INFINITY]`
     * * Should be larger than one to have an effect
     */
    satScale?: number;

    /**
     * If `true` then the `simplyfiMats` will be applied which will replace
     * multiple MAT curves with a single one to within a specified tolerance 
     * determined by the Hausdorff distance between curves and can dramatically
     * reduce the number of MAT curves and 2-prongs.
     * 
     * * Defaults to `true`
     */
    simplify?: boolean;

    /**
     * The tolerance, given as the Hausdorff distance between curves, to
     * determine the accuracy of the simplification. The higher this value the
     * more simplification will be applied but the less accurate the result.
     * 
     * * Only applies if `simplify` is `true`
     * * Defaults to `1/16`
     * * The value is clipped in `[2**-10,1024]`
     * * scaled to a 1024x1024 vector image size, i.e. a value of `1` on such
     * a vector image will have a `1` pixel accuracy. If the vector is, say,
     * 512x400 then the accuracy is scaled to `1/2` a pixel. This ensures
     * scale invariance on the accuracy.
     */
    simplifyTolerance?: number;

    /**
     * Minimum bezier length before no `CpNode` will attach to it.
     * 
     * * it is not recommended to change this value
     * * scaled to a 1024x1024 vector image size
     * * Defaults to `1/16`
     */
    minBezLength?: number;

    /**
     * Angle (in degrees) increments around sharp obtuse corners. The lower the
     * angle, the better the accuracy.
     * 
     * * Defaults to `15`
     */
    angleIncrement?: number;

    /**
     * If `true` then 2-prongs will be inserted apatively according to the
     * error between the MAT implied boundary curve and the actual curve
     */
    // adaptiveTolerance?: boolean;
}


const defaultMatOptions: Required<MatOptions> = {
    maxCurviness: 0.05,
    maxLength: 40,
    applySat: true,
    satScale: 2,
    simplify: true,
    simplifyTolerance: 2**-4,
    minBezLength: 2**-6,
    angleIncrement: 15
    // adaptiveTolerance: true,
}


type MatOptionMeta = {
    range: [number,number],
    scaleByMaxCoordinate?: boolean | undefined,
    scaleByMaxRadius?: boolean | undefined
}


const matOptionRanges: Partial<{ [K in keyof MatOptions]: MatOptionMeta }> = {
    maxCurviness: {
        range: [0.01,3]
    },
    maxLength: {
        range: [1,1024],
        scaleByMaxRadius: true
    },
    angleIncrement: {
        range: [0.1, 360]
    },
    satScale: {
        range: [1, Number.POSITIVE_INFINITY],
    },
    simplifyTolerance: {
        range: [2**-10,1024],
        scaleByMaxCoordinate: true
    },
    minBezLength: {
        range: [2**-20,2],
        scaleByMaxCoordinate: true
    }
}


export { MatOptions, MatOptionMeta, defaultMatOptions, matOptionRanges }
