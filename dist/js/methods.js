"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var datetime_1 = require("./datetime");
var litepicker_1 = require("./litepicker");
var style = __importStar(require("./scss/main.scss"));
var utils_1 = require("./utils");
litepicker_1.Litepicker.prototype.show = function (el) {
    if (el === void 0) { el = null; }
    var element = el ? el : this.options.element;
    this.triggerElement = element;
    if (this.options.inlineMode) {
        this.picker.style.position = 'static';
        this.picker.style.display = 'inline-block';
        this.picker.style.top = null;
        this.picker.style.left = null;
        this.picker.style.bottom = null;
        this.picker.style.right = null;
        return;
    }
    if (this.options.scrollToDate) {
        if (this.options.startDate && (!el || el === this.options.element)) {
            var startDate = this.options.startDate.clone();
            startDate.setDate(1);
            this.calendars[0] = startDate.clone();
        }
        else if (el && this.options.endDate && el === this.options.elementEnd) {
            var endDate = this.options.endDate.clone();
            endDate.setDate(1);
            if (this.options.numberOfMonths > 1) {
                endDate.setMonth(endDate.getMonth() - (this.options.numberOfMonths - 1));
            }
            this.calendars[0] = endDate.clone();
        }
    }
    if (this.options.mobileFriendly && utils_1.isMobile()) {
        this.picker.style.position = 'fixed';
        this.picker.style.display = 'block';
        if (utils_1.getOrientation() === 'portrait') {
            this.options.numberOfMonths = 1;
            this.options.numberOfColumns = 1;
        }
        else {
            this.options.numberOfMonths = 2;
            this.options.numberOfColumns = 2;
        }
        this.render();
        var pickerBCR_1 = this.picker.getBoundingClientRect();
        this.picker.style.top = "calc(50% - " + (pickerBCR_1.height / 2) + "px)";
        this.picker.style.left = "calc(50% - " + (pickerBCR_1.width / 2) + "px)";
        this.picker.style.right = null;
        this.picker.style.bottom = null;
        this.picker.style.zIndex = this.options.zIndex;
        this.backdrop.style.display = 'block';
        this.backdrop.style.zIndex = this.options.zIndex - 1;
        document.body.classList.add(style.litepickerOpen);
        if (typeof this.options.onShow === 'function') {
            this.options.onShow.call(this);
        }
        if (el) {
            el.blur();
        }
        else {
            this.options.element.blur();
        }
        return;
    }
    this.render();
    this.picker.style.position = 'absolute';
    this.picker.style.display = 'block';
    this.picker.style.zIndex = this.options.zIndex;
    var elBCR = element.getBoundingClientRect();
    var pickerBCR = this.picker.getBoundingClientRect();
    var top = elBCR.bottom;
    var left = elBCR.left;
    var scrollX = 0;
    var scrollY = 0;
    var topAlt = 0;
    var leftAlt = 0;
    if (this.options.parentEl) {
        var parentBCR = this.picker.parentNode.getBoundingClientRect();
        top -= parentBCR.bottom;
        top += elBCR.height;
        if (top + pickerBCR.height > window.innerHeight
            && (elBCR.top - parentBCR.top) - elBCR.height > 0) {
            topAlt = (elBCR.top - parentBCR.top) - elBCR.height;
        }
        left -= parentBCR.left;
        if (left + pickerBCR.width > window.innerWidth
            && (elBCR.right - parentBCR.right) - pickerBCR.width > 0) {
            leftAlt = (elBCR.right - parentBCR.right) - pickerBCR.width;
        }
    }
    else {
        scrollX = window.scrollX || window.pageXOffset;
        scrollY = window.scrollY || window.pageYOffset;
        if (top + pickerBCR.height > window.innerHeight
            && elBCR.top - pickerBCR.height > 0) {
            topAlt = elBCR.top - pickerBCR.height;
        }
        if (left + pickerBCR.width > window.innerWidth
            && elBCR.right - pickerBCR.width > 0) {
            leftAlt = elBCR.right - pickerBCR.width;
        }
    }
    this.picker.style.top = (topAlt ? topAlt : top) + scrollY + "px";
    this.picker.style.left = (leftAlt ? leftAlt : left) + scrollX + "px";
    this.picker.style.right = null;
    this.picker.style.bottom = null;
    if (typeof this.options.onShow === 'function') {
        this.options.onShow.call(this);
    }
};
litepicker_1.Litepicker.prototype.hide = function () {
    if (!this.isShowning()) {
        return;
    }
    this.datePicked.length = 0;
    this.updateInput();
    if (this.options.inlineMode) {
        this.render();
        return;
    }
    this.picker.style.display = 'none';
    if (typeof this.options.onHide === 'function') {
        this.options.onHide.call(this);
    }
    if (this.options.mobileFriendly) {
        document.body.classList.remove(style.litepickerOpen);
        this.backdrop.style.display = 'none';
    }
};
litepicker_1.Litepicker.prototype.getDate = function () {
    return this.getStartDate();
};
litepicker_1.Litepicker.prototype.getStartDate = function () {
    if (this.options.startDate) {
        var castedObj = this.options.startDate.clone();
        return castedObj.getDateInstance();
    }
    return null;
};
litepicker_1.Litepicker.prototype.getEndDate = function () {
    if (this.options.endDate) {
        var castedObj = this.options.endDate.clone();
        return castedObj.getDateInstance();
    }
    return null;
};
litepicker_1.Litepicker.prototype.setDate = function (date) {
    this.setStartDate(date);
    if (typeof this.options.onSelect === 'function') {
        this.options.onSelect.call(this, this.getDate());
    }
};
litepicker_1.Litepicker.prototype.setStartDate = function (date) {
    if (!date)
        return;
    this.options.startDate = new datetime_1.DateTime(date, this.options.format, this.options.lang);
    this.updateInput();
};
litepicker_1.Litepicker.prototype.setEndDate = function (date) {
    if (!date)
        return;
    this.options.endDate = new datetime_1.DateTime(date, this.options.format, this.options.lang);
    if (this.options.startDate.getTime() > this.options.endDate.getTime()) {
        this.options.endDate = this.options.startDate.clone();
        this.options.startDate = new datetime_1.DateTime(date, this.options.format, this.options.lang);
    }
    this.updateInput();
};
litepicker_1.Litepicker.prototype.setDateRange = function (date1, date2) {
    // stop repicking by resetting the trigger element
    this.triggerElement = undefined;
    this.setStartDate(date1);
    this.setEndDate(date2);
    this.updateInput();
    if (typeof this.options.onSelect === 'function') {
        this.options.onSelect.call(this, this.getStartDate(), this.getEndDate());
    }
};
litepicker_1.Litepicker.prototype.gotoDate = function (date, idx) {
    if (idx === void 0) { idx = 0; }
    var toDate = new datetime_1.DateTime(date);
    toDate.setDate(1);
    this.calendars[idx] = toDate.clone();
    this.render();
};
litepicker_1.Litepicker.prototype.setLockDays = function (array) {
    this.options.lockDays = datetime_1.DateTime.convertArray(array, this.options.lockDaysFormat);
    this.render();
};
litepicker_1.Litepicker.prototype.setBookedDays = function (array) {
    this.options.bookedDays = datetime_1.DateTime.convertArray(array, this.options.bookedDaysFormat);
    this.render();
};
litepicker_1.Litepicker.prototype.setHighlightedDays = function (array) {
    this.options.highlightedDays = datetime_1.DateTime.convertArray(array, this.options.highlightedDaysFormat);
    this.render();
};
litepicker_1.Litepicker.prototype.setOptions = function (options) {
    delete options.element;
    delete options.elementEnd;
    delete options.parentEl;
    if (options.startDate) {
        options.startDate = new datetime_1.DateTime(options.startDate, this.options.format, this.options.lang);
    }
    if (options.endDate) {
        options.endDate = new datetime_1.DateTime(options.endDate, this.options.format, this.options.lang);
    }
    var dropdowns = __assign(__assign({}, this.options.dropdowns), options.dropdowns);
    var buttonText = __assign(__assign({}, this.options.buttonText), options.buttonText);
    var tooltipText = __assign(__assign({}, this.options.tooltipText), options.tooltipText);
    this.options = __assign(__assign({}, this.options), options);
    this.options.dropdowns = __assign({}, dropdowns);
    this.options.buttonText = __assign({}, buttonText);
    this.options.tooltipText = __assign({}, tooltipText);
    if (this.options.singleMode && !(this.options.startDate instanceof datetime_1.DateTime)) {
        this.options.startDate = null;
        this.options.endDate = null;
    }
    if (!this.options.singleMode
        && (!(this.options.startDate instanceof datetime_1.DateTime)
            || !(this.options.endDate instanceof datetime_1.DateTime))) {
        this.options.startDate = null;
        this.options.endDate = null;
    }
    for (var idx = 0; idx < this.options.numberOfMonths; idx += 1) {
        var date = this.options.startDate
            ? this.options.startDate.clone()
            : new datetime_1.DateTime();
        date.setDate(1);
        date.setMonth(date.getMonth() + idx);
        this.calendars[idx] = date;
    }
    if (this.options.lockDays.length) {
        this.options.lockDays = datetime_1.DateTime.convertArray(this.options.lockDays, this.options.lockDaysFormat);
    }
    if (this.options.bookedDays.length) {
        this.options.bookedDays = datetime_1.DateTime.convertArray(this.options.bookedDays, this.options.bookedDaysFormat);
    }
    if (this.options.highlightedDays.length) {
        this.options.highlightedDays = datetime_1.DateTime.convertArray(this.options.highlightedDays, this.options.highlightedDaysFormat);
    }
    this.render();
    if (this.options.inlineMode) {
        this.show();
    }
    this.updateInput();
};
litepicker_1.Litepicker.prototype.clearSelection = function () {
    this.options.startDate = null;
    this.options.endDate = null;
    this.datePicked.length = 0;
    this.updateInput();
    if (this.isShowning()) {
        this.render();
    }
};
litepicker_1.Litepicker.prototype.destroy = function () {
    if (this.picker && this.picker.parentNode) {
        this.picker.parentNode.removeChild(this.picker);
        this.picker = null;
    }
    if (this.backdrop && this.backdrop.parentNode) {
        this.backdrop.parentNode.removeChild(this.backdrop);
    }
};
