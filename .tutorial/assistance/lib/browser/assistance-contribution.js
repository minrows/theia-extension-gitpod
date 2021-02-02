"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markingElements = exports.AssistanceCommand = void 0;
var inversify_1 = require("inversify");
var $ = require("jquery");
var file_service_1 = require("@theia/filesystem/lib/browser/file-service");
var uri_1 = require("@theia/core/lib/common/uri");
var browser_1 = require("@theia/workspace/lib/browser");
exports.AssistanceCommand = {
    id: 'Assistance.command',
    label: "assistance"
};
var markingElements = /** @class */ (function () {
    function markingElements(fileService, workspaceService) {
        var _this = this;
        this.fileService = fileService;
        this.workspaceService = workspaceService;
        this.idList = [];
        this.currentHint = -1;
        this.findNewCurrent = function () {
            var _loop_1 = function (i) {
                var tmp = _this.idList[i];
                if ($(_this.asId(_this.idList[i]) + ":visible").length ||
                    ($("div" + ":visible")
                        .filter(function () { return $(this).children().length === 0 && $(this).text() === tmp; })
                        .parent().length > 0)) {
                    _this.currentHint = i;
                    _this.currentLeftPosition();
                    _this.currentTopPosition();
                }
            };
            for (var i = 0; i < _this.idList.length; i++) {
                _loop_1(i);
            }
        };
        this.asId = function (id) {
            return "#" + $.escapeSelector(id);
        };
        this.asContent = function (content) {
            return 'div:contains(' + content + ')';
        };
        this.markCurrent = function () {
            $('body').append('<span id="pointer" style=\"color:yellow;\" >&#8592;</span>');
            $("#pointer").css({ "left": _this.currentLeftPosition(), "top": _this.currentTopPosition(), "position": "absolute", "z-index": "1000" });
        };
        this.currentLeftPosition = function () {
            if ($(_this.asId(_this.idList[_this.currentHint])).length) {
                _this.leftPostion = $(_this.asId(_this.idList[_this.currentHint]))[0].getBoundingClientRect().right + $(window)['scrollLeft']();
            }
            else {
                var tmp_1 = _this.idList[_this.currentHint];
                _this.leftPostion = $("div" + ":visible")
                    .filter(function () { return $(this).children().length === 0 && $(this).text() === tmp_1; })
                    .parent()[0].getBoundingClientRect().right + $(window)['scrollLeft']();
            }
            return _this.leftPostion;
        };
        this.currentTopPosition = function () {
            if ($(_this.asId(_this.idList[_this.currentHint])).length) {
                _this.topPosition = $(_this.asId(_this.idList[_this.currentHint]))[0].getBoundingClientRect().top + $(window)['scrollTop']();
            }
            else {
                var tmp_2 = _this.idList[_this.currentHint];
                _this.topPosition = $("div" + ":visible")
                    .filter(function () { return $(this).children().length === 0 && $(this).text() === tmp_2; })
                    .parent()[0].getBoundingClientRect().top + $(window)['scrollTop']();
            }
            return _this.topPosition;
        };
        this.finishAssistance = function () {
            if (_this.observer != undefined) {
                _this.observer.disconnect();
                _this.observer = null;
            }
            MutationObserver = window.MutationObserver;
            var observer = new MutationObserver(function () {
                var oldHint = _this.currentHint;
                var oldTop = _this.topPosition;
                var oldLeft = _this.leftPostion;
                _this.findNewCurrent();
                if (oldHint == _this.currentHint) {
                    if (oldTop != _this.topPosition || oldLeft != _this.leftPostion) {
                        _this.markCurrent();
                    }
                }
                else {
                    _this.cleanUp();
                    observer.disconnect();
                }
            });
            observer.observe(document, {
                subtree: true, childList: true
            });
            setTimeout(function () {
                _this.cleanUp();
            }, 5000);
        };
        this.cleanUp = function () {
            $("#pointer").remove();
            _this.currentHint = -1;
            _this.topPosition = -1;
            _this.leftPostion = -1;
        };
        this.prepareNextStep = function () {
            if (_this.observer != undefined) {
                _this.observer.disconnect();
                _this.observer = null;
            }
            MutationObserver = window.MutationObserver;
            _this.observer = new MutationObserver(function () {
                _this.observe();
            });
            _this.observer.observe(document, {
                subtree: true, childList: true
            });
        };
        this.observe = function () {
            var oldHint = _this.currentHint;
            var oldTop = _this.topPosition;
            var oldLeft = _this.leftPostion;
            _this.findNewCurrent();
            if (oldHint != _this.currentHint || oldTop != _this.topPosition || oldLeft != _this.leftPostion) {
                _this.markCurrent();
                if (_this.currentHint + 1 == _this.idList.length) {
                    _this.finishAssistance();
                }
                else {
                    _this.prepareNextStep();
                }
            }
        };
    }
    markingElements.prototype.initialize = function () {
        var _this = this;
        this.workspaceService.recentWorkspaces().then(function (res) {
            var uri = new uri_1.default(res[0] + "/.tutorial/assistance.json");
            _this.fileService.onDidFilesChange(function (event) {
                if (event.contains(uri)) {
                    _this.fileService.read(uri).then(function (fileText) {
                        _this.idList = JSON.parse(fileText.value);
                        _this.observe();
                    });
                }
            });
            _this.fileService.watch(uri);
        });
    };
    var _a, _b;
    markingElements = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(file_service_1.FileService)),
        __param(1, inversify_1.inject(browser_1.WorkspaceService)),
        __metadata("design:paramtypes", [typeof (_a = typeof file_service_1.FileService !== "undefined" && file_service_1.FileService) === "function" ? _a : Object, typeof (_b = typeof browser_1.WorkspaceService !== "undefined" && browser_1.WorkspaceService) === "function" ? _b : Object])
    ], markingElements);
    return markingElements;
}());
exports.markingElements = markingElements;
//# sourceMappingURL=assistance-contribution.js.map