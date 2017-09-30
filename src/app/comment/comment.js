System.register(['@angular/core', "../beans/comment-bean", "../beans/publication-bean", "@angular/http", "../conf/app-settings", "../service/loginService", "../service/emojiService", '../service/dateService', 'rxjs/add/operator/map'], function(exports_1, context_1) {
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
    var core_1, comment_bean_1, publication_bean_1, http_1, app_settings_1, loginService_1, emojiService_1, dateService_1;
    var Comment;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (comment_bean_1_1) {
                comment_bean_1 = comment_bean_1_1;
            },
            function (publication_bean_1_1) {
                publication_bean_1 = publication_bean_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (app_settings_1_1) {
                app_settings_1 = app_settings_1_1;
            },
            function (loginService_1_1) {
                loginService_1 = loginService_1_1;
            },
            function (emojiService_1_1) {
                emojiService_1 = emojiService_1_1;
            },
            function (dateService_1_1) {
                dateService_1 = dateService_1_1;
            },
            function (_1) {}],
        execute: function() {
            Comment = (function () {
                function Comment(http, dateService, loginService, emojiService, changeDetector) {
                    this.http = http;
                    this.dateService = dateService;
                    this.loginService = loginService;
                    this.emojiService = emojiService;
                    this.changeDetector = changeDetector;
                    this.nbDisplayedCommentsChange = new core_1.EventEmitter();
                    this.commentBean = new comment_bean_1.CommentBean();
                    this.publicationBean = new publication_bean_1.PublicationBean();
                    this.listEmoji = [];
                    this.isFixedPublishDate = false;
                    loginService.actualize();
                    this.user = loginService.user;
                    this.listEmoji = emojiService.getEmojiList();
                }
                Comment.prototype.ngOnInit = function () {
                };
                Comment.prototype.addOrRemoveLike = function () {
                    if (!this.commentBean.isLiked)
                        this.addLike();
                    else
                        this.removeLike();
                };
                Comment.prototype.afficheComment = function (comment) {
                    return this.emojiService.AfficheWithEmoji(comment);
                };
                Comment.prototype.addOrRemoveDislike = function () {
                    if (!this.commentBean.isDisliked)
                        this.addDislike();
                    else
                        this.removeDislike();
                };
                Comment.prototype.addLike = function () {
                    if (this.commentBean.isDisliked)
                        this.removeDislike();
                    var body = JSON.stringify({
                        publId: this.commentBean.publId,
                        commentId: this.commentBean._id,
                        profileId: this.user._id
                    });
                    this.http.post(app_settings_1.AppSettings.SERVER_URL + 'likeComment', body, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                    }, function (err) { }, function () {
                    });
                    this.commentBean.isLiked = true;
                    this.commentBean.nbLikes++;
                };
                Comment.prototype.getCommentTime = function (publishDateString) {
                    if (this.isFixedPublishDate)
                        return this.fixedPublishDate;
                    var date = new Date();
                    var currentDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
                    var publishDate = this.dateService.convertIsoToDate(publishDateString);
                    var diffDate = this.dateService.getdiffDate(publishDate, currentDate);
                    if (diffDate.day > 28) {
                        this.fixedPublishDate = this.dateService.convertPublishDate(publishDate);
                        this.isFixedPublishDate = true;
                    }
                    else if (diffDate.day && diffDate.day == 1) {
                        this.fixedPublishDate = "hier";
                        this.isFixedPublishDate = true;
                    }
                    else if (diffDate.day > 0) {
                        this.fixedPublishDate = diffDate.day + " jours";
                        this.isFixedPublishDate = true;
                    }
                    else if ((diffDate.hour) && (diffDate.hour == 1)) {
                        this.fixedPublishDate = "1 hr";
                        this.isFixedPublishDate = true;
                    }
                    else if ((diffDate.hour) && (diffDate.hour > 0)) {
                        this.fixedPublishDate = diffDate.hour + " hrs";
                        this.isFixedPublishDate = true;
                    }
                    else if ((diffDate.min) && (diffDate.min > 1))
                        this.fixedPublishDate = diffDate.min + " mins";
                    else
                        this.fixedPublishDate = "a l’instant";
                    return this.fixedPublishDate;
                };
                Comment.prototype.removeLike = function () {
                    var body = JSON.stringify({
                        publId: this.commentBean.publId,
                        commentId: this.commentBean._id,
                        profileId: this.user._id
                    });
                    this.http.post(app_settings_1.AppSettings.SERVER_URL + 'removeLikeComment', body, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                    }, function (err) { }, function () {
                    });
                    this.commentBean.isLiked = false;
                    this.commentBean.nbLikes--;
                };
                Comment.prototype.addDislike = function () {
                    if (this.commentBean.isLiked)
                        this.removeLike();
                    var body = JSON.stringify({
                        publId: this.commentBean.publId,
                        commentId: this.commentBean._id,
                        profileId: this.user._id
                    });
                    this.http.post(app_settings_1.AppSettings.SERVER_URL + 'dislikeComment', body, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                    }, function (err) { }, function () {
                    });
                    this.commentBean.isDisliked = true;
                    this.commentBean.nbDislikes++;
                };
                Comment.prototype.removeComment = function (comment) {
                    if (this.user) {
                        if (this.userType || this.user._id == comment.profileId || this.publicationBean.profileId == this.user._id) {
                            swal({
                                cancelButtonColor: '#999',
                                title: "Êtes-vous sûr?",
                                text: "Vous ne serez pas en mesure de récupérer ce commentaire !",
                                showCancelButton: true,
                                confirmButtonColor: "#12A012",
                                confirmButtonText: "Oui, supprimez-le!",
                                allowOutsideClick: true
                            }).then(function () {
                                this.doDeleteComment(comment);
                                swal({
                                    title: "supprimé !",
                                    text: "Votre commentaire a été supprimé.",
                                    type: "success",
                                    timer: 1000,
                                    showConfirmButton: false
                                }).then(function () { }, function (dismiss) { });
                                this.changeDetector.markForCheck();
                            }.bind(this), function (dismiss) {
                                // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
                                if (dismiss === 'overlay') {
                                }
                            });
                        }
                    }
                };
                Comment.prototype.doDeleteComment = function () {
                    var _this = this;
                    this.commentBean.deleted = true;
                    this.nbDisplayedComments--;
                    this.nbDisplayedCommentsChange.emit(this.nbDisplayedComments);
                    this.changeDetector.markForCheck();
                    var body = JSON.stringify({
                        publId: this.commentBean.publId,
                        commentId: this.commentBean._id
                    });
                    this.http.post(app_settings_1.AppSettings.SERVER_URL + 'removeComment', body, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                        _this.changeDetector.markForCheck();
                    }, function (err) { }, function () {
                        _this.changeDetector.markForCheck();
                    });
                };
                Comment.prototype.removeDislike = function () {
                    var body = JSON.stringify({
                        publId: this.commentBean.publId,
                        commentId: this.commentBean._id,
                        profileId: this.user._id
                    });
                    this.http.post(app_settings_1.AppSettings.SERVER_URL + 'removeDislikeComment', body, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                    }, function (err) { }, function () {
                    });
                    this.commentBean.isDisliked = false;
                    this.commentBean.nbDislikes--;
                };
                __decorate([
                    core_1.Input(),
                    __metadata('design:type', Object)
                ], Comment.prototype, "nbDisplayedComments", void 0);
                __decorate([
                    core_1.Input(),
                    __metadata('design:type', Object)
                ], Comment.prototype, "userType", void 0);
                __decorate([
                    core_1.Output(),
                    __metadata('design:type', Object)
                ], Comment.prototype, "nbDisplayedCommentsChange", void 0);
                Comment = __decorate([
                    core_1.Component({
                        selector: 'comment',
                        inputs: ['commentBean', 'publicationBean'],
                        templateUrl: './src/client/app/comment/comment.html',
                        changeDetection: core_1.ChangeDetectionStrategy.OnPush
                    }),
                    __metadata('design:paramtypes', [http_1.Http, dateService_1.DateService, loginService_1.LoginService, emojiService_1.EmojiService, core_1.ChangeDetectorRef])
                ], Comment);
                return Comment;
            }());
            exports_1("Comment", Comment);
        }
    }
});
//# sourceMappingURL=comment.js.map
