System.register(['@angular/core', '@angular/http', '@angular/router', 'rxjs/add/operator/map', '../../conf/app-settings', '../../service/loginService', "@angular/platform-browser"], function(exports_1, context_1) {
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
    var core_1, http_1, router_1, app_settings_1, loginService_1, platform_browser_1;
    var FacebookLogin;
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
            },
            function (_1) {},
            function (app_settings_1_1) {
                app_settings_1 = app_settings_1_1;
            },
            function (loginService_1_1) {
                loginService_1 = loginService_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            }],
        execute: function() {
            FacebookLogin = (function () {
                function FacebookLogin(title, http, router, loginService) {
                    this.title = title;
                    this.http = http;
                    this.router = router;
                    this.loginService = loginService;
                    this.errorMessage = null;
                    this.loadingSign = false;
                    this.title.setTitle("Connexion - Speegar");
                    if (!loginService.isWasConnectedWithFacebook()) {
                        this.router.navigate(['/login/sign-in']);
                    }
                    if (loginService.isConnected()) {
                        this.router.navigate(['/main/home']);
                    }
                    this.facebookUser = this.loginService.getFacebookUser();
                    FB.init({
                        appId: '176581259425722',
                        status: true,
                        cookie: true,
                        xfbml: true,
                        version: 'v2.5' // use graph api version 2.5
                    });
                }
                FacebookLogin.prototype.getUserFacbookConnexion = function (result) {
                    var _this = this;
                    if (result.authResponse) {
                        FB.api('/me/picture?height=1000&width=1000', (function (responsePic) {
                            FB.api('/me?fields=id,first_name,last_name,name,email,cover,birthday,gender,location', (function (response) {
                                _this.getUserInformations(response, responsePic);
                            }));
                        }));
                        this.loadingSign = false;
                    }
                    else {
                        console.log('User cancelled login or did not fully authorize.');
                        this.loadingSign = false;
                    }
                };
                FacebookLogin.prototype.getUserInformations = function (response, responsePic) {
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
                        coverPicture: response.cover.source,
                    });
                    this.http.post(app_settings_1.AppSettings.SERVER_URL + 'signWithFacebook', body, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                        if (response.status == "0") {
                            var user = response.user;
                            _this.loginService.updateUser(user);
                            localStorage.setItem('user', JSON.stringify(response.user));
                            _this.loginService.setToken(response.token);
                            _this.loginService.actualize();
                            localStorage.setItem('lastConnexionMethod', 'fb');
                            _this.router.navigate(['/main/home']);
                        }
                        else {
                            _this.errorMessage = response.message;
                        }
                    }, function (err) {
                        console.error(err);
                        _this.errorMessage = "Erreur technique.";
                    }, function () {
                        console.log('done');
                    });
                };
                FacebookLogin.prototype.goSignIn = function () {
                    this.router.navigate(['/login/sign-in']);
                };
                FacebookLogin.prototype.loginWithFacebook = function () {
                    var _this = this;
                    this.loadingSign = true;
                    FB.login(function (result) {
                        _this.getUserFacbookConnexion(result);
                    }, { scope: 'email,user_photos,user_videos,public_profile,user_birthday,user_location' });
                };
                FacebookLogin = __decorate([
                    core_1.Component({
                        selector: 'facebook-login',
                        templateUrl: './src/client/app/login/facebookLogin/facebookLogin.html'
                    }),
                    __metadata('design:paramtypes', [platform_browser_1.Title, http_1.Http, router_1.Router, loginService_1.LoginService])
                ], FacebookLogin);
                return FacebookLogin;
            }());
            exports_1("FacebookLogin", FacebookLogin);
        }
    }
});
//# sourceMappingURL=facebookLogin.js.map
