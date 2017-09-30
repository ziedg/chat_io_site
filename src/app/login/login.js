System.register(['@angular/common', 'rxjs/add/operator/map', '@angular/core', '@angular/http', '@angular/forms', '@angular/router', '../conf/app-settings', '../service/loginService', '../beans/social-user', "@angular/platform-browser"], function(exports_1, context_1) {
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
    var common_1, core_1, http_1, forms_1, router_1, app_settings_1, loginService_1, social_user_1, platform_browser_1;
    var Login;
    return {
        setters:[
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (_1) {},
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
            function (app_settings_1_1) {
                app_settings_1 = app_settings_1_1;
            },
            function (loginService_1_1) {
                loginService_1 = loginService_1_1;
            },
            function (social_user_1_1) {
                social_user_1 = social_user_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            }],
        execute: function() {
            Login = (function () {
                function Login(_loc, title, http, router, loginService, changeDetector) {
                    var _this = this;
                    this._loc = _loc;
                    this.title = title;
                    this.http = http;
                    this.router = router;
                    this.loginService = loginService;
                    this.changeDetector = changeDetector;
                    this.errorMessage = null;
                    this.loadingSign = false;
                    this.dontShowSocialNetworksLoginButtons = false;
                    this.loadingFb = false;
                    this.loadingGgl = false;
                    this.loacationPath = "/login/sign-in";
                    this.title.setTitle("Connexion - Speegar");
                    this.form = new forms_1.FormGroup({
                        email: new forms_1.FormControl('', forms_1.Validators.required),
                        password: new forms_1.FormControl('', forms_1.Validators.required)
                    });
                    if (this.loginService.isConnected()) {
                        this.router.navigate(['/main/home']);
                    }
                    this.router.events.subscribe(function (route) {
                        _this.changeLocationPath();
                        _this.loadGooglePlusHandler();
                        _this.changeDetector.markForCheck();
                    });
                    FB.init({
                        appId: '176581259425722',
                        status: true,
                        cookie: true,
                        xfbml: true,
                        version: 'v2.5' // use graph api version 2.5
                    });
                    gapi.load('auth2', function () {
                        this.auth2 = gapi.auth2.init({
                            client_id: '239893490604-8a5fjdfak2p7dv924ohnks552sdop59i.apps.googleusercontent.com',
                            cookiepolicy: 'single_host_origin',
                            'scope': "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.me"
                        });
                    }.bind(this));
                }
                Login.prototype.changeLocationPath = function () {
                    this.loacationPath = this._loc.path();
                    if (this.loacationPath == "/login/reset-password" || this.loacationPath == "/login/facebook-login" || this.loacationPath == "/login/google-login") {
                        this.dontShowSocialNetworksLoginButtons = true;
                    }
                    else {
                        this.dontShowSocialNetworksLoginButtons = false;
                    }
                };
                Login.prototype.ngOnInit = function () {
                };
                Login.prototype.getUserFacbookConnexion = function (result) {
                    var _this = this;
                    if (result.authResponse) {
                        FB.api('/me/picture?height=70&width=70', (function (responseSmallPic) {
                            FB.api('/me/picture?height=1000&width=1000', (function (responsePic) {
                                FB.api('/me?fields=id,first_name,last_name,name,email,cover,birthday,gender,location', (function (response) {
                                    _this.getUserInformations(response, responsePic, responseSmallPic.data.url);
                                    _this.loadingFb = false;
                                }));
                            }));
                        }));
                    }
                    else {
                        this.loadingFb = false;
                    }
                };
                Login.prototype.getUserInformations = function (response, responsePic, responseSmallPic) {
                    var _this = this;
                    var body = {};
                    body = JSON.stringify({
                        profilePicture: responsePic.data.url,
                        firstName: response.first_name,
                        lastName: response.last_name,
                        email: response.email,
                        facebookId: response.id,
                        birthday: response.birthday,
                        gender: response.gender,
                        //coverPicture: response.cover.source,
                        profilePictureMin: responseSmallPic
                    });
                    this.http.post(app_settings_1.AppSettings.SERVER_URL + 'signWithFacebook', body, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                        if (response.status == "0") {
                            var user = response.user;
                            _this.loginService.updateUser(user);
                            _this.loginService.setToken(response.token);
                            if (response.user.isNewInscri == "true") {
                                localStorage.setItem('isNewInscri', "true");
                            }
                            _this.facebookUser = new social_user_1.SocialUser();
                            _this.facebookUser.firstName = user.firstName;
                            _this.facebookUser.lastName = user.lastName;
                            _this.facebookUser.profilePicture = user.profilePicture;
                            localStorage.setItem('facebookUser', JSON.stringify(_this.facebookUser));
                            _this.router.navigate(['/main/home']);
                        }
                        else {
                            _this.errorMessage = response.message;
                        }
                    }, function (err) {
                        _this.errorMessage = "Erreur technique.";
                    }, function () {
                    });
                };
                Login.prototype.RedirectTo = function (link) {
                    //AppSettings.Redirect(link);
                };
                Login.prototype.loginWithFacebook = function () {
                    var _this = this;
                    this.loadingFb = true;
                    FB.login(function (result) {
                        _this.getUserFacbookConnexion(result);
                    }, { scope: 'email,user_photos,user_videos,public_profile,user_birthday,user_location' });
                };
                Login.prototype.ngAfterViewInit = function () {
                    this.loadGooglePlusHandler();
                };
                Login.prototype.loadGooglePlusHandler = function () {
                    gapi.load('auth2', function () {
                        if (this.auth2) {
                            if (this.auth2.isSignedIn.get()) {
                                var googleUser = auth2.currentUser.get().getBasicProfile();
                                this.loadingGgl = true;
                                this.loginWithGooglePlus(googleUser);
                            }
                            else {
                                this.auth2.attachClickHandler(document.getElementById("googlePlusBuutonLogin"), {}, function (googleUser) {
                                    this.loadingGgl = true;
                                    this.loginWithGooglePlus(googleUser);
                                }.bind(this), function (error) {
                                    this.errLoginGooglePlus(error);
                                }.bind(this));
                            }
                        }
                        else {
                            this.auth2 = gapi.auth2.init({
                                client_id: '239893490604-8a5fjdfak2p7dv924ohnks552sdop59i.apps.googleusercontent.com',
                                cookiepolicy: 'single_host_origin',
                                'scope': "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.me"
                            });
                            this.auth2.attachClickHandler(document.getElementById("googlePlusBuutonLogin"), {}, function (googleUser) {
                                this.loadingGgl = true;
                                this.loginWithGooglePlus(googleUser);
                            }.bind(this), function (error) {
                                this.errLoginGooglePlus(error);
                            }.bind(this));
                        }
                    }.bind(this));
                };
                Login.prototype.loginWithGooglePlus = function (googleUser) {
                    var profile = googleUser.getBasicProfile();
                    gapi.client.load('plus', 'v1', function () {
                        this.loadGooglePlusProfile();
                    }.bind(this));
                };
                Login.prototype.loadGooglePlusProfile = function () {
                    this.loadingGgl = true;
                    var request = gapi.client.plus.people.get({
                        'userId': 'me'
                    });
                    request.execute(function (resp) {
                        var longeur = (resp.image.url.length) - 2;
                        var userImg = resp.image.url.substr(0, longeur);
                        var body = JSON.stringify({
                            profilePicture: userImg + "1000",
                            profilePictureMin: userImg + "70",
                            firstName: resp.name.givenName,
                            lastName: resp.name.familyName,
                            email: resp.emails[0].value,
                            googleId: resp.id,
                            gender: resp.gender,
                            birthday: resp.birthday
                        });
                        this.saveGooglePlusData(JSON.parse(body));
                        this.logoutGooglePlus();
                    }.bind(this));
                    this.loadingGgl = false;
                };
                Login.prototype.saveGooglePlusData = function (body) {
                    var _this = this;
                    this.http.post(app_settings_1.AppSettings.SERVER_URL + 'signWithGoogle', body, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                        if (response.status == "0") {
                            var user = response.user;
                            _this.loginService.updateUser(user);
                            _this.loginService.setToken(response.token);
                            if (response.user.isNewInscri == "true") {
                                localStorage.setItem('isNewInscri', "true");
                            }
                            _this.googleUser = response.user;
                            localStorage.setItem('googleUser', JSON.stringify(_this.googleUser));
                            _this.router.navigate(['/main/home']);
                        }
                        else {
                            _this.errorMessage = response.message;
                        }
                    }, function (err) {
                        _this.errorMessage = "Erreur technique.";
                    }, function () {
                    });
                };
                Login.prototype.logoutGooglePlus = function () {
                    var auth2 = gapi.auth2.getAuthInstance();
                    auth2.signOut().then(function () {
                    });
                };
                Login.prototype.errLoginGooglePlus = function (error) {
                };
                Login = __decorate([
                    core_1.Component({
                        selector: 'login',
                        templateUrl: './src/client/app/login/login.html'
                    }),
                    __metadata('design:paramtypes', [common_1.Location, platform_browser_1.Title, http_1.Http, router_1.Router, loginService_1.LoginService, core_1.ChangeDetectorRef])
                ], Login);
                return Login;
            }());
            exports_1("Login", Login);
        }
    }
});
//# sourceMappingURL=login.js.map
