System.register(['@angular/core', '@angular/http', '@angular/forms', '@angular/router', 'rxjs/add/operator/map', '../../conf/app-settings', '../../service/loginService', "../../service/linkView", "../../service/linkPreview", "../../service/postService", '../../beans/user', "@angular/platform-browser", '../../beans/linkBean'], function(exports_1, context_1) {
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
    var core_1, http_1, forms_1, router_1, app_settings_1, loginService_1, linkView_1, linkPreview_1, postService_1, user_1, platform_browser_1, linkBean_1;
    var Home;
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = [];
            reader.push(new FileReader());
            reader[0].addEventListener("load", function (event) {
                jQuery("#preview-image").show();
            }, false);
            if (input.files[0]) {
                reader[0].readAsDataURL(input.files[0]);
            }
        }
    }
    exports_1("readURL", readURL);
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
            function (postService_1_1) {
                postService_1 = postService_1_1;
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
            Home = (function () {
                function Home(postService, linkView, linkPreview, title, http, router, loginService, changeDetector) {
                    //this.previewLink.push(this.link);
                    this.postService = postService;
                    this.linkView = linkView;
                    this.linkPreview = linkPreview;
                    this.title = title;
                    this.http = http;
                    this.router = router;
                    this.loginService = loginService;
                    this.changeDetector = changeDetector;
                    this.userType = 0; // 0 =  simple user ; 331 = admin
                    this.isLock = false;
                    this.finPosts = false;
                    this.publicationBeanList = [];
                    this.user = new user_1.User();
                    this.link = new linkBean_1.LinkBean();
                    this.previewLink = [];
                    //Variables Declarations
                    this.titleEnable = false;
                    this.youtubeInput = false;
                    this.youtubeLink = "";
                    this.menuFilter = "recent";
                    this.selectedMenuElement = 0;
                    this.nbLoadedPosts = 10;
                    this.showLoading = false;
                    this.errorMsg = "";
                    this.lastPostId = "null";
                    this.loadingPublish = false;
                    this.showErreurConnexion = false;
                    this.linkLoading = false;
                    this.isEmpty = true;
                    this.title.setTitle("Speegar");
                    this.postService.setShowErrorConnexion(false);
                    if (!this.loginService.isConnected()) {
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
                    this.changeDetector.markForCheck();
                    this.user = this.loginService.getUser();
                    this.checkAdminUser(this.user._id);
                    this.form = new forms_1.FormGroup({
                        publicationTitle: new forms_1.FormControl(),
                        publicationText: new forms_1.FormControl('', forms_1.Validators.required),
                        publicationYoutubeLink: new forms_1.FormControl()
                    });
                    if (this.user) {
                        this.publicationBeanList = [];
                        this.loadFirstPosts();
                        if (!this.publicationBeanList.length)
                            this.loadFirstPosts();
                        this.changeDetector.markForCheck();
                    }
                    window.scrollTo(0, 0);
                    if (localStorage.getItem('isNewInscri')) {
                        if (localStorage.getItem('isNewInscri') == "true") {
                            this.afficheWelcome = true;
                            localStorage.removeItem('isNewInscri');
                        }
                        else {
                            this.afficheWelcome = false;
                        }
                    }
                    else {
                        this.afficheWelcome = false;
                    }
                    if (localStorage.getItem('typePosts')) {
                        if (localStorage.getItem('typePosts') != 'recent' && localStorage.getItem('typePosts') != 'popular') {
                            localStorage.setItem('typePosts', 'recent');
                        }
                    }
                    else {
                        localStorage.setItem('typePosts', 'recent');
                    }
                    this.menuFilter = localStorage.getItem('typePosts');
                    jQuery("meta[property='og:url']").remove();
                    jQuery('head').append('<meta property="og:url" content="' + app_settings_1.AppSettings.SITE_URL + '#/main/home" />');
                }
                Home.prototype.checkAdminUser = function (userId) {
                    var _this = this;
                    this.http.get(app_settings_1.AppSettings.SERVER_URL + 'getProfileById/?ProfileId=' + userId + '&connectedProfileId=' + userId, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                        if (response._id) {
                            if (response.isAdmin == 1) {
                                _this.userType = 331;
                            }
                            else {
                                _this.userType = 0;
                            }
                        }
                        _this.changeDetector.markForCheck();
                    }, function (err) {
                    }, function () {
                        _this.changeDetector.markForCheck();
                    });
                };
                Home.prototype.putNewPub = function (pub, isShared) {
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
                Home.prototype.checkPreviewLink = function ($event) {
                    this.pubText = jQuery("#pubText").val();
                    this.changeDetector.markForCheck();
                    this.linkView.getListLinks(this.pubText);
                };
                Home.prototype.putIntoList = function (response) {
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
                //load first Post
                Home.prototype.loadFirstPosts = function () {
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
                            _this.publicationBeanList = [];
                            _this.putIntoList(response);
                            _this.changeDetector.markForCheck();
                        }, function (err) {
                            setTimeout(function () {
                                //this.showErreurConnexion = true;
                                _this.showLoading = false;
                            }, 3000);
                        }, function () {
                            _this.isLock = false;
                        });
                    }
                };
                //load more Posts
                Home.prototype.loadMorePosts = function () {
                    var _this = this;
                    if (this.user) {
                        var urlAndPara = "";
                        //localStorage.getItem('typePosts') != 'recent' && localStorage.getItem('typePosts') != 'popular'
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
                Home.prototype.onScrollDown = function () {
                    if (this.finPosts) {
                        this.showLoading = false;
                        this.isLock = true;
                        return 0;
                    }
                    else if ((((this.lastPostId == "null") || (this.isLock)) || this.showErreurConnexion) || !$(window).scrollTop()) {
                        this.showLoading = true;
                        return 0;
                    }
                    else {
                        this.isLock = true;
                        this.loadMorePosts();
                        return 1;
                    }
                };
                Home.prototype.reLoadposts = function () {
                    this.showLoading = true;
                    this.showErreurConnexion = false;
                    if (this.user) {
                        if (this.publicationBeanList.length == 0)
                            this.loadFirstPosts();
                        else
                            this.loadMorePosts();
                    }
                };
                Home.prototype.updatePublishTextOnPaste = function ($event) {
                    $event.preventDefault();
                    var text = $event.clipboardData.getData("text/plain");
                    if (text.search("youtube.com/watch") >= 0) {
                        this.youtubeInput = true;
                        jQuery(".yt-in-url").val(text);
                        this.changeDetector.markForCheck();
                        this.youtubeLink = text;
                        this.updateYoutube();
                        //this.form.controls.publicationYoutubeLink.updateValue(text);
                        return 1;
                    }
                    if (this.isEmpty) {
                        jQuery(".textarea-publish")[0].innerHTML = jQuery(".textarea-publish")[0].innerHTML + "&nbsp;";
                        this.publishText = jQuery(".textarea-publish")[0].innerHTML;
                    }
                    this.linkAPI();
                    document.execCommand("insertHTML", false, text);
                };
                Home.prototype.updatePublishText = function ($event) {
                    this.publishText = $event.path[0].innerHTML;
                    if (!this.publishText || this.publishText.length == 0) {
                        this.isEmpty = true;
                    }
                    else {
                        this.isEmpty = false;
                    }
                    //this.link = this.link.update(this.publishText);
                    this.linkAPI();
                    //this.linkPreview.linkAPI(this.publishText,this.link ,this.previewLink);
                    //this.link = this.linkPreview.returnerLink;
                    this.changeDetector.markForCheck();
                };
                Home.prototype.resetPublishPicture = function () {
                    jQuery("#preview-image").attr('src', "");
                    jQuery("#preview-image").hide();
                    this.uploadedPicture = null;
                };
                Home.prototype.resetPublish = function () {
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
                    this.isEmpty = true;
                    this.changeDetector.markForCheck();
                };
                //add Publication
                Home.prototype.publish = function () {
                    var _this = this;
                    if (!this.form.value.publicationText && !this.youtubeLink && !this.uploadedPicture && !this.link.isSet) {
                        this.errorMsg = "Votre publication est vide. Veuillez ecrire une publication, partager une photo/GIF ou une video Youtube.";
                        this.errorTimed();
                        return;
                    }
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
                        if (response.status == "0") {
                            jQuery("#errorMsgDisplay").fadeOut(1000);
                            _this.putNewPub(response.publication, false);
                            _this.resetPublish();
                        }
                        else {
                            _this.failureMessage = response.data;
                            _this.errorMsg = response.message;
                            _this.errorTimed();
                            _this.loadingPublish = false;
                        }
                    }, function (err) { }, function () {
                    });
                };
                //Enable title post
                Home.prototype.enableTitlePost = function () {
                    this.titleEnable = !this.titleEnable;
                };
                Home.prototype.emptyDivOnFocus = function () {
                    jQuery("#placehoder-publish").remove();
                };
                //change Menu Filter
                Home.prototype.changeMenuFilter = function (newMenufilter) {
                    this.menuFilter = newMenufilter;
                    localStorage.setItem('typePosts', newMenufilter);
                    this.publicationBeanList = [];
                    this.publicationBeanList = this.postService.loadFirstPosts();
                };
                //select Menu Home
                Home.prototype.enableSelectMenu = function () {
                    jQuery(".select-menu").toggle();
                };
                Home.prototype.changeSelectMenu = function (choice) {
                    this.selectedMenuElement = choice;
                };
                //change Youtube Input
                Home.prototype.changeYoutubeInput = function () {
                    jQuery(".yt-in-url").toggle();
                };
                //error close
                Home.prototype.closeErrorMsg = function () {
                    jQuery("#errorMsgDisplay").fadeOut(1000);
                    this.errorMsg = "";
                };
                Home.prototype.closeWelcomeMsg = function () {
                    jQuery("#welcomeMsgDisplay").fadeOut(1000);
                    this.afficheWelcome = false;
                };
                Home.prototype.errorTimed = function () {
                    var _this = this;
                    jQuery("#errorMsgDisplay").fadeIn(500);
                    setTimeout(function () {
                        jQuery("#errorMsgDisplay").fadeOut(1000);
                    }, 5000);
                    setTimeout(function () {
                        _this.errorMsg = "";
                    }, 5200);
                };
                //uploading Photo click event
                Home.prototype.addPhoto = function () {
                    jQuery(("#file-image")).click();
                };
                Home.prototype.addPhotoGIF = function () {
                    jQuery(("#file-image-gif")).click();
                };
                //uploading photo or GIF
                Home.prototype.uploadPhoto = function ($event) {
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
                Home.prototype.uploadPhotoGIF = function ($event) {
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
                Home.prototype.updateYoutube = function () {
                    a = jQuery(".yt-in-url");
                    if (a.val().indexOf("youtube.com") < 1) {
                        this.errorMsg = "Votre lien Youtube est invalide! Veuillez mettre un lien Youtube Valide.";
                        this.errorTimed();
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
                Home.prototype.closeLinkAPI = function () {
                    this.link.initialise();
                };
                Home.prototype.linkAPI = function () {
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
                                console.log(_this.isEmpty + _this.publishText);
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
                Home.prototype.ngOnInit = function () {
                    jQuery("#publishDiv").on("paste", function (e) {
                        // access the clipboard using the api
                        console.error('amlt copt');
                        e.preventDefault();
                        var pastedData = e.originalEvent.clipboardData.getData('text');
                        alert(pastedData);
                    });
                    jQuery("#errorMsgDisplay").hide();
                    jQuery(("#file-image")).change(function () {
                        jQuery((".file-input-holder")).show();
                        readURL(this);
                    });
                    jQuery(("#file-image-gif")).change(function () {
                        jQuery((".file-input-holder")).show();
                        readURL(this);
                    });
                    jQuery(document).click(function (e) {
                        if (jQuery(e.target).closest(".select-menu").length === 0 && jQuery(e.target).closest(".dropdown").length === 0) {
                            jQuery(".select-menu").hide();
                        }
                    });
                };
                Home.prototype.pasteInnerHtml = function ($event) {
                    $event.preventDefault();
                    var plainText = $event.clipboardData.getData("text/plain");
                    document.execCommand("insertHTML", false, plainText);
                };
                Home = __decorate([
                    core_1.Component({
                        selector: 'home',
                        templateUrl: './src/client/app/main/home/home.html',
                        changeDetection: core_1.ChangeDetectionStrategy.OnPush
                    }),
                    __metadata('design:paramtypes', [postService_1.PostService, linkView_1.LinkView, linkPreview_1.LinkPreview, platform_browser_1.Title, http_1.Http, router_1.Router, loginService_1.LoginService, core_1.ChangeDetectorRef])
                ], Home);
                return Home;
            }());
            exports_1("Home", Home);
        }
    }
});
//# sourceMappingURL=home.js.map
