"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.Litepicker = void 0;
var calendar_1 = require("./calendar");
var datetime_1 = require("./datetime");
var style = __importStar(require("./scss/main.scss"));
var utils_1 = require("./utils");
var Litepicker = /** @class */ (function (_super) {
    __extends(Litepicker, _super);
    function Litepicker(options) {
        var _this = _super.call(this) || this;
        _this.options = __assign(__assign({}, _this.options), options.element.dataset);
        Object.keys(_this.options).forEach(function (opt) {
            if (_this.options[opt] === 'true' || _this.options[opt] === 'false') {
                _this.options[opt] = _this.options[opt] === 'true';
            }
        });
        var dropdowns = __assign(__assign({}, _this.options.dropdowns), options.dropdowns);
        var buttonText = __assign(__assign({}, _this.options.buttonText), options.buttonText);
        var tooltipText = __assign(__assign({}, _this.options.tooltipText), options.tooltipText);
        _this.options = __assign(__assign({}, _this.options), options);
        _this.options.dropdowns = __assign({}, dropdowns);
        _this.options.buttonText = __assign({}, buttonText);
        _this.options.tooltipText = __assign({}, tooltipText);
        if (!_this.options.elementEnd) {
            _this.options.allowRepick = false;
        }
        if (_this.options.lockDays.length) {
            _this.options.lockDays = datetime_1.DateTime.convertArray(_this.options.lockDays, _this.options.lockDaysFormat);
        }
        if (_this.options.bookedDays.length) {
            _this.options.bookedDays = datetime_1.DateTime.convertArray(_this.options.bookedDays, _this.options.bookedDaysFormat);
        }
        if (_this.options.highlightedDays.length) {
            _this.options.highlightedDays = datetime_1.DateTime.convertArray(_this.options.highlightedDays, _this.options.highlightedDaysFormat);
        }
        if (_this.options.hotelMode && !('bookedDaysInclusivity' in options)) {
            _this.options.bookedDaysInclusivity = '[)';
        }
        if (_this.options.hotelMode && !('disallowBookedDaysInRange' in options)) {
            _this.options.disallowBookedDaysInRange = true;
        }
        if (_this.options.hotelMode && !('selectForward' in options)) {
            _this.options.selectForward = true;
        }
        var _a = _this.parseInput(), startValue = _a[0], endValue = _a[1];
        if (_this.options.startDate) {
            if (_this.options.singleMode || _this.options.endDate) {
                startValue = new datetime_1.DateTime(_this.options.startDate, _this.options.format, _this.options.lang);
            }
        }
        if (startValue && _this.options.endDate) {
            endValue = new datetime_1.DateTime(_this.options.endDate, _this.options.format, _this.options.lang);
        }
        if (startValue instanceof datetime_1.DateTime && !isNaN(startValue.getTime())) {
            _this.options.startDate = startValue;
        }
        if (_this.options.startDate && endValue instanceof datetime_1.DateTime && !isNaN(endValue.getTime())) {
            _this.options.endDate = endValue;
        }
        if (_this.options.singleMode && !(_this.options.startDate instanceof datetime_1.DateTime)) {
            _this.options.startDate = null;
        }
        if (!_this.options.singleMode
            && (!(_this.options.startDate instanceof datetime_1.DateTime)
                || !(_this.options.endDate instanceof datetime_1.DateTime))) {
            _this.options.startDate = null;
            _this.options.endDate = null;
        }
        for (var idx = 0; idx < _this.options.numberOfMonths; idx += 1) {
            var date = _this.options.startDate instanceof datetime_1.DateTime
                ? _this.options.startDate.clone()
                : new datetime_1.DateTime();
            date.setDate(1);
            date.setMonth(date.getMonth() + idx);
            _this.calendars[idx] = date;
        }
        if (_this.options.showTooltip) {
            if (_this.options.tooltipPluralSelector) {
                _this.pluralSelector = _this.options.tooltipPluralSelector;
            }
            else {
                try {
                    var pluralRules = new Intl.PluralRules(_this.options.lang);
                    _this.pluralSelector = pluralRules.select.bind(pluralRules);
                }
                catch (_b) {
                    // fallback
                    _this.pluralSelector = function (arg0) {
                        if (Math.abs(arg0) === 0)
                            return 'one';
                        return 'other';
                    };
                }
            }
        }
        _this.loadPolyfillsForIE11();
        _this.onInit();
        return _this;
    }
    Litepicker.prototype.onInit = function () {
        var _this = this;
        document.addEventListener('click', function (e) { return _this.onClick(e); }, true);
        this.picker = document.createElement('div');
        this.picker.className = style.litepicker;
        this.picker.style.display = 'none';
        this.picker.addEventListener('mouseenter', function (e) { return _this.onMouseEnter(e); }, true);
        this.picker.addEventListener('mouseleave', function (e) { return _this.onMouseLeave(e); }, false);
        if (this.options.autoRefresh) {
            if (this.options.element instanceof HTMLElement) {
                this.options.element.addEventListener('keyup', function (e) { return _this.onInput(e); }, true);
            }
            if (this.options.elementEnd instanceof HTMLElement) {
                this.options.elementEnd.addEventListener('keyup', function (e) { return _this.onInput(e); }, true);
            }
        }
        else {
            if (this.options.element instanceof HTMLElement) {
                this.options.element.addEventListener('change', function (e) { return _this.onInput(e); }, true);
            }
            if (this.options.elementEnd instanceof HTMLElement) {
                this.options.elementEnd.addEventListener('change', function (e) { return _this.onInput(e); }, true);
            }
        }
        if (this.options.moduleNavKeyboard) {
            // tslint:disable-next-line: no-string-literal
            if (typeof this['enableModuleNavKeyboard'] === 'function') {
                // tslint:disable-next-line: no-string-literal
                this['enableModuleNavKeyboard'].call(this, this);
            }
            else {
                throw new Error('moduleNavKeyboard is on but library does not included. See https://github.com/wakirin/litepicker-module-navkeyboard.');
            }
        }
        this.render();
        if (this.options.parentEl) {
            if (this.options.parentEl instanceof HTMLElement) {
                this.options.parentEl.appendChild(this.picker);
            }
            else {
                document.querySelector(this.options.parentEl).appendChild(this.picker);
            }
        }
        else {
            if (this.options.inlineMode) {
                if (this.options.element instanceof HTMLInputElement) {
                    this.options.element.parentNode.appendChild(this.picker);
                }
                else {
                    this.options.element.appendChild(this.picker);
                }
            }
            else {
                document.body.appendChild(this.picker);
            }
        }
        if (this.options.mobileFriendly) {
            this.backdrop = document.createElement('div');
            this.backdrop.className = style.litepickerBackdrop;
            this.backdrop.addEventListener('click', this.hide());
            if (this.options.element && this.options.element.parentNode) {
                this.options.element.parentNode.appendChild(this.backdrop);
            }
            window.addEventListener('orientationchange', function (evt) {
                // replace to screen.orientation.angle when Safari will support
                // https://caniuse.com/#feat=screen-orientation
                // get correct viewport after changing orientation
                // https://stackoverflow.com/a/49383279/2873909
                var afterOrientationChange = function () {
                    if (utils_1.isMobile() && _this.isShowning()) {
                        switch (utils_1.getOrientation()) {
                            case 'landscape':
                                _this.options.numberOfMonths = 2;
                                _this.options.numberOfColumns = 2;
                                break;
                            // portrait
                            default:
                                _this.options.numberOfMonths = 1;
                                _this.options.numberOfColumns = 1;
                                break;
                        }
                        _this.render();
                        if (!_this.options.inlineMode) {
                            var pickerBCR = _this.picker.getBoundingClientRect();
                            _this.picker.style.top = "calc(50% - " + (pickerBCR.height / 2) + "px)";
                            _this.picker.style.left = "calc(50% - " + (pickerBCR.width / 2) + "px)";
                        }
                    }
                    window.removeEventListener('resize', afterOrientationChange);
                };
                window.addEventListener('resize', afterOrientationChange);
            });
        }
        if (this.options.inlineMode) {
            this.show();
            if (this.options.mobileFriendly && utils_1.isMobile()) {
                // force trigger orientationchange
                window.dispatchEvent(new Event('orientationchange'));
                window.dispatchEvent(new Event('resize'));
            }
        }
        this.updateInput();
    };
    Litepicker.prototype.parseInput = function () {
        var delimiter = this.options.delimiter;
        var delimiterRegex = new RegExp("" + delimiter);
        var splittedValue = this.options.element instanceof HTMLInputElement
            ? this.options.element.value.split(delimiter)
            : [];
        if (this.options.elementEnd) {
            if (this.options.element instanceof HTMLInputElement
                && this.options.element.value.length
                && this.options.elementEnd instanceof HTMLInputElement
                && this.options.elementEnd.value.length) {
                return [
                    new datetime_1.DateTime(this.options.element.value, this.options.format),
                    new datetime_1.DateTime(this.options.elementEnd.value, this.options.format),
                ];
            }
        }
        else if (this.options.singleMode) {
            if (this.options.element instanceof HTMLInputElement
                && this.options.element.value.length) {
                return [
                    new datetime_1.DateTime(this.options.element.value, this.options.format),
                ];
            }
        }
        else if (this.options.element instanceof HTMLInputElement
            && delimiterRegex.test(this.options.element.value)
            && splittedValue.length
            && splittedValue.length % 2 === 0) {
            var d1 = splittedValue.slice(0, splittedValue.length / 2).join(delimiter);
            var d2 = splittedValue.slice(splittedValue.length / 2).join(delimiter);
            return [
                new datetime_1.DateTime(d1, this.options.format),
                new datetime_1.DateTime(d2, this.options.format),
            ];
        }
        return [];
    };
    Litepicker.prototype.updateInput = function () {
        if (!(this.options.element instanceof HTMLInputElement))
            return;
        if (this.options.singleMode && this.options.startDate) {
            this.options.element.value = this.options.startDate
                .format(this.options.format, this.options.lang);
        }
        else if (!this.options.singleMode && this.options.startDate && this.options.endDate) {
            var startValue = this.options.startDate
                .format(this.options.format, this.options.lang);
            var endValue = this.options.endDate
                .format(this.options.format, this.options.lang);
            if (this.options.elementEnd) {
                this.options.element.value = startValue;
                this.options.elementEnd.value = endValue;
            }
            else {
                this.options.element.value = "" + startValue + this.options.delimiter + endValue;
            }
        }
        if (!this.options.startDate && !this.options.endDate) {
            this.options.element.value = '';
            if (this.options.elementEnd) {
                this.options.elementEnd.value = '';
            }
        }
    };
    Litepicker.prototype.isSamePicker = function (el) {
        var picker = el.closest("." + style.litepicker);
        return picker === this.picker;
    };
    Litepicker.prototype.shouldShown = function (el) {
        return el === this.options.element
            || (this.options.elementEnd && el === this.options.elementEnd);
    };
    Litepicker.prototype.shouldResetDatePicked = function () {
        return this.options.singleMode || this.datePicked.length === 2;
    };
    Litepicker.prototype.shouldSwapDatePicked = function () {
        return this.datePicked.length === 2
            && this.datePicked[0].getTime() > this.datePicked[1].getTime();
    };
    Litepicker.prototype.shouldCheckLockDays = function () {
        return this.options.disallowLockDaysInRange
            && this.options.lockDays.length
            && this.datePicked.length === 2;
    };
    Litepicker.prototype.shouldCheckBookedDays = function () {
        return this.options.disallowBookedDaysInRange
            && this.options.bookedDays.length
            && this.datePicked.length === 2;
    };
    Litepicker.prototype.onClick = function (e) {
        var _this = this;
        var target = e.target;
        if (!target || !this.picker) {
            return;
        }
        // Click on element
        if (this.shouldShown(target)) {
            this.show(target);
            return;
        }
        // Click outside picker
        if (!target.closest("." + style.litepicker)) {
            this.hide();
            return;
        }
        // Click on date
        if (target.classList.contains(style.dayItem)) {
            e.preventDefault();
            if (!this.isSamePicker(target)) {
                return;
            }
            if (target.classList.contains(style.isLocked)) {
                return;
            }
            if (target.classList.contains(style.isBooked)) {
                return;
            }
            if (this.shouldResetDatePicked()) {
                this.datePicked.length = 0;
            }
            this.datePicked[this.datePicked.length] = new datetime_1.DateTime(target.dataset.time);
            if (this.shouldSwapDatePicked()) {
                var tempDate = this.datePicked[1].clone();
                this.datePicked[1] = this.datePicked[0].clone();
                this.datePicked[0] = tempDate.clone();
            }
            if (this.shouldCheckLockDays()) {
                var inclusivity_1 = this.options.lockDaysInclusivity;
                var locked = this.options.lockDays
                    .filter(function (d) {
                    if (d instanceof Array) {
                        return d[0].isBetween(_this.datePicked[0], _this.datePicked[1], inclusivity_1)
                            || d[1].isBetween(_this.datePicked[0], _this.datePicked[1], inclusivity_1);
                    }
                    return d.isBetween(_this.datePicked[0], _this.datePicked[1], inclusivity_1);
                }).length;
                if (locked) {
                    this.datePicked.length = 0;
                    if (typeof this.options.onError === 'function') {
                        this.options.onError.call(this, 'INVALID_RANGE');
                    }
                }
            }
            if (this.shouldCheckBookedDays()) {
                var inclusivity_2 = this.options.bookedDaysInclusivity;
                if (this.options.hotelMode && this.datePicked.length === 2) {
                    inclusivity_2 = '()';
                }
                var booked = this.options.bookedDays
                    .filter(function (d) {
                    if (d instanceof Array) {
                        return d[0].isBetween(_this.datePicked[0], _this.datePicked[1], inclusivity_2)
                            || d[1].isBetween(_this.datePicked[0], _this.datePicked[1], inclusivity_2);
                    }
                    return d.isBetween(_this.datePicked[0], _this.datePicked[1]);
                }).length;
                var anyBookedDaysAsCheckout = this.options.anyBookedDaysAsCheckout
                    && this.datePicked.length === 1;
                if (booked && !anyBookedDaysAsCheckout) {
                    this.datePicked.length = 0;
                    if (typeof this.options.onError === 'function') {
                        this.options.onError.call(this, 'INVALID_RANGE');
                    }
                }
            }
            this.render();
            if (this.options.autoApply) {
                if (this.options.singleMode && this.datePicked.length) {
                    this.setDate(this.datePicked[0]);
                    this.hide();
                }
                else if (!this.options.singleMode && this.datePicked.length === 2) {
                    this.setDateRange(this.datePicked[0], this.datePicked[1]);
                    this.hide();
                }
            }
            return;
        }
        // Click on button previous month
        if (target.classList.contains(style.buttonPreviousMonth)) {
            e.preventDefault();
            if (!this.isSamePicker(target)) {
                return;
            }
            var idx = 0;
            var numberOfMonths = !this.options.moveByOneMonth
                ? this.options.numberOfMonths
                : 1;
            if (this.options.splitView) {
                var monthItem = target.closest("." + style.monthItem);
                idx = utils_1.findNestedMonthItem(monthItem);
                numberOfMonths = 1;
            }
            this.calendars[idx].setMonth(this.calendars[idx].getMonth() - numberOfMonths);
            this.gotoDate(this.calendars[idx], idx);
            if (typeof this.options.onChangeMonth === 'function') {
                this.options.onChangeMonth.call(this, this.calendars[idx], idx);
            }
            return;
        }
        // Click on button next month
        if (target.classList.contains(style.buttonNextMonth)) {
            e.preventDefault();
            if (!this.isSamePicker(target)) {
                return;
            }
            var idx = 0;
            var numberOfMonths = !this.options.moveByOneMonth
                ? this.options.numberOfMonths
                : 1;
            if (this.options.splitView) {
                var monthItem = target.closest("." + style.monthItem);
                idx = utils_1.findNestedMonthItem(monthItem);
                numberOfMonths = 1;
            }
            this.calendars[idx].setMonth(this.calendars[idx].getMonth() + numberOfMonths);
            this.gotoDate(this.calendars[idx], idx);
            if (typeof this.options.onChangeMonth === 'function') {
                this.options.onChangeMonth.call(this, this.calendars[idx], idx);
            }
            return;
        }
        // Click on button cancel
        if (target.classList.contains(style.buttonCancel)) {
            e.preventDefault();
            if (!this.isSamePicker(target)) {
                return;
            }
            this.hide();
        }
        // Click on button apply
        if (target.classList.contains(style.buttonApply)) {
            e.preventDefault();
            if (!this.isSamePicker(target)) {
                return;
            }
            if (this.options.singleMode && this.datePicked.length) {
                this.setDate(this.datePicked[0]);
            }
            else if (!this.options.singleMode && this.datePicked.length === 2) {
                this.setDateRange(this.datePicked[0], this.datePicked[1]);
            }
            this.hide();
        }
    };
    Litepicker.prototype.showTooltip = function (element, text) {
        var tooltip = this.picker.querySelector("." + style.containerTooltip);
        tooltip.style.visibility = 'visible';
        tooltip.innerHTML = text;
        var pickerBCR = this.picker.getBoundingClientRect();
        var tooltipBCR = tooltip.getBoundingClientRect();
        var dayBCR = element.getBoundingClientRect();
        var top = dayBCR.top;
        var left = dayBCR.left;
        if (this.options.inlineMode && this.options.parentEl) {
            var parentBCR = this.picker.parentNode.getBoundingClientRect();
            top -= parentBCR.top;
            left -= parentBCR.left;
        }
        else {
            top -= pickerBCR.top;
            left -= pickerBCR.left;
        }
        top -= tooltipBCR.height;
        left -= tooltipBCR.width / 2;
        left += dayBCR.width / 2;
        tooltip.style.top = top + "px";
        tooltip.style.left = left + "px";
        if (typeof this.options.onShowTooltip === 'function') {
            this.options.onShowTooltip.call(this, tooltip, element);
        }
    };
    Litepicker.prototype.hideTooltip = function () {
        var tooltip = this.picker.querySelector("." + style.containerTooltip);
        tooltip.style.visibility = 'hidden';
    };
    Litepicker.prototype.shouldAllowMouseEnter = function (el) {
        return !this.options.singleMode
            && !el.classList.contains(style.isLocked)
            && !el.classList.contains(style.isBooked);
    };
    Litepicker.prototype.shouldAllowRepick = function () {
        return this.options.elementEnd
            && this.options.allowRepick
            && this.options.startDate
            && this.options.endDate;
    };
    Litepicker.prototype.isDayItem = function (el) {
        return el.classList.contains(style.dayItem);
    };
    Litepicker.prototype.onMouseEnter = function (event) {
        var _this = this;
        var target = event.target;
        if (!this.isDayItem(target)) {
            return;
        }
        if (typeof this.options.onDayHover === 'function') {
            this.options.onDayHover.call(this, datetime_1.DateTime.parseDateTime(target.dataset.time), target.classList.toString().split(/\s/), target);
        }
        if (this.shouldAllowMouseEnter(target)) {
            if (this.shouldAllowRepick()) {
                if (this.triggerElement === this.options.element) {
                    this.datePicked[0] = this.options.endDate.clone();
                }
                else if (this.triggerElement === this.options.elementEnd) {
                    this.datePicked[0] = this.options.startDate.clone();
                }
            }
            if (this.datePicked.length !== 1) {
                return;
            }
            var startDateElement = this.picker
                .querySelector("." + style.dayItem + "[data-time=\"" + this.datePicked[0].getTime() + "\"]");
            var date1_1 = this.datePicked[0].clone();
            var date2_1 = new datetime_1.DateTime(target.dataset.time);
            var isFlipped = false;
            if (date1_1.getTime() > date2_1.getTime()) {
                var tempDate = date1_1.clone();
                date1_1 = date2_1.clone();
                date2_1 = tempDate.clone();
                isFlipped = true;
            }
            var allDayItems = Array.prototype.slice.call(this.picker.querySelectorAll("." + style.dayItem));
            allDayItems.forEach(function (d) {
                var date = new datetime_1.DateTime(d.dataset.time);
                var day = _this.renderDay(date);
                if (date.isBetween(date1_1, date2_1)) {
                    day.classList.add(style.isInRange);
                }
                d.className = day.className;
            });
            target.classList.add(style.isEndDate);
            if (isFlipped) {
                if (startDateElement) {
                    startDateElement.classList.add(style.isFlipped);
                }
                target.classList.add(style.isFlipped);
            }
            else {
                if (startDateElement) {
                    startDateElement.classList.remove(style.isFlipped);
                }
                target.classList.remove(style.isFlipped);
            }
            if (this.options.showTooltip) {
                var days = date2_1.diff(date1_1, 'day');
                if (!this.options.hotelMode) {
                    days += 1;
                }
                if (days > 0) {
                    var pluralName = this.pluralSelector(days);
                    var pluralText = this.options.tooltipText[pluralName]
                        ? this.options.tooltipText[pluralName]
                        : "[" + pluralName + "]";
                    var text = days + " " + pluralText;
                    this.showTooltip(target, text);
                }
                else {
                    this.hideTooltip();
                }
            }
        }
    };
    Litepicker.prototype.onMouseLeave = function (event) {
        var target = event.target;
        if (!this.options.allowRepick
            || (this.options.allowRepick && !this.options.startDate && !this.options.endDate)) {
            return;
        }
        this.datePicked.length = 0;
        this.render();
    };
    Litepicker.prototype.onInput = function (event) {
        var _a = this.parseInput(), startValue = _a[0], endValue = _a[1];
        var isValid = false;
        var dateFormat = this.options.format;
        if (this.options.elementEnd) {
            isValid = startValue instanceof datetime_1.DateTime
                && endValue instanceof datetime_1.DateTime
                && startValue.format(dateFormat) === this.options.element.value
                && endValue.format(dateFormat) === this.options.elementEnd.value;
        }
        else if (this.options.singleMode) {
            isValid = startValue instanceof datetime_1.DateTime
                && startValue.format(dateFormat) === this.options.element.value;
        }
        else {
            isValid = startValue instanceof datetime_1.DateTime
                && endValue instanceof datetime_1.DateTime
                // tslint:disable-next-line: max-line-length
                && "" + startValue.format(dateFormat) + this.options.delimiter + endValue.format(dateFormat) === this.options.element.value;
        }
        if (isValid) {
            if (endValue && startValue.getTime() > endValue.getTime()) {
                var tempDate = startValue.clone();
                startValue = endValue.clone();
                endValue = tempDate.clone();
            }
            this.options.startDate = new datetime_1.DateTime(startValue, this.options.format, this.options.lang);
            if (endValue) {
                this.options.endDate = new datetime_1.DateTime(endValue, this.options.format, this.options.lang);
            }
            this.updateInput();
            this.render();
            var dateGo = startValue.clone();
            var monthIdx = 0;
            var isStart = true;
            if (this.options.elementEnd) {
                isStart = startValue.format(dateFormat) === event.target.value;
            }
            else {
                isStart = event.target.value.startsWith(startValue.format(dateFormat));
            }
            if (!isStart) {
                dateGo = endValue.clone();
                monthIdx = this.options.numberOfMonths - 1;
            }
            if (typeof this.options.onSelect === 'function') {
                this.options.onSelect.call(this, this.getStartDate(), this.getEndDate());
            }
            this.gotoDate(dateGo, monthIdx);
        }
    };
    Litepicker.prototype.isShowning = function () {
        return this.picker && this.picker.style.display !== 'none';
    };
    Litepicker.prototype.loadPolyfillsForIE11 = function () {
        // Support for Object.entries(...)
        // copied from
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
        if (!Object.entries) {
            Object.entries = function (obj) {
                var ownProps = Object.keys(obj);
                var i = ownProps.length;
                var resArray = new Array(i); // preallocate the Array
                while (i) {
                    i = i - 1;
                    resArray[i] = [ownProps[i], obj[ownProps[i]]];
                }
                return resArray;
            };
        }
        // Support for Element.closest(...)
        // copied from
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
        if (!Element.prototype.matches) {
            // tslint:disable-next-line: no-string-literal
            Element.prototype.matches = Element.prototype['msMatchesSelector'] ||
                Element.prototype.webkitMatchesSelector;
        }
        if (!Element.prototype.closest) {
            Element.prototype.closest = function (s) {
                // tslint:disable-next-line: no-this-assignment
                var el = this;
                do {
                    if (el.matches(s))
                        return el;
                    el = el.parentElement || el.parentNode;
                } while (el !== null && el.nodeType === 1);
                return null;
            };
        }
    };
    return Litepicker;
}(calendar_1.Calendar));
exports.Litepicker = Litepicker;
