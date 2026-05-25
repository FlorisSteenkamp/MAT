import { getRealProngCount } from "./get-real-prong-count.js";
function isSpecial(cpNode) {
    return ((getRealProngCount(cpNode) !== 2) &&
        !cpNode.isHoleClosing);
}
export { isSpecial };
//# sourceMappingURL=is-special.js.map