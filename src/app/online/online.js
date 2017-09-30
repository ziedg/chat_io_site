System.register(['@angular/core', '@angular/http', '@angular/router', 'rxjs/add/operator/map', '../conf/app-settings', '../service/loginService', '../beans/user', "@angular/platform-browser"], function(exports_1, context_1) {
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
    var core_1, http_1, router_1, router_2, app_settings_1, loginService_1, user_1, platform_browser_1;
    var Online;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
                router_2 = router_1_1;
            },
            function (_1) {},
            function (app_settings_1_1) {
                app_settings_1 = app_settings_1_1;
            },
            function (loginService_1_1) {
                loginService_1 = loginService_1_1;
            },
            function (user_1_1) {
                user_1 = user_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            }],
        execute: function() {
            Online = (function () {
                function Online(title, route, http, router, loginService, changeDetector) {
                    var _this = this;
                    this.title = title;
                    this.route = route;
                    this.http = http;
                    this.router = router;
                    this.loginService = loginService;
                    this.changeDetector = changeDetector;
                    this.publicationBeanList = [];
                    this.user = new user_1.User();
                    this.postDisplayed = new user_1.User();
                    this.wrongPost = false;
                    this.changeDetector.markForCheck();
                    this.user = this.loginService.getUser();
                    this.router.events.subscribe(function (route) {
                        if (_this.route.snapshot.params['id'] != _this.lastRouterPostId) {
                            _this.lastRouterPostId = _this.route.snapshot.params['id'];
                            _this.postId = _this.route.snapshot.params['id'];
                            _this.changeDetector.markForCheck();
                            _this.getPost(_this.postId);
                        }
                    });
                }
                Online.prototype.ngOnInit = function () {
                    this.getPost(this.postId);
                    this.changeDetector.markForCheck();
                };
                Online.prototype.getPost = function (postId) {
                    var _this = this;
                    this.http.get(app_settings_1.AppSettings.SERVER_URL + 'getPublicationById/' + postId + '?profileID=' + this.user._id, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                        if (response.publication) {
                            if (response.publication._id == postId) {
                                _this.publicationBeanList = [];
                                var element = response.publication;
                                element.displayed = true;
                                if (element.isShared == "true") {
                                    element.isShared = true;
                                }
                                else {
                                    element.isShared = false;
                                }
                                if (element.isLiked == "true")
                                    element.isLiked = true;
                                else
                                    element.isLiked = false;
                                if (element.isDisliked == "true")
                                    element.isDisliked = true;
                                else
                                    element.isDisliked = false;
                                for (var j = 0; j < element.comments.length; j++) {
                                    if (element.comments[j].isLiked == "true")
                                        element.comments[j].isLiked = true;
                                    else
                                        element.comments[j].isLiked = false;
                                    if (element.comments[j].isDisliked == "true")
                                        element.comments[j].isDisliked = true;
                                    else
                                        element.comments[j].isDisliked = false;
                                    if (j == element.comments.length) {
                                        _this.publicationBeanList.push(element);
                                    }
                                }
                                _this.publicationBeanList.push(element);
                                _this.wrongPost = false;
                                var pubTitle = "Speegar";
                                if (response.publication.publTitle && response.publication.publTitle != "null")
                                    pubTitle = response.publication.publTitle;
                                else if (response.publication.publText && response.publication.publText != "null")
                                    pubTitle = response.publication.publText.substr(0, 15);
                                else
                                    pubTitle = "Speegar";
                                jQuery("meta[property='og:title']").remove();
                                jQuery('head').append('<meta property="og:title" content="' + pubTitle + '" />');
                                if (response.publication.publText && response.publication.publText != "null") {
                                    jQuery("meta[property='og:description']").remove();
                                    //jQuery('head').append( '<meta property="og:description" content="'+response.publication.publText+'" />' );
                                    jQuery('head').append('<meta property="og:description" content="description online" />');
                                }
                                _this.wrongPost = false;
                                jQuery("meta[property='og:title']").remove();
                                if (element.publPictureLink) {
                                    jQuery("meta[property='og:image']").remove();
                                    jQuery('head').append('<meta property="og:image" content="http://91.121.69.130/images/' + element.publPictureLink + '"/>');
                                    var tmpImg = new Image();
                                    tmpImg.src = "http://91.121.69.130/images/" + element.publPictureLink;
                                    jQuery(tmpImg).on('load', function () {
                                        jQuery("meta[property='og:image:width']").remove();
                                        jQuery("meta[property='og:image:height']").remove();
                                        jQuery('head').append('<meta property="og:image:width" content="' + tmpImg.width + '" />');
                                        jQuery('head').append('<meta property="og:image:height" content="' + tmpImg.height + '" />');
                                    });
                                }
                                jQuery("meta[property='og:url']").remove();
                                jQuery('head').append('<meta property="og:url" content="' + app_settings_1.AppSettings.SITE_URL + 'main/post/' + element._id + '" />');
                                if (pubTitle == "Speegar")
                                    _this.title.setTitle(pubTitle);
                                else
                                    _this.title.setTitle(pubTitle + " - Speegar");
                                _this.changeDetector.markForCheck();
                            }
                            else {
                                _this.wrongPost = true;
                                _this.changeDetector.markForCheck();
                            }
                        }
                        else {
                            _this.wrongPost = true;
                            _this.changeDetector.markForCheck();
                        }
                    }, function (err) {
                        _this.wrongPost = true;
                    }, function () {
                        _this.changeDetector.markForCheck();
                    });
                };
                Online = __decorate([
                    core_1.Component({
                        selector: 'online',
                        templateUrl: './src/client/app/online/online.html',
                        inputs: ['postId']
                    }),
                    __metadata('design:paramtypes', [platform_browser_1.Title, router_2.ActivatedRoute, http_1.Http, router_1.Router, loginService_1.LoginService, core_1.ChangeDetectorRef])
                ], Online);
                return Online;
            }());
            exports_1("Online", Online);
        }
    }
});
//# sourceMappingURL=online.js.map
