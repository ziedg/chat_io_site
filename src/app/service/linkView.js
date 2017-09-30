System.register(['@angular/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var LinkView;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            LinkView = (function () {
                /* constructor  */
                function LinkView() {
                    this.listLinks = new Array();
                    this.listLinks = [];
                    function validateYouTubeUrl() {
                        //  var url = $('#youTubeUrl').val();
                        var url = "";
                        if (url != undefined || url != '') {
                            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
                            var match = url.match(regExp);
                            if (match && match[2].length == 11) {
                            }
                            else {
                            }
                        }
                    }
                }
                LinkView.prototype.isALink = function (link) {
                    var myRegExp = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?&nbsp?/i;
                    return myRegExp.test(link);
                };
                LinkView.prototype.getListLinks = function (text) {
                    this.listLinks = [];
                    var textSpliced = text.split(/ |\n+/);
                    for (var i = 0; i < textSpliced.length; i++) {
                        if (this.isALink(textSpliced[i])) {
                            this.listLinks.push(textSpliced[i]);
                        }
                    }
                    return this.listLinks;
                };
                LinkView.prototype.transformATextHaveALink = function (text) {
                    if (!this.getListLinks(text).length) {
                        return text;
                    }
                    var newText = "";
                    var textSplicedInLine = text.split("\n");
                    for (var i = 0; i < textSplicedInLine.length; i++) {
                        var textSplicedInOneLine = textSplicedInLine[i].split(" ");
                        for (var j = 0; j < textSplicedInOneLine.length; j++) {
                            if (this.isALink(textSplicedInOneLine[j])) {
                                newText = newText + ' <a href="' + textSplicedInOneLine[j] + '">' + textSplicedInOneLine[j] + '</a>';
                            }
                            else {
                                newText = newText + " " + textSplicedInOneLine[j];
                            }
                        }
                        if (i == 0 || (i == textSplicedInLine.length - 1 && (textSplicedInLine[i] == "" || textSplicedInLine[i] == " " || textSplicedInLine[i] == "<br>"))) {
                            newText = newText;
                        }
                        else {
                            newText = " <br> " + newText;
                        }
                    }
                    return newText;
                };
                LinkView = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], LinkView);
                return LinkView;
            }());
            exports_1("LinkView", LinkView);
        }
    }
});
//# sourceMappingURL=linkView.js.map