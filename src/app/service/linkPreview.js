System.register(['@angular/router', '@angular/http', '@angular/core', 'rxjs/add/operator/map', '../conf/app-settings', "../service/linkView", '../beans/linkBean'], function(exports_1, context_1) {
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
    var router_1, http_1, core_1, app_settings_1, linkView_1, linkBean_1;
    var LinkPreview;
    return {
        setters:[
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (_1) {},
            function (app_settings_1_1) {
                app_settings_1 = app_settings_1_1;
            },
            function (linkView_1_1) {
                linkView_1 = linkView_1_1;
            },
            function (linkBean_1_1) {
                linkBean_1 = linkBean_1_1;
            }],
        execute: function() {
            LinkPreview = (function () {
                /* constructor  */
                function LinkPreview(router, http, linkView, changeDetector) {
                    this.router = router;
                    this.http = http;
                    this.linkView = linkView;
                    this.changeDetector = changeDetector;
                    this.linkToPreview = new linkBean_1.LinkBean();
                    this.returnerLink = new linkBean_1.LinkBean();
                }
                LinkPreview.prototype.reset = function () {
                    this.returnerLink.initialise();
                };
                LinkPreview.prototype.linkAPI = function (publishText, oldLink, linksArray) {
                    var _this = this;
                    //var linkURL = this.publishText;
                    //var linkURL = this.publishText.match(/\b(http|https)?(:\/\/)?(\S*)\.(\w{2,4})\b/ig);
                    {
                        var source = (publishText || '').toString();
                        var myArray = this.linkView.getListLinks(publishText);
                        if (!myArray.length) {
                            return 1;
                        }
                        var linkURL = myArray[0];
                        console.log(linkURL);
                        if (linkURL == this.linkToPreview.url) {
                            return 1;
                        }
                        this.linkToPreview = oldLink;
                        this.http.get(app_settings_1.AppSettings.SERVER_URL + 'getOpenGraphData?url=' + linkURL, app_settings_1.AppSettings.OPTIONS)
                            .map(function (res) { return res.json(); })
                            .subscribe(function (response) {
                            if (response.results.success) {
                                _this.linkToPreview.url = linkURL.substring(0, linkURL.length - 6);
                                _this.linkToPreview.title = response.results.data.ogTitle;
                                _this.linkToPreview.description = response.results.data.ogDescription;
                                if (response.results.data.ogImage) {
                                    _this.linkToPreview.image = response.results.data.ogImage.url;
                                    _this.linkToPreview.imageWidth = response.results.data.ogImage.width;
                                    _this.linkToPreview.imageHeight = response.results.data.ogImage.height;
                                }
                                else {
                                    _this.linkToPreview.image = null;
                                    _this.linkToPreview.imageWidth = 0;
                                    _this.linkToPreview.imageHeight = 0;
                                }
                                _this.linkToPreview.isSet = true;
                                //console.log(response.results.data);
                                console.log(JSON.stringify(_this.linkToPreview));
                                _this.returnerLink = _this.linkToPreview;
                                linksArray.push(_this.linkToPreview);
                                console.error(response);
                                _this.changeDetector.markForCheck();
                            }
                            else {
                                console.error("error in link API;");
                            }
                        }, function (err) {
                            //error
                            console.error("error in link API;");
                        }, function () {
                            //final
                        });
                    }
                };
                LinkPreview.prototype.change = function (variabke) {
                    variabke = "string";
                };
                LinkPreview = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [router_1.Router, http_1.Http, linkView_1.LinkView, core_1.ChangeDetectorRef])
                ], LinkPreview);
                return LinkPreview;
            }());
            exports_1("LinkPreview", LinkPreview);
        }
    }
});
//# sourceMappingURL=linkPreview.js.map