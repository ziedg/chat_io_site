System.register(['@angular/core', '@angular/http', '@angular/forms', '@angular/router', 'rxjs/add/operator/map', '../../conf/app-settings', '../../service/loginService', "../../service/linkView", "../../service/linkPreview", '../../beans/user', "@angular/platform-browser", '../../beans/linkBean'], function(exports_1, context_1) {
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
    var core_1, http_1, forms_1, router_1, router_2, app_settings_1, loginService_1, linkView_1, linkPreview_1, user_1, platform_browser_1, linkBean_1;
    var Profile;
    function previewFile(uploadedFile) {
        var preview = jQuery('#preview-image');
        var file = uploadedFile;
        var reader = new FileReader();
        reader.addEventListener("load", function () {
            //preview.att.src = reader.result;
            jQuery("#preview-image").attr('src', reader.result);
            jQuery(".file-input-holder").fadeIn(500);
            jQuery("#preview-image").fadeIn(500);
        }, false);
        if (file) {
            reader.readAsDataURL(file);
        }
    }
    function previewProfilePicture(uploadedFile) {
        var preview = jQuery('.profile-photo');
        var file = uploadedFile;
        var reader = new FileReader();
        reader.addEventListener("load", function () {
            //preview.att.src = reader.result;
            jQuery(preview).css('background-image', 'url(' + reader.result + ')');
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
            function (linkView_1_1) {
                linkView_1 = linkView_1_1;
            },
            function (linkPreview_1_1) {
                linkPreview_1 = linkPreview_1_1;
            },
            function (user_1_1) {
                user_1 = user_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            },
            function (linkBean_1_1) {
                linkBean_1 = linkBean_1_1;
            }],
        execute: function() {
            Profile = (function () {
                function Profile(linkView, linkPreview, title, route, http, router, loginService, changeDetector) {
                    var _this = this;
                    this.linkView = linkView;
                    this.linkPreview = linkPreview;
                    this.title = title;
                    this.route = route;
                    this.http = http;
                    this.router = router;
                    this.loginService = loginService;
                    this.changeDetector = changeDetector;
                    this.isLock = false;
                    this.finPosts = false;
                    this.publicationBeanList = [];
                    this.user = new user_1.User();
                    this.userDisplayed = new user_1.User();
                    this.wrongProfile = false;
                    this.link = new linkBean_1.LinkBean();
                    this.previewLink = [];
                    this.titleEnable = false;
                    this.youtubeInput = false;
                    this.youtubeLink = "";
                    this.menuFilter = "recent";
                    this.selectedMenuElement = 0;
                    this.loadingPublish = false;
                    this.noPosts = false;
                    this.showErreurConnexion = false;
                    this.showLoading = false;
                    this.lastPostId = "null";
                    this.editModal = false;
                    this.publishBox = false;
                    this.isSub = false;
                    this.firstListSub = [];
                    this.listAllSub = [];
                    this.showMoreSub = false;
                    this.lastSubscribeId = "";
                    this.stopGiveMeMoreSub = false;
                    this.descEnable = false;
                    this.linkLoading = false;
                    this.isEmpty = true;
                    this.wanaModifPhoto = false;
                    this.noPosts = false;
                    console.log(this.slimMeta);
                    console.log(this.slimOptions);
                    if (loginService.isConnected()) {
                        loginService.actualize();
                        this.user = loginService.user;
                        this.slimMeta = {
                            userId: this.user._id
                        };
                        this.slimOptions = {
                            ratio: '1:1',
                            didInit: this.slimDidInit,
                            willSave: this.savePhotoProfile,
                            label: 'Ajouter photo',
                            service: 'http://91.121.69.130:3000/testKhalil',
                            meta: this.slimMeta
                        };
                        this.router.events.subscribe(function (route) {
                            _this.changeDetector.markForCheck();
                            if (_this.route.snapshot.params['id'] != _this.lastRouterProfileId) {
                                _this.publicationBeanList = [];
                                _this.getProfile(_this.route.snapshot.params['id']);
                                _this.lastRouterProfileId = _this.route.snapshot.params['id'];
                            }
                            window.scrollTo(0, 0);
                        });
                        this.form = new forms_1.FormGroup({
                            publicationTitle: new forms_1.FormControl(),
                            publicationText: new forms_1.FormControl('', forms_1.Validators.required),
                            publicationYoutubeLink: new forms_1.FormControl()
                        });
                    }
                    else {
                        if (this.loginService.isWasConnectedWithFacebook()) {
                            this.router.navigate(['/login/facebook-login']);
                        }
                        else if (this.loginService.isWasConnectedWithGoogle()) {
                            this.router.navigate(['/login/google-login']);
                        }
                        else {
                            this.router.navigate(['/login/sign-in']);
                        }
                    }
                }
                Profile.prototype.savePhotoProfile = function (data, ready) {
                    var newImgSrc = data.output.image;
                    ready(data);
                };
                Profile.prototype.modifPhoto = function () {
                    jQuery("#slimPrev").hide();
                    this.wanaModifPhoto = true;
                };
                Profile.prototype.slimDidInit = function (data) {
                    console.log(data);
                };
                ;
                Profile.prototype.changeImage = function () {
                };
                Profile.prototype.uploadedPhoto = function (error, data, response) {
                };
                Profile.prototype.goFB = function () {
                    if (this.userDisplayed.facebookLink)
                        location.href = this.userDisplayed.facebookLink;
                };
                Profile.prototype.goTW = function () {
                    if (this.userDisplayed.twitterLink)
                        location.href = this.userDisplayed.twitterLink;
                };
                Profile.prototype.goYT = function () {
                    if (this.userDisplayed.youtubeLink)
                        location.href = this.userDisplayed.youtubeLink;
                };
                Profile.prototype.doSubUser = function (userDisplayed) {
                    var _this = this;
                    var body = JSON.stringify({
                        UserId: this.user._id,
                        profileId: userDisplayed._id
                    });
                    this.http.post(app_settings_1.AppSettings.SERVER_URL + 'subscribe', body, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                        userDisplayed.isSubscribe = true;
                        userDisplayed.nbSuivi++;
                    }, function (err) { }, function () {
                        _this.changeDetector.markForCheck();
                    });
                };
                Profile.prototype.doNotSubUser = function (userDisplayed) {
                    var _this = this;
                    var body = JSON.stringify({
                        UserId: this.user._id,
                        profileId: userDisplayed._id
                    });
                    this.http.post(app_settings_1.AppSettings.SERVER_URL + 'removeSubscribe', body, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                        userDisplayed.isSubscribe = false;
                        userDisplayed.nbSuivi--;
                    }, function (err) { }, function () {
                        _this.changeDetector.markForCheck();
                    });
                };
                Profile.prototype.doSub = function () {
                    var _this = this;
                    var body = JSON.stringify({
                        UserId: this.user._id,
                        profileId: this.userDisplayed._id
                    });
                    this.http.post(app_settings_1.AppSettings.SERVER_URL + 'subscribe', body, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                        _this.isSub = true;
                        _this.changeDetector.markForCheck();
                    }, function (err) { }, function () {
                        _this.changeDetector.markForCheck();
                    });
                };
                Profile.prototype.doNotSub = function () {
                    var _this = this;
                    var body = JSON.stringify({
                        UserId: this.user._id,
                        profileId: this.userDisplayed._id
                    });
                    this.http.post(app_settings_1.AppSettings.SERVER_URL + 'removeSubscribe', body, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                        _this.isSub = false;
                        _this.changeDetector.markForCheck();
                    }, function (err) { }, function () {
                        _this.changeDetector.markForCheck();
                    });
                };
                Profile.prototype.getFirstListAllSub = function () {
                    var _this = this;
                    if (this.userDisplayed && this.user) {
                        this.http.get(app_settings_1.AppSettings.SERVER_URL + 'getSubscribers?profileId=' + this.userDisplayed._id + '&lastSubscribeId=' + '&connectedProfileID=' + this.user._id, app_settings_1.AppSettings.OPTIONS)
                            .map(function (res) { return res.json(); })
                            .subscribe(function (response) {
                            _this.listAllSub = [];
                            if (response) {
                                for (var i = 0; i < response.length; i++) {
                                    var element = response[i];
                                    if (response[i].isSubscribe == "true") {
                                        element.isSubscribe = true;
                                    }
                                    else {
                                        element.isSubscribe = false;
                                    }
                                    _this.listAllSub.push(element);
                                    _this.lastSubscribeId = response[i]._id;
                                }
                                if (response.length)
                                    _this.lastSubscribeId = response[response.length - 1]._id;
                                _this.changeDetector.markForCheck();
                            }
                        }, function (err) {
                        }, function () {
                        });
                    }
                };
                Profile.prototype.getMoreListAllSub = function () {
                    var _this = this;
                    if (this.userDisplayed && this.user) {
                        this.http.get(app_settings_1.AppSettings.SERVER_URL + 'getSubscribers?profileId=' + this.userDisplayed._id + '&lastSubscribeId=' + this.lastSubscribeId + '&connectedProfileID=' + this.user._id, app_settings_1.AppSettings.OPTIONS)
                            .map(function (res) { return res.json(); })
                            .subscribe(function (response) {
                            if (response) {
                                for (var i = 0; i < response.length; i++) {
                                    var element = response[i];
                                    if (response[i].isSubscribe == "true") {
                                        element.isSubscribe = true;
                                    }
                                    else {
                                        element.isSubscribe = false;
                                    }
                                    _this.listAllSub.push(element);
                                    _this.lastSubscribeId = response[i]._id;
                                }
                                if (!response.length) {
                                    _this.stopGiveMeMoreSub = true;
                                }
                                else {
                                    _this.stopGiveMeMoreSub = false;
                                }
                            }
                            _this.changeDetector.markForCheck();
                        }, function (err) {
                        }, function () {
                        });
                    }
                };
                Profile.prototype.getFirstListSub = function () {
                    var _this = this;
                    if (this.userDisplayed && this.user) {
                        this.http.get(app_settings_1.AppSettings.SERVER_URL + 'getSubscribers?profileId=' + this.userDisplayed._id + '&lastSubscribeId=' + '&connectedProfileID=' + this.user._id, app_settings_1.AppSettings.OPTIONS)
                            .map(function (res) { return res.json(); })
                            .subscribe(function (response) {
                            _this.firstListSub = [];
                            if (response) {
                                for (var i = 0; i < 3 && i < response.length; i++) {
                                    var element = response[i];
                                    if (response[i].isSubscribe == "true") {
                                        element.isSubscribe = true;
                                    }
                                    else {
                                        element.isSubscribe = false;
                                    }
                                    _this.firstListSub.push(element);
                                }
                                if (response.length > 3) {
                                    _this.showMoreSub = true;
                                }
                                else {
                                    _this.showMoreSub = false;
                                }
                            }
                            _this.changeDetector.markForCheck();
                        }, function (err) {
                        }, function () {
                        });
                    }
                };
                Profile.prototype.onScrollSub = function () {
                    this.getMoreListAllSub();
                };
                Profile.prototype.getProfile = function (userId) {
                    var _this = this;
                    if (this.user) {
                        this.http.get(app_settings_1.AppSettings.SERVER_URL + 'getProfileById/?ProfileId=' + userId + '&connectedProfileId=' + this.user._id, app_settings_1.AppSettings.OPTIONS)
                            .map(function (res) { return res.json(); })
                            .subscribe(function (response) {
                            if (response._id) {
                                if (response._id == userId) {
                                    if (response.isSubscribe == "true") {
                                        _this.isSub = true;
                                    }
                                    else {
                                        _this.isSub = false;
                                    }
                                    _this.userDisplayed = response;
                                    _this.wrongProfile = false;
                                    _this.title.setTitle(response.firstName + " " + response.lastName);
                                    _this.loadFirstPosts();
                                    _this.getFirstListSub();
                                    _this.getFirstListAllSub();
                                    _this.changeDetector.markForCheck();
                                }
                                else {
                                    _this.wrongProfile = true;
                                    _this.changeDetector.markForCheck();
                                }
                            }
                            else {
                                _this.wrongProfile = true;
                                _this.changeDetector.markForCheck();
                            }
                            _this.changeDetector.markForCheck();
                        }, function (err) {
                            setTimeout(function () {
                                _this.showErreurConnexion = true;
                                _this.showLoading = false;
                            }, 3000);
                        }, function () {
                            _this.changeDetector.markForCheck();
                        });
                    }
                };
                Profile.prototype.putIntoList = function (response) {
                    this.isLock = true;
                    var element;
                    if (response) {
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
                            if (response[i].comments) {
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
                                        this.publicationBeanList.push(response[i]);
                                        if (i == response.length - 1) {
                                            this.showLoading = false;
                                            this.isLock = false;
                                            this.lastPostId = response[i]._id;
                                        }
                                    }
                                }
                            }
                            this.changeDetector.markForCheck();
                            this.publicationBeanList.push(element);
                            this.changeDetector.markForCheck();
                            if (i == response.length - 1) {
                                this.showLoading = false;
                                this.isLock = false;
                                this.lastPostId = response[i]._id;
                            }
                        }
                    }
                };
                Profile.prototype.checkPreviewLink = function ($event) {
                    this.pubText = jQuery("#pubText").val();
                    this.changeDetector.markForCheck();
                    this.linkView.getListLinks(this.pubText);
                };
                //load first Post
                Profile.prototype.loadFirstPosts = function () {
                    var _this = this;
                    if (this.userDisplayed) {
                        this.http.get(app_settings_1.AppSettings.SERVER_URL + 'getPublicationsForOneProfileByID/?ProfileId=' + this.userDisplayed._id + '&last_publication_id=', app_settings_1.AppSettings.OPTIONS)
                            .map(function (res) { return res.json(); })
                            .subscribe(function (response) {
                            _this.changeDetector.markForCheck();
                            if (response.publication) {
                                if (!response.publication.length) {
                                    _this.noPosts = true;
                                }
                                else {
                                    _this.putIntoList(response.publication);
                                    _this.noPosts = false;
                                }
                            }
                            _this.changeDetector.markForCheck();
                        }, function (err) {
                            _this.changeDetector.markForCheck();
                            setTimeout(function () {
                                _this.showErreurConnexion = true;
                                _this.showLoading = false;
                            }, 3000);
                        }, function () {
                            _this.isLock = false;
                        });
                    }
                };
                //load more Posts
                Profile.prototype.loadMorePosts = function () {
                    var _this = this;
                    if (this.userDisplayed) {
                        this.http.get(app_settings_1.AppSettings.SERVER_URL + 'getPublicationsForOneProfileByID/?ProfileId=' + this.userDisplayed._id + '&last_publication_id=' + this.lastPostId, app_settings_1.AppSettings.OPTIONS)
                            .map(function (res) { return res.json(); })
                            .subscribe(function (response) {
                            if (response.publication) {
                                if (response.publication.length == 0) {
                                    _this.finPosts = true;
                                }
                                else {
                                    _this.changeDetector.markForCheck();
                                    _this.putIntoList(response.publication);
                                    _this.isLock = false;
                                }
                            }
                            else {
                                _this.finPosts = true;
                            }
                        }, function (err) {
                            setTimeout(function () {
                                _this.showErreurConnexion = true;
                                _this.showLoading = false;
                            }, 3000);
                        }, function () {
                            _this.isLock = false;
                        });
                    }
                };
                Profile.prototype.onScrollDown = function () {
                    if (this.finPosts || this.noPosts) {
                        this.showLoading = false;
                        this.isLock = true;
                        return 0;
                    }
                    else if (this.isLock) {
                        this.showLoading = true;
                        return 0;
                    }
                    else {
                        if (this.userDisplayed._id == "")
                            this.getProfile(this.route.snapshot.params['id']);
                        this.isLock = true;
                        this.showLoading = true;
                        this.loadMorePosts();
                        return 1;
                    }
                };
                Profile.prototype.reLoadposts = function () {
                    this.showLoading = true;
                    this.showErreurConnexion = false;
                    if (this.publicationBeanList) {
                        if (this.publicationBeanList.length == 0)
                            this.getProfile(this.route.snapshot.params['id']);
                        else
                            this.loadMorePosts();
                    }
                };
                Profile.prototype.modifProfilePic = function () {
                };
                Profile.prototype.openModal = function () {
                    jQuery(".modal-edit-profile").fadeIn(500);
                };
                Profile.prototype.closeModal = function () {
                    jQuery(".modal-edit-profile").fadeOut(300);
                };
                Profile.prototype.openModalFriends = function () {
                    jQuery(".modal-friends").fadeIn(500);
                };
                Profile.prototype.closeModalFriends = function () {
                    jQuery(".modal-friends").fadeOut(300);
                };
                Profile.prototype.ngOnInit = function () {
                    jQuery(document).click(function (e) {
                        if (jQuery(e.target).closest(".white-box-edit").length === 0 && jQuery(e.target).closest(".profile-edit").length === 0) {
                            jQuery(".modal-edit-profile").fadeOut(300);
                        }
                        if (jQuery(e.target).closest(".white-box-friends").length === 0 && jQuery(e.target).closest(".more-friends").length === 0 && jQuery(e.target).closest(".more-friends-mobile").length === 0) {
                            jQuery(".modal-friends").fadeOut(300);
                        }
                    });
                    jQuery(document).click(function (e) {
                        if (jQuery(e.target).closest(".select-menu").length === 0 && jQuery(e.target).closest(".dropdown").length === 0) {
                            jQuery(".select-menu").hide();
                        }
                    });
                };
                Profile.prototype.updatePublishTextOnPaste = function ($event) {
                    $event.preventDefault();
                    var text = $event.clipboardData.getData("text/plain");
                    if (text.search("youtube.com/watch") >= 0) {
                        this.youtubeInput = true;
                        this.changeDetector.markForCheck();
                        jQuery(".yt-in-url").val(text);
                        this.changeDetector.markForCheck();
                        this.youtubeLink = text;
                        this.updateYoutube();
                        this.closeLinkAPI();
                        return 1;
                    }
                    if (this.isEmpty) {
                        jQuery(".textarea-publish")[0].innerHTML = jQuery(".textarea-publish")[0].innerHTML + "&nbsp;";
                        this.publishText = jQuery(".textarea-publish")[0].innerHTML;
                    }
                    this.linkAPI();
                    document.execCommand("insertHTML", false, text);
                };
                Profile.prototype.updatePublishText = function ($event) {
                    this.publishText = $event.path[0].innerHTML;
                    if (!this.publishText || this.publishText.length == 0) {
                        this.isEmpty = true;
                    }
                    else {
                        this.isEmpty = false;
                    }
                    //this.link = this.link.update(this.publishText);
                    this.linkAPI();
                    this.changeDetector.markForCheck();
                    //this.linkPreview.linkAPI(this.publishText,this.link ,this.previewLink);
                    //this.link = this.linkPreview.returnerLink;
                    this.changeDetector.markForCheck();
                };
                Profile.prototype.closeLinkAPI = function () {
                    this.link.initialise();
                };
                Profile.prototype.linkAPI = function () {
                    var _this = this;
                    //var linkURL = this.publishText;
                    //var linkURL = this.publishText.match(/\b(http|https)?(:\/\/)?(\S*)\.(\w{2,4})\b/ig);
                    {
                        var source = (this.publishText || '').toString();
                        var myArray = this.linkView.getListLinks(source);
                        if (!myArray.length) {
                            return 1;
                        }
                        var linkURL = myArray[0];
                        if (linkURL == this.link.url) {
                            return 1;
                        }
                        if (linkURL.search("youtube.com/watch") >= 0) {
                            jQuery(".yt-in-url").val(linkURL);
                            this.updateYoutube();
                            return 1;
                        }
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
                        this.linkLoading = true;
                        this.http.get(app_settings_1.AppSettings.SERVER_URL + 'getOpenGraphData?url=' + linkURL, app_settings_1.AppSettings.OPTIONS)
                            .map(function (res) { return res.json(); })
                            .subscribe(function (response) {
                            if (response.results.success) {
                                _this.resetPublishPicture();
                                jQuery(".youtube-preview").html("");
                                //this.form.controls.publicationYoutubeLink.updateValue('');
                                _this.link.url = linkURL.substring(0, linkURL.length - 6);
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
                                _this.linkLoading = false;
                                _this.changeDetector.markForCheck();
                                if (_this.isEmpty) {
                                    _this.publishText = "";
                                    jQuery(".textarea-publish")[0].innerHTML = "";
                                }
                            }
                            else {
                                console.error("error in link API;");
                                _this.linkLoading = false;
                            }
                        }, function (err) {
                            //error
                            console.error("error in link API;");
                            _this.linkLoading = false;
                        }, function () {
                            //final
                        });
                    }
                };
                Profile.prototype.resetPublishPicture = function () {
                    jQuery("#preview-image").attr('src', "");
                    jQuery("#preview-image").hide();
                    this.uploadedPicture = null;
                };
                Profile.prototype.resetPublish = function () {
                    this.changeDetector.markForCheck();
                    jQuery("#file-image").val("");
                    jQuery("#file-image-gif").val("");
                    jQuery("#preview-image").attr('src', '');
                    jQuery("#preview-image").fadeOut();
                    this.uploadedPicture = null;
                    //this.form.controls.publicationTitle.updateValue('');
                    this.titleEnable = false;
                    //this.form.controls.publicationText.updateValue('');
                    //this.form.controls.publicationYoutubeLink.updateValue('');
                    this.youtubeInput = false;
                    this.youtubeLink = null;
                    jQuery(".yt-in-url").val("");
                    jQuery(".youtube-preview").html("");
                    this.loadingPublish = false;
                    jQuery(".textarea-publish").html("");
                    this.closeLinkAPI();
                };
                //add Publication
                Profile.prototype.publish = function () {
                    var _this = this;
                    if (!this.form.value.publicationText && !this.youtubeLink && !this.uploadedPicture && !this.link.isSet) {
                        return;
                    }
                    this.changeDetector.markForCheck();
                    this.loadingPublish = true;
                    var data = new FormData();
                    data.append('profileId', this.user._id);
                    if (this.selectedMenuElement == 0) {
                        data.append('confidentiality', 'PUBLIC');
                    }
                    else {
                        data.append('confidentiality', 'PRIVATE');
                    }
                    data.append('publTitle', this.form.value.publicationTitle);
                    data.append('publText', this.form.value.publicationText);
                    data.append('publyoutubeLink', this.youtubeLink);
                    data.append('publPicture', this.uploadedPicture);
                    if (this.link.isSet) {
                        data.append('publExternalLink', this.link.url);
                    }
                    this.changeDetector.markForCheck();
                    this.http.post(app_settings_1.AppSettings.SERVER_URL + 'publish', data, app_settings_1.AppSettings.OPTIONS_POST)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                        _this.changeDetector.markForCheck();
                        if (response.status == "0") {
                            jQuery("#errorMsgDisplay").fadeOut(1000);
                            var elemnt = response.publication;
                            elemnt.displayed = true;
                            elemnt.isShared = false;
                            _this.publicationBeanList.unshift(elemnt);
                            _this.resetPublish();
                            _this.changeDetector.markForCheck();
                        }
                        else {
                            _this.loadingPublish = false;
                        }
                    }, function (err) { }, function () {
                    });
                };
                //Enable title post
                Profile.prototype.enableTitlePost = function () {
                    this.titleEnable = !this.titleEnable;
                };
                //change Menu Filter
                Profile.prototype.changeMenuFilter = function (newMenufilter) {
                    this.menuFilter = newMenufilter;
                    localStorage.setItem('typePosts', newMenufilter);
                    this.publicationBeanList = [];
                    this.loadFirstPosts();
                };
                //select Menu Home
                Profile.prototype.enableSelectMenu = function () {
                    jQuery(".select-menu").toggle();
                };
                Profile.prototype.changeSelectMenu = function (choice) {
                    this.selectedMenuElement = choice;
                };
                //change Youtube Input
                Profile.prototype.changeYoutubeInput = function () {
                    jQuery(".yt-in-url").toggle();
                };
                Profile.prototype.addPhoto = function () {
                    jQuery(("#file-image")).click();
                };
                Profile.prototype.addPhotoGIF = function () {
                    jQuery(("#file-image-gif")).click();
                };
                Profile.prototype.changePhoto = function () {
                    jQuery(("#file-profile")).click();
                };
                Profile.prototype.changePhotoUpload = function () {
                    var _this = this;
                    if (!this.uploadedProfilePicture) {
                        return;
                    }
                    this.changeDetector.markForCheck();
                    var data = new FormData();
                    data.append('profileId', this.user._id);
                    data.append('profilePicture', this.uploadedProfilePicture);
                    this.changeDetector.markForCheck();
                    this.http.post(app_settings_1.AppSettings.SERVER_URL + 'updateProfilePicture', data, app_settings_1.AppSettings.OPTIONS_POST)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                        _this.changeDetector.markForCheck();
                        if (response.status == "0") {
                            localStorage.setItem('user', JSON.stringify(response.profile));
                            _this.loginService.actualize();
                            _this.changePhotoCancel();
                            _this.uploadedProfilePicture = null;
                            jQuery("#file-profile").val("");
                            jQuery(".profile-photo").css('background-image', 'url(' + response.profile.profilePicture + ')');
                            swal({
                                title: "Photo de profil Modifié!",
                                text: "votre photo de profil a été modifié",
                                type: "success",
                                timer: 2000,
                                showConfirmButton: false
                            }).then(function () { }, function (dismiss) { });
                        }
                        else {
                            _this.changePhotoCancel();
                        }
                    }, function (err) { }, function () {
                    });
                };
                Profile.prototype.changePhotoCancel = function () {
                    this.uploadedProfilePicture = null;
                    jQuery("#file-profile").val("");
                    jQuery(".profile-photo").css('background-image', 'url(' + this.userDisplayed.profilePicture + ')');
                };
                //uploading photo or GIF
                Profile.prototype.uploadPhoto = function ($event) {
                    var inputValue = $event.target;
                    if (inputValue != null && null != inputValue.files[0]) {
                        this.uploadedPicture = inputValue.files[0];
                        previewFile(this.uploadedPicture);
                        jQuery(".youtube-preview").html("");
                        //this.form.controls.publicationYoutubeLink.updateValue('');
                        this.closeLinkAPI();
                    }
                    else {
                        this.uploadedPicture = null;
                    }
                };
                Profile.prototype.uploadPhotoGIF = function ($event) {
                    var inputValue = $event.target;
                    if (inputValue != null && null != inputValue.files[0]) {
                        this.uploadedPicture = inputValue.files[0];
                        previewFile(this.uploadedPicture);
                        jQuery(".youtube-preview").html("");
                    }
                    else {
                        this.uploadedPicture = null;
                    }
                };
                Profile.prototype.updateProfilePicture = function ($event) {
                    var inputValue = $event.target;
                    if (inputValue != null && null != inputValue.files[0]) {
                        this.uploadedProfilePicture = inputValue.files[0];
                        previewProfilePicture(this.uploadedProfilePicture);
                    }
                    else {
                        this.uploadedProfilePicture = null;
                    }
                };
                Profile.prototype.updateYoutube = function () {
                    a = jQuery(".yt-in-url");
                    if (a.val().indexOf("youtube.com") < 1) {
                        jQuery(".youtube-preview").html("");
                        a.val("");
                        return;
                    }
                    try {
                        var validatedLink = a.val();
                        var code = a.val();
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
                        jQuery(".youtube-preview").html('<iframe width="560" height="315" src="https://www.youtube.com/embed/' + video + '" frameborder="0" allowfullscreen></iframe>');
                        this.uploadedPicture = null;
                        this.closeLinkAPI();
                        this.youtubeLink = validatedLink;
                        //this.form.controls.publicationYoutubeLink.updateValue(jQuery(".yt-in-url").val());
                        jQuery("#preview-image").hide();
                    }
                    catch (err) {
                        jQuery(".youtube-preview").html("");
                    }
                };
                Profile.prototype.showPublishBox = function () {
                    this.publishBox = true;
                };
                Profile.prototype.editDescription = function () {
                    this.descEnable = true;
                };
                Profile.prototype.saveDescriptionWithEnter = function (e) {
                    e.preventDefault();
                    this.saveDescription();
                };
                Profile.prototype.saveDescription = function () {
                    var _this = this;
                    var descriptionText = jQuery("#descEdit").val();
                    this.userDisplayed.about = descriptionText;
                    var nvUser = this.user;
                    nvUser.about = descriptionText;
                    this.loginService.actualize();
                    this.loginService.updateUser(nvUser);
                    var body = JSON.stringify({
                        profileId: this.user._id,
                        about: descriptionText
                    });
                    this.http.post(app_settings_1.AppSettings.SERVER_URL + 'updateAboutProfile', body, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                        _this.changeDetector.markForCheck();
                        _this.descEnable = false;
                    }, function (err) { }, function () {
                        _this.changeDetector.markForCheck();
                    });
                    this.changeDetector.markForCheck();
                };
                Profile = __decorate([
                    core_1.Component({
                        selector: 'profile',
                        templateUrl: './src/client/app/main/profile/profile.html',
                        changeDetection: core_1.ChangeDetectionStrategy.OnPush
                    }),
                    __metadata('design:paramtypes', [linkView_1.LinkView, linkPreview_1.LinkPreview, platform_browser_1.Title, router_2.ActivatedRoute, http_1.Http, router_1.Router, loginService_1.LoginService, core_1.ChangeDetectorRef])
                ], Profile);
                return Profile;
            }());
            exports_1("Profile", Profile);
        }
    }
});
//# sourceMappingURL=profile.js.map
