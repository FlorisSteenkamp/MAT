"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getTwoProngType(e) {
    if (e.failed) {
        return 'twoProng_failed';
    }
    if (e.notAdded) {
        return 'twoProng_notAdded';
    }
    if (e.deleted) {
        return 'twoProng_deleted';
    }
    if (e.holeClosing) {
        return 'twoProng_holeClosing';
    }
    return 'twoProng_regular';
}
exports.getTwoProngType = getTwoProngType;
