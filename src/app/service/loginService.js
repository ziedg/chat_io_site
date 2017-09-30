System.register(['@angular/core', '@angular/router', './../beans/user'], function(exports_1, context_1) {
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
    var core_1, router_1, user_1;
    var LoginService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (user_1_1) {
                user_1 = user_1_1;
            }],
        execute: function() {
            LoginService = (function () {
                /* constructor  */
                function LoginService(router) {
                    this.router = router;
                    /*Visitor User */
                    this.visitor = new user_1.User();
                    this.actualize();
                }
                /* isConnected  */
                LoginService.prototype.isConnected = function () {
                    if (localStorage.getItem('token')) {
                        return true;
                    }
                    return false;
                };
                /* isWasConnectedWithFacebook */
                LoginService.prototype.isWasConnectedWithFacebook = function () {
                    if (localStorage.getItem('facebookUser')) {
                        return true;
                    }
                    return false;
                };
                LoginService.prototype.isWasConnectedWithGoogle = function () {
                    if (localStorage.getItem('googleUser')) {
                        return true;
                    }
                    return false;
                };
                /* getFacebookUser */
                LoginService.prototype.getFacebookUser = function () {
                    if (this.isWasConnectedWithFacebook()) {
                        return JSON.parse(localStorage.getItem('facebookUser'));
                    }
                    return null;
                };
                /* actualize */
                LoginService.prototype.actualize = function () {
                    if (this.isConnected()) {
                        this.token = localStorage.getItem('token');
                        this.user = JSON.parse(localStorage.getItem('user'));
                    }
                    else {
                        this.user = this.getVisitor();
                    }
                };
                /* updateUser */
                LoginService.prototype.updateUser = function (user) {
                    this.user = user;
                    localStorage.setItem('user', JSON.stringify(user));
                };
                /* setToken */
                LoginService.prototype.setToken = function (token) {
                    this.token = token;
                    localStorage.setItem('token', token);
                };
                /* getToken */
                LoginService.prototype.getToken = function () {
                    return this.token;
                };
                /* getUser */
                LoginService.prototype.getUser = function () {
                    this.user = JSON.parse(localStorage.getItem('user'));
                    return this.user;
                };
                /*visitorUser*/
                LoginService.prototype.getVisitor = function () {
                    this.visitor._id = 0;
                    this.visitor.firstName = "Visiteur";
                    this.visitor.lastName = "";
                    this.visitor.profilePicture = "http://91.121.69.130/speegar/assets/pictures/man.png";
                    this.visitor.profilePictureMin = "http://91.121.69.130/speegar/assets/pictures/manMin.png";
                    return this.visitor;
                };
                LoginService.prototype.isVisitor = function () {
                    this.actualize();
                    if (this.user) {
                        if (this.user._id == 0) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        return false;
                    }
                };
                /* deconnexion */
                LoginService.prototype.logout = function () {
                    if (this.isConnected()) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                    }
                    if (localStorage.getItem('lastConnexionMethod')) {
                        if (localStorage.getItem('lastConnexionMethod') == "g+") {
                            this.router.navigate(['/login/google-login']);
                        }
                        else if (localStorage.getItem('lastConnexionMethod') == "fb") {
                            this.router.navigate(['/login/facebook-login']);
                        }
                        else if (localStorage.getItem('lastConnexionMethod') == "nr") {
                            this.router.navigate(['/login/sign-in']);
                        }
                        else {
                            this.router.navigate(['/login/sign-in']);
                        }
                    }
                    else {
                        this.router.navigate(['/login/sign-in']);
                    }
                };
                /* redirect */
                LoginService.prototype.redirect = function () {
                    if (!this.isConnected()) {
                        if (this.isWasConnectedWithFacebook()) {
                            this.router.navigate(['/login/facebook-login']);
                        }
                        else {
                            this.router.navigate(['/login/sign-in']);
                        }
                    }
                };
                LoginService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [router_1.Router])
                ], LoginService);
                return LoginService;
            }());
            exports_1("LoginService", LoginService);
        }
    }
});
//# sourceMappingURL=loginService.js.map