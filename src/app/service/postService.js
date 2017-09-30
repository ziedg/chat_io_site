System.register(['@angular/core', '@angular/http', '@angular/router', 'rxjs/add/operator/map', '../conf/app-settings', '../service/loginService', "../service/linkView", '../beans/user'], function(exports_1, context_1) {
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
    var core_1, core_2, http_1, router_1, app_settings_1, loginService_1, linkView_1, user_1;
    var PostService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
                core_2 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (_1) {},
            function (app_settings_1_1) {
                app_settings_1 = app_settings_1_1;
            },
            function (loginService_1_1) {
                loginService_1 = loginService_1_1;
            },
            function (linkView_1_1) {
                linkView_1 = linkView_1_1;
            },
            function (user_1_1) {
                user_1 = user_1_1;
            }],
        execute: function() {
            /* beans */
            PostService = (function () {
                /* constructor  */
                function PostService(linkView, http, router, loginService, changeDetector) {
                    this.linkView = linkView;
                    this.http = http;
                    this.router = router;
                    this.loginService = loginService;
                    this.changeDetector = changeDetector;
                    this.finPosts = false;
                    this.publicationBeanList = [];
                    this.user = new user_1.User();
                    this.lastPostId = "null";
                    this.isLock = false;
                    this.showErreurConnexion = false;
                    this.showLoading = false;
                    this.errorMsg = "";
                    this.user = this.loginService.getUser();
                    window.scrollTo(0, 0);
                    this.publicationBeanList = [];
                }
                PostService.prototype.putIntoList = function (response) {
                    this.isLock = true;
                    var element;
                    for (var i = 0; i < response.length; i++) {
                        element = response[i];
                        element.displayed = true;
                        if (response[i].isShared == "true") {
                            element.isShared = true;
                        }
                        else {
                            element.isShared = false;
                        }
                        if (response[i].isLiked == "true")
                            element.isLiked = true;
                        else
                            element.isLiked = false;
                        if (response[i].isDisliked == "true")
                            element.isDisliked = true;
                        else
                            element.isDisliked = false;
                        for (var j = 0; j < response[i].comments.length; j++) {
                            if (response[i].comments[j].isLiked == "true")
                                element.comments[j].isLiked = true;
                            else
                                element.comments[j].isLiked = false;
                            if (response[i].comments[j].isDisliked == "true")
                                element.comments[j].isDisliked = true;
                            else
                                element.comments[j].isDisliked = false;
                            if (j == response[i].comments.length) {
                                this.publicationBeanList.push(element);
                                if (i == response.length - 1) {
                                    this.showLoading = false;
                                    this.isLock = false;
                                    this.lastPostId = response[i]._id;
                                }
                            }
                        }
                        this.publicationBeanList.push(element);
                        if (i == response.length - 1) {
                            this.showLoading = false;
                            this.isLock = false;
                            this.lastPostId = response[i]._id;
                        }
                    }
                };
                PostService.prototype.putNewPub = function (pub, isShared) {
                    var element = pub;
                    element.displayed = true;
                    if (isShared) {
                        element.isShared = true;
                    }
                    else {
                        element.isShared = false;
                    }
                    this.publicationBeanList.unshift(element);
                    this.changeDetector.markForCheck();
                };
                PostService.prototype.loadFirstPosts = function () {
                    var _this = this;
                    if (this.user) {
                        var urlAndPara = "";
                        //localStorage.getItem('typePosts') != 'recent' && localStorage.getItem('typePosts') != 'popular'
                        if (localStorage.getItem('typePosts') == 'popular') {
                            urlAndPara = app_settings_1.AppSettings.SERVER_URL + 'getPublicationPopulaireByProfileId/?profileID=' + this.user._id + '&last_publication_id=';
                        }
                        else {
                            urlAndPara = app_settings_1.AppSettings.SERVER_URL + 'getPublicationByProfileId/?profileID=' + this.user._id + '&last_publication_id=';
                        }
                        this.http.get(urlAndPara, app_settings_1.AppSettings.OPTIONS)
                            .map(function (res) { return res.json(); })
                            .subscribe(function (response) {
                            _this.putIntoList(response);
                            _this.changeDetector.markForCheck();
                            return _this.publicationBeanList;
                        }, function (err) {
                            setTimeout(function () {
                                _this.showErreurConnexion = true;
                                _this.showLoading = false;
                            }, 3000);
                        }, function () {
                            _this.isLock = false;
                            return _this.publicationBeanList;
                        });
                    }
                    return this.publicationBeanList;
                };
                //load more Posts
                PostService.prototype.loadMorePosts = function () {
                    var _this = this;
                    if (this.user) {
                        var urlAndPara = "";
                        if (localStorage.getItem('typePosts') == 'popular') {
                            urlAndPara = app_settings_1.AppSettings.SERVER_URL + 'getPublicationPopulaireByProfileId/?profileID=' + this.user._id + '&last_publication_id=' + this.lastPostId;
                        }
                        else {
                            urlAndPara = app_settings_1.AppSettings.SERVER_URL + 'getPublicationByProfileId/?profileID=' + this.user._id + '&last_publication_id=' + this.lastPostId;
                        }
                        this.http.get(urlAndPara, app_settings_1.AppSettings.OPTIONS)
                            .map(function (res) { return res.json(); })
                            .subscribe(function (response) {
                            _this.putIntoList(response);
                            _this.changeDetector.markForCheck();
                            return _this.publicationBeanList;
                        }, function (err) {
                            setTimeout(function () {
                                _this.showErreurConnexion = true;
                                _this.showLoading = false;
                            }, 3000);
                        }, function () {
                            _this.isLock = false;
                            return _this.publicationBeanList;
                        });
                        return this.publicationBeanList;
                    }
                };
                PostService.prototype.checkIsLoked = function () {
                    return this.isLock;
                };
                PostService.prototype.isFinPosts = function () {
                    return this.finPosts;
                };
                PostService.prototype.letsShowLoading = function () {
                    return this.showLoading;
                };
                PostService.prototype.letsShowErreurConnexion = function () {
                    return this.showErreurConnexion;
                };
                PostService.prototype.getPostsList = function () {
                    return this.publicationBeanList;
                };
                PostService.prototype.getLasPostId = function () {
                    return this.lastPostId;
                };
                PostService.prototype.setIsLocked = function (islocked) {
                    this.isLock = islocked;
                };
                PostService.prototype.setFinPosts = function (finPosts) {
                    this.finPosts = finPosts;
                };
                PostService.prototype.setShowLoading = function (showLoading) {
                    this.showLoading = showLoading;
                };
                PostService.prototype.setShowErrorConnexion = function (showErreurConx) {
                    this.showErreurConnexion = showErreurConx;
                };
                PostService = __decorate([
                    core_2.Injectable(), 
                    __metadata('design:paramtypes', [linkView_1.LinkView, http_1.Http, router_1.Router, loginService_1.LoginService, core_1.ChangeDetectorRef])
                ], PostService);
                return PostService;
            }());
            exports_1("PostService", PostService);
        }
    }
});
//# sourceMappingURL=postService.js.map