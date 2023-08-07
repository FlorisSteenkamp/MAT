/** @internal */
function getPFromBox(box) {
    const tl = box[0];
    const br = box[1];
    return [
        (tl[0] + br[0]) / 2,
        (tl[1] + br[1]) / 2,
    ];
}
export { getPFromBox };
//# sourceMappingURL=get-p-from-box.js.map