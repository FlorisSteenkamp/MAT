const { max, min } = Math;
function clip(v, vMin, vMax) {
    return max(vMin, min(vMax, v));
}
export { clip };
//# sourceMappingURL=clip.js.map