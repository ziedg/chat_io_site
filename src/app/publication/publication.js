System.register(['@angular/core', '@angular/http', '@angular/forms', '@angular/platform-browser', '@angular/router', 'rxjs/add/operator/map', '../conf/app-settings', '../service/loginService', '../service/dateService', "../service/emojiService", "../service/linkView", "../service/postService", '../service/seo-service', '../beans/user', '../beans/linkBean'], function(exports_1, context_1) {
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
    var core_1, http_1, forms_1, platform_browser_1, router_1, app_settings_1, loginService_1, dateService_1, emojiService_1, linkView_1, postService_1, seo_service_1, user_1, linkBean_1;
    var Publication;
    function urlEncode(source) {
        source = replaceAllNew(source, ":", "%3A");
        source = replaceAllNew(source, "/", "%2F");
        source = replaceAllNew(source, "#", "%23");
        return source;
    }
    function replaceAllNew(comment, search, replacement) {
        return comment.split(search).join(replacement);
    }
    function previewFile(uploadedFile, elementId) {
        var preview = jQuery('#preview-image');
        var file = uploadedFile;
        var reader = new FileReader();
        reader.addEventListener("load", function () {
            //preview.att.src = reader.result;
            jQuery("#" + elementId).attr('src', reader.result);
            jQuery("#" + elementId).fadeIn(500);
            //console.log(reader.result);
            //test
        }, false);
        if (file) {
            reader.readAsDataURL(file);
        }
    }
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (forms_1_1) {
                forms_1 = forms_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
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
            function (dateService_1_1) {
                dateService_1 = dateService_1_1;
            },
            function (emojiService_1_1) {
                emojiService_1 = emojiService_1_1;
            },
            function (linkView_1_1) {
                linkView_1 = linkView_1_1;
            },
            function (postService_1_1) {
                postService_1 = postService_1_1;
            },
            function (seo_service_1_1) {
                seo_service_1 = seo_service_1_1;
            },
            function (user_1_1) {
                user_1 = user_1_1;
            },
            function (linkBean_1_1) {
                linkBean_1 = linkBean_1_1;
            }],
        execute: function() {
            Publication = (function () {
                function Publication(seoService, postService, linkView, emojiService, http, router, sanitizer, loginService, changeDetector, dateService) {
                    this.seoService = seoService;
                    this.postService = postService;
                    this.linkView = linkView;
                    this.emojiService = emojiService;
                    this.http = http;
                    this.router = router;
                    this.sanitizer = sanitizer;
                    this.loginService = loginService;
                    this.changeDetector = changeDetector;
                    this.dateService = dateService;
                    this.isFixedPublishDate = false;
                    this.afficheCommentsLoading = false;
                    this.afficheMoreComments = false;
                    this.signalButton = false;
                    this.listComments = [];
                    this.nbMaxAddComments = 3;
                    this.nbComments = 0;
                    this.nbDisplayedComments = 0;
                    this.user = new user_1.User();
                    this.dateDisplay = "";
                    this.listLink = [];
                    this.selectedEmojiTab = 0;
                    this.emojiOpacity = 0;
                    this.emojiToggleActive = false;
                    this.commentInputText = "";
                    this.commentText = "";
                    this.modalPub = false;
                    this.pubLink = "";
                    this.shareLink = "";
                    this.signalSubMenu = false;
                    this.linkYtb = "";
                    this.listEmoji = [];
                    this.newCommentText = "";
                    this.isVisitor = false;
                    this.likeAnimation = false;
                    this.loadingComment = false;
                    this.commentsDisplayed = false;
                    this.emojiHoverId = "";
                    this.commentTextareaId = "";
                    this.link = new linkBean_1.LinkBean();
                    loginService.actualize();
                    this.user = loginService.user;
                    if (this.loginService.isVisitor()) {
                        this.isVisitor = true;
                    }
                    this.listEmoji = emojiService.getEmojiList();
                    this.pubImgId = "imgDefault"; //+this.publicationBean._id;
                    this.formComment = new forms_1.FormGroup({
                        pubComment: new forms_1.FormControl('', forms_1.Validators.required),
                        commentText: new forms_1.FormControl('', forms_1.Validators.required)
                    });
                }
                Publication.prototype.deletePubAdmin = function () {
                    swal({
                        title: "Êtes-vous sûr?",
                        text: "Que se passe-t-il ?",
                        showCancelButton: true,
                        cancelButtonColor: '#999',
                        confirmButtonColor: "#6bac6f",
                        confirmButtonText: "Oui, supprimez-le!",
                        allowOutsideClick: true,
                        input: 'textarea',
                    }).then(function (text) {
                        if (text) {
                            this.doDeletePub(text);
                            this.closeModalPub();
                            swal({
                                title: "supprimé !",
                                text: "Votre publication a été supprimé.",
                                type: "success",
                                timer: 1000,
                                showConfirmButton: false
                            }).then(function () { }, function (dismiss) { });
                            this.changeDetector.markForCheck();
                        }
                    }.bind(this), function (dismiss) {
                        // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
                        if (dismiss === 'overlay') {
                        }
                    });
                };
                Publication.prototype.deletePub = function () {
                    swal({
                        title: "Êtes-vous sûr?",
                        text: "Vous ne serez pas en mesure de récupérer cette publication!",
                        showCancelButton: true,
                        cancelButtonColor: '#999',
                        confirmButtonColor: "#6bac6f",
                        confirmButtonText: "Oui, supprimez-le!",
                        allowOutsideClick: true,
                    }).then(function () {
                        this.doDeletePub("sU");
                        this.closeModalPub();
                        swal({
                            title: "supprimé !",
                            text: "Votre publication a été supprimé.",
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
                };
                Publication.prototype.MaskPub = function () {
                    swal({
                        title: "Êtes-vous sûr?",
                        text: "Vous pouvez masquer cette publication ? ",
                        showCancelButton: true,
                        cancelButtonColor: '#999',
                        confirmButtonColor: "#6bac6f",
                        confirmButtonText: "Oui, masquer-le!",
                        allowOutsideClick: true
                    }).then(function () {
                        this.doMaskPub();
                        this.closeModalPub();
                        swal({
                            title: "Masqué !",
                            text: "Votre publication a été masqué.",
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
                };
                Publication.prototype.doMaskPub = function () {
                    var _this = this;
                    this.changeDetector.markForCheck();
                    var body = JSON.stringify({
                        publId: this.publicationBean._id,
                        userID: this.user._id
                    });
                    this.http.post(app_settings_1.AppSettings.SERVER_URL + 'masquerPublicationAdmin', body, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                        _this.publicationBean.confidentiality = "PRIVATE";
                        console.log(response);
                        _this.changeDetector.markForCheck();
                    }, function (err) { }, function () {
                        _this.changeDetector.markForCheck();
                    });
                };
                Publication.prototype.doDeletePub = function (text) {
                    var _this = this;
                    this.publicationBean.displayed = false;
                    this.changeDetector.markForCheck();
                    var body;
                    if (text = "sU") {
                        body = JSON.stringify({
                            publId: this.publicationBean._id,
                        });
                        this.http.post(app_settings_1.AppSettings.SERVER_URL + 'removePublication', body, app_settings_1.AppSettings.OPTIONS)
                            .map(function (res) { return res.json(); })
                            .subscribe(function (response) {
                            _this.changeDetector.markForCheck();
                        }, function (err) { }, function () {
                            _this.changeDetector.markForCheck();
                        });
                    }
                    else {
                        body = JSON.stringify({
                            publId: this.publicationBean._id,
                            raisonDelete: text
                        });
                        this.http.post(app_settings_1.AppSettings.SERVER_URL + 'removePublicationAdmin', body, app_settings_1.AppSettings.OPTIONS)
                            .map(function (res) { return res.json(); })
                            .subscribe(function (response) {
                            _this.changeDetector.markForCheck();
                        }, function (err) { }, function () {
                            _this.changeDetector.markForCheck();
                        });
                    }
                };
                Publication.prototype.displayComments = function () {
                    if (this.commentsDisplayed)
                        return;
                    else {
                        this.commentsDisplayed = true;
                    }
                    if (this.publicationBean.comments.length > this.nbMaxAddComments) {
                        this.afficheMoreComments = true;
                        this.nbComments = this.nbMaxAddComments;
                        for (var i = 0; i < this.nbComments; i++)
                            this.listComments.push(this.publicationBean.comments[i]);
                    }
                    else {
                        this.nbComments = this.publicationBean.comments.length;
                        for (var i = 0; i < this.nbComments; i++)
                            this.listComments.push(this.publicationBean.comments[i]);
                    }
                };
                Publication.prototype.ngOnInit = function () {
                    this.changeDetector.markForCheck();
                    if (this.publicationBean.publExternalLink) {
                        this.linkAPI();
                    }
                    this.emojiHoverId = "emoji-hover-" + this.publicationBean._id;
                    this.pubImgId = "img" + this.publicationBean._id;
                    this.commentTextareaId = "comment-" + this.publicationBean._id;
                    this.changeDetector.markForCheck();
                    if (this.publicationBean) {
                        this.pubLink = urlEncode(app_settings_1.AppSettings.SITE_URL + "main/post/" + this.publicationBean._id);
                        this.shareLink = "https://www.facebook.com/sharer/sharer.php?u=" + this.pubLink + "&amp;src=sdkpreparse";
                        this.nbDisplayedComments = this.publicationBean.comments.length;
                        //Youtube Loading
                        if (this.publicationBean.publyoutubeLink) {
                            a = this.publicationBean.publyoutubeLink;
                            if (a.length < 5) {
                                return;
                            }
                            ;
                            try {
                                var code = a;
                                var video = "";
                                var a = code.split("?");
                                var b = a[1];
                                var c = b.split("&");
                                for (var i = 0; i < c.length; i++) {
                                    var d = c[i].split("=");
                                    if (d[0] == "v") {
                                        video = d[1];
                                        break;
                                    }
                                    ;
                                }
                                this.linkYtb = "https://www.youtube.com/embed/" + video;
                            }
                            catch (err) {
                            }
                            this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.linkYtb);
                        }
                        else {
                            this.url = this.sanitizer.bypassSecurityTrustResourceUrl('');
                        }
                        jQuery(document).click(function (e) {
                            if (jQuery(e.target).closest(".sub-menu").length === 0 && jQuery(e.target).closest(".dots").length === 0) {
                                closeSignal();
                            }
                            if (jQuery(e.target).closest(".emoji-hover").length === 0 && jQuery(e.target).closest(".toggleEmoji").length === 0) {
                                // this.emojiToggleActive = false;
                                closeEmoji();
                            }
                        });
                        jQuery(".textarea").keydown(function (e) {
                            if (e.keyCode == 13 && !e.shiftKey) {
                                e.preventDefault();
                            }
                        });
                    }
                    var publishCommentWithEnter = function () {
                        alert(this.publicationBean._id);
                    }.bind(this);
                    var loadChanges = function () {
                        this.changeDetector.markForCheck();
                    }.bind(this);
                    var closeEmoji = function () {
                        jQuery("#" + this.emojiHoverId).hide();
                        this.changeDetector.markForCheck();
                    }.bind(this);
                    var closeSignal = function () {
                        this.signalButton = false;
                        this.changeDetector.markForCheck();
                    }.bind(this);
                };
                Publication.prototype.checkEnter = function (event) {
                    console.log(event, event.keyCode, event.keyIdentifier);
                }; /*
                publishComment(text) {

                    var commentText = "";
                    if (text) {
                        commentText = text;
                    }
                    else {
                        commentText = this.commentInputText;
                    }
                    console.log(commentText);
                    commentText = this.emojiService.replaceAll(commentText, "&nbsp;", " ");
                    if (commentText) {
                        if (!commentText.length) {
                            console.error("comment vide");
                            return 0;
                        }
                    }
                    else {
                        return 0;
                    }

                    let body = JSON.stringify({
                        publId: this.publicationBean._id,
                        profileId: this.user._id,
                        commentText: commentText
                    });
                    this.http.post(AppSettings.SERVER_URL + 'addComment', body, AppSettings.OPTIONS)
                        .map((res: Response) => res.json())
                        .subscribe(
                        response => {
                            if (response.comment) {
                                if (!this.publicationBean.comments.length)
                                    this.publicationBean.comments.unshift(response.comment);

                                this.listComments.unshift(response.comment);
                                this.nbDisplayedComments++;
                                this.formComment.controls.pubComment.updateValue('');
                                this.changeDetector.markForCheck();
                                this.commentInputText = "";
                            }
                        },
                        err => { },
                        () => {

                        }
                        );
                }*/
                Publication.prototype.publishCommentV2 = function () {
                    var _this = this;
                    if (!this.commentInputText && !this.uploadedPictureComment) {
                        return;
                    }
                    this.loadingComment = true;
                    this.changeDetector.markForCheck();
                    var data = new FormData();
                    data.append('commentText', this.commentInputText);
                    data.append('profileId', this.user._id);
                    data.append('publId', this.publicationBean._id);
                    data.append('commentPicture', this.uploadedPictureComment);
                    this.changeDetector.markForCheck();
                    this.http.post(app_settings_1.AppSettings.SERVER_URL + 'addComment', data, app_settings_1.AppSettings.OPTIONS_POST)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                        _this.changeDetector.markForCheck();
                        if (response.status == "1") {
                            if (response.comment) {
                                if (!_this.publicationBean.comments.length)
                                    _this.publicationBean.comments.unshift(response.comment);
                                _this.listComments.unshift(response.comment);
                                _this.nbDisplayedComments++;
                                //this.formComment.controls.pubComment.updateValue('');
                                _this.changeDetector.markForCheck();
                                _this.commentInputText = "";
                                jQuery("#" + _this.commentTextareaId).empty();
                                jQuery("#" + _this.pubImgId).attr('src', "");
                                jQuery("#" + _this.pubImgId).hide();
                                _this.uploadedPictureComment = null;
                                _this.loadingComment = false;
                            }
                        }
                        else {
                            console.error(response);
                            _this.loadingComment = false;
                        }
                    }, function (err) { }, function () {
                    });
                };
                //uploading Photo click event
                Publication.prototype.addPhoto = function () {
                    jQuery(("." + this.pubImgId)).click();
                };
                //uploading photo or GIF
                Publication.prototype.uploadPhoto = function ($event) {
                    var inputValue = $event.target;
                    if (inputValue != null && null != inputValue.files[0]) {
                        this.uploadedPictureComment = inputValue.files[0];
                        previewFile(this.uploadedPictureComment, this.pubImgId);
                    }
                    else {
                        this.uploadedPictureComment = null;
                    }
                };
                Publication.prototype.resetCommentPicture = function () {
                    jQuery("#" + this.pubImgId).attr('src', "");
                    jQuery("#" + this.pubImgId).hide();
                    this.uploadedPictureComment = null;
                };
                Publication.prototype.sharePub = function (post) {
                    swal({
                        title: "Êtes-vous sûr?",
                        text: "voulez-vous partager cette publication ? ",
                        showCancelButton: true,
                        confirmButtonColor: "#6bac6f",
                        confirmButtonText: "oui",
                        cancelButtonText: "non",
                        cancelButtonColor: '#999',
                        allowOutsideClick: true
                    }).then(function () {
                        swal({
                            title: "paratgé !",
                            text: "Votre publication a été partagé.",
                            type: "success",
                            timer: 1000,
                            showConfirmButton: false
                        }).then(function () { }, function (dismiss) { });
                        this.doSharePub(post);
                    }.bind(this), function (dismiss) {
                        // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
                        if (dismiss === 'overlay') {
                        }
                    });
                };
                Publication.prototype.doSharePub = function (post) {
                    var _this = this;
                    var pubId;
                    if (post.isShared) {
                        pubId = post.originalPublicationId;
                    }
                    else {
                        pubId = this.publicationBean._id;
                    }
                    var body = JSON.stringify({
                        publId: pubId,
                        profileId: this.user._id
                    });
                    this.http.post(app_settings_1.AppSettings.SERVER_URL + 'sharePublication', body, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                        if (response) {
                            if (response.status) {
                                var element = response.publication;
                                _this.postService.putNewPub(element, true);
                                _this.changeDetector.markForCheck();
                            }
                        }
                    }, function (err) { }, function () {
                    });
                };
                Publication.prototype.reportPub = function (post) {
                    //alert("you wana report this post ? : "+post.publText+" with id : "+post._id);
                    swal({
                        title: "Signaler cette publication",
                        text: "Que se passe-t-il ?",
                        showCancelButton: true,
                        cancelButtonColor: '#999',
                        confirmButtonColor: "#6bac6f",
                        confirmButtonText: "confirmer",
                        input: 'textarea',
                    }).then(function (text) {
                        if (text) {
                            this.doReportPub(text);
                            swal({
                                title: "Signalé !",
                                text: "Cette publication a été Signalé.",
                                type: "success",
                                timer: 1000,
                                showConfirmButton: false
                            }).then(function () { }, function (dismiss) { });
                            this.changeDetector.markForCheck();
                        }
                    }.bind(this), function (dismiss) {
                        // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
                        if (dismiss === 'overlay') {
                        }
                    });
                    this.closeModalPub();
                };
                Publication.prototype.doReportPub = function (text) {
                    var body = JSON.stringify({
                        signalText: text,
                        publId: this.publicationBean._id,
                        profileId: this.user._id
                    });
                    this.http.post(app_settings_1.AppSettings.SERVER_URL + 'signalerPublication', body, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                        console.log(response);
                    }, function (err) { }, function () {
                    });
                };
                Publication.prototype.modifPub = function (post) {
                    alert("you wana modify this post ? : " + post.publText + " with id : " + post._id);
                    console.log(post);
                };
                Publication.prototype.loadMoreComments = function (i) {
                    var _this = this;
                    this.afficheCommentsLoading = true;
                    this.afficheMoreComments = false;
                    if (i >= this.nbMaxAddComments) {
                        this.afficheCommentsLoading = false;
                        this.afficheMoreComments = true;
                        this.changeDetector.markForCheck();
                    }
                    else if ((this.listComments.length) >= this.publicationBean.comments.length) {
                        this.afficheCommentsLoading = false;
                        this.afficheMoreComments = false;
                        this.changeDetector.markForCheck();
                    }
                    else {
                        setTimeout(function () {
                            _this.listComments.push(_this.publicationBean.comments[i + _this.nbComments]);
                            _this.changeDetector.markForCheck();
                            _this.loadMoreComments(i + 1);
                        }, 0);
                    }
                };
                Publication.prototype.activateSignal = function () {
                    this.signalButton = !this.signalButton;
                };
                Publication.prototype.getPublicationTime = function (publishDateString) {
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
                        this.fixedPublishDate = "maintenant";
                    return this.fixedPublishDate;
                };
                Publication.prototype.addOrRemoveLike = function () {
                    if (!this.isVisitor) {
                        if (!this.publicationBean.isLiked)
                            this.addLike();
                        else
                            this.removeLike();
                    }
                };
                Publication.prototype.addLike = function () {
                    if (this.publicationBean.isDisliked)
                        this.removeDislike();
                    var body = JSON.stringify({
                        publId: this.publicationBean._id,
                        profileId: this.user._id
                    });
                    this.http.post(app_settings_1.AppSettings.SERVER_URL + 'likePublication', body, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                    }, function (err) { }, function () {
                    });
                    this.publicationBean.isLiked = true;
                    this.publicationBean.nbLikes++;
                };
                Publication.prototype.removeLike = function () {
                    var body = JSON.stringify({
                        publId: this.publicationBean._id,
                        profileId: this.user._id
                    });
                    this.http.post(app_settings_1.AppSettings.SERVER_URL + 'removeLikePublication', body, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                    }, function (err) { }, function () {
                    });
                    this.publicationBean.isLiked = false;
                    this.publicationBean.nbLikes--;
                };
                Publication.prototype.addOrRemoveDislike = function () {
                    if (!this.isVisitor) {
                        if (!this.publicationBean.isDisliked)
                            this.addDislike();
                        else
                            this.removeDislike();
                    }
                };
                Publication.prototype.addDislike = function () {
                    if (this.publicationBean.isLiked)
                        this.removeLike();
                    var body = JSON.stringify({
                        publId: this.publicationBean._id,
                        profileId: this.user._id
                    });
                    this.http.post(app_settings_1.AppSettings.SERVER_URL + 'dislikePublication', body, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                    }, function (err) { }, function () {
                    });
                    this.publicationBean.isDisliked = true;
                    this.publicationBean.nbDislikes++;
                };
                Publication.prototype.removeDislike = function () {
                    var body = JSON.stringify({
                        publId: this.publicationBean._id,
                        profileId: this.user._id
                    });
                    this.http.post(app_settings_1.AppSettings.SERVER_URL + 'removeDislikePublication', body, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                    }, function (err) { }, function () {
                    });
                    this.publicationBean.isDisliked = false;
                    this.publicationBean.nbDislikes--;
                };
                Publication.prototype.toggleEmoji = function () {
                    jQuery("#" + this.emojiHoverId).toggle();
                };
                Publication.prototype.closeModalEmoji = function () {
                    jQuery("#" + this.emojiHoverId).hide();
                };
                Publication.prototype.openModalPub = function () {
                    this.modalPub = true;
                };
                Publication.prototype.closeModalPub = function () {
                    this.modalPub = false;
                };
                Publication.prototype.changeEmojiTab = function (tab) {
                    this.selectedEmojiTab = tab;
                };
                Publication.prototype.addToComment = function (emoji) {
                    if (this.commentInputText[this.commentInputText.length - 1] == " ") {
                        this.commentInputText = this.commentInputText + emoji.shortcut;
                    }
                    else {
                        this.commentInputText = this.commentInputText + " " + emoji.shortcut;
                    }
                };
                Publication.prototype.updateComment = function ($event) {
                    this.commentText = $event.path[0].innerHTML;
                    this.changeDetector.markForCheck();
                };
                Publication.prototype.afficheComment = function (comment) {
                    var img = '<img class="emoji" style="align:absmiddle; top : 0;" src="assets/images/basic/';
                    for (var i = 0; i < this.listEmoji.length; i++) {
                        for (var j = 0; j < this.listEmoji[i].list.length; j++) {
                            comment = this.replaceAll(comment, this.listEmoji[i].list[j].shortcut, img + this.listEmoji[i].list[j].imageName + '.png" />');
                        }
                    }
                    return comment;
                };
                Publication.prototype.replaceAll = function (comment, search, replacement) {
                    return comment.split(search).join(replacement);
                };
                Publication.prototype.affichePostText = function (postText) {
                    return this.emojiService.AfficheWithEmoji(postText);
                };
                Publication.prototype.activateAnimation = function () {
                    this.likeAnimation = true;
                    console.debug("it works");
                };
                Publication.prototype.deactivateAnimation = function () {
                    this.likeAnimation = false;
                    console.debug("it works");
                };
                Publication.prototype.linkAPI = function () {
                    var _this = this;
                    var linkURL = this.publicationBean.publExternalLink;
                    if (linkURL.search(".gif") >= 0) {
                        this.link.image = linkURL.substring(0, linkURL.indexOf(".gif") + 4);
                        this.link.imageWidth = 500;
                        this.link.imageHeight = 500;
                        this.link.isGif = true;
                        this.link.url = linkURL.substring(0, linkURL.indexOf(".gif") + 4);
                        this.link.title = "gif";
                        this.link.description = "gif";
                        this.link.isSet = true;
                        return 1;
                    }
                    this.http.get(app_settings_1.AppSettings.SERVER_URL + 'getOpenGraphData?url=' + linkURL, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                        if (response.results.success) {
                            _this.link.url = linkURL;
                            _this.link.title = response.results.data.ogTitle;
                            _this.link.description = response.results.data.ogDescription;
                            if (response.results.data.ogImage) {
                                var a = response.results.data.ogImage.url;
                                _this.link.image = response.results.data.ogImage.url;
                                _this.link.imageWidth = response.results.data.ogImage.width;
                                _this.link.imageHeight = response.results.data.ogImage.height;
                                if (a.substring(a.length - 3, a.length) == "gif")
                                    _this.link.isGif = true;
                                else
                                    _this.link.isGif = false;
                            }
                            else {
                                _this.link.image = null;
                                _this.link.imageWidth = 0;
                                _this.link.imageHeight = 0;
                            }
                            _this.link.isSet = true;
                            _this.changeDetector.markForCheck();
                        }
                        else {
                            console.error("error in link API; " + linkURL);
                        }
                    }, function (err) {
                        //error
                        console.error("error in link API; " + linkURL);
                    }, function () {
                        //final
                    });
                };
                __decorate([
                    core_1.Input(),
                    __metadata('design:type', Object)
                ], Publication.prototype, "userType", void 0);
                Publication = __decorate([
                    core_1.Component({
                        selector: 'publication',
                        inputs: ['publicationBean'],
                        templateUrl: './src/client/app/publication/publication.html',
                        changeDetection: core_1.ChangeDetectionStrategy.OnPush
                    }),
                    __metadata('design:paramtypes', [seo_service_1.SeoService, postService_1.PostService, linkView_1.LinkView, emojiService_1.EmojiService, http_1.Http, router_1.Router, platform_browser_1.DomSanitizer, loginService_1.LoginService, core_1.ChangeDetectorRef, dateService_1.DateService])
                ], Publication);
                return Publication;
            }());
            exports_1("Publication", Publication);
        }
    }
});
//# sourceMappingURL=publication.js.map
