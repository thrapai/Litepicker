"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Litepicker = void 0;
var litepicker_1 = require("./litepicker");
Object.defineProperty(exports, "Litepicker", { enumerable: true, get: function () { return litepicker_1.Litepicker; } });
require("./methods");
require("./window");
window.Litepicker = litepicker_1.Litepicker;
exports.default = litepicker_1.Litepicker;
