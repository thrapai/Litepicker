"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findNestedMonthItem = exports.getOrientation = exports.isMobile = void 0;
function isMobile() {
    var isPortrait = getOrientation() === 'portrait';
    return window.matchMedia("(max-device-" + (isPortrait ? 'width' : 'height') + ": " + 480 + "px)").matches;
}
exports.isMobile = isMobile;
function getOrientation() {
    if (window.matchMedia('(orientation: portrait)').matches) {
        return 'portrait';
    }
    return 'landscape';
}
exports.getOrientation = getOrientation;
function findNestedMonthItem(monthItem) {
    var children = monthItem.parentNode.childNodes;
    for (var i = 0; i < children.length; i = i + 1) {
        var curNode = children.item(i);
        if (curNode === monthItem) {
            return i;
        }
    }
    return 0;
}
exports.findNestedMonthItem = findNestedMonthItem;
