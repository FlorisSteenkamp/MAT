/**
 * @hidden
 * Takes path data that consists only from absolute commands and returns path
 * data that consists only from "M", "L", "C" and "Z" commands.
 */
declare function reducePathData(pathData: {
    type: string;
    values: number[];
}[]): {
    type: string;
    values: number[];
}[];
export { reducePathData };
