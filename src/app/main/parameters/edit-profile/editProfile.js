System.register(['@angular/core', '@angular/http', '@angular/forms', '@angular/router', '../../../conf/app-settings', '../../../service/loginService', '../../../beans/user'], function(exports_1, context_1) {
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
    var core_1, http_1, forms_1, router_1, router_2, app_settings_1, loginService_1, user_1;
    var EditProfile;
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
            function (app_settings_1_1) {
                app_settings_1 = app_settings_1_1;
            },
            function (loginService_1_1) {
                loginService_1 = loginService_1_1;
            },
            function (user_1_1) {
                user_1 = user_1_1;
            }],
        execute: function() {
            EditProfile = (function () {
                function EditProfile(route, http, changeDetector, router, loginService) {
                    this.route = route;
                    this.http = http;
                    this.changeDetector = changeDetector;
                    this.router = router;
                    this.loginService = loginService;
                    this.user = new user_1.User();
                    this.errFistName = "";
                    this.errLastName = "";
                    this.errLinkFB = "";
                    this.errLinkYoutube = "";
                    this.errLinkTwitter = "";
                    if (loginService.isConnected()) {
                        loginService.actualize();
                        this.user = loginService.getUser();
                    }
                    else {
                        this.router.navigate(['/login/sign-in']);
                    }
                    this.form = new forms_1.FormGroup({
                        lastName: new forms_1.FormControl('', forms_1.Validators.required),
                        firstName: new forms_1.FormControl('', forms_1.Validators.required),
                        userDiscrip: new forms_1.FormControl(),
                        genre: new forms_1.FormControl(),
                        linkFB: new forms_1.FormControl(),
                        linkTwitter: new forms_1.FormControl(),
                        linkYoutube: new forms_1.FormControl()
                    });
                }
                EditProfile.prototype.ngOnInit = function () {
                    this.loginService.actualize();
                    this.user = this.loginService.getUser();
                    this.changeDetector.markForCheck();
                    console.log(this.user);
                };
                EditProfile.prototype.getFirstName = function () {
                    if (this.form.value.firstName) {
                        return this.form.value.firstName;
                    }
                    else {
                        return jQuery("#firstName").val();
                    }
                };
                EditProfile.prototype.checkFirstName = function () {
                    if (this.getFirstName() && this.getFirstName().length > 1) {
                        this.errFistName = "";
                        return true;
                    }
                    else {
                        this.errFistName = "Le prénom est obligatoire.";
                        return false;
                    }
                };
                EditProfile.prototype.getLastName = function () {
                    if (this.form.value.lastName) {
                        return this.form.value.lastName;
                    }
                    else {
                        return jQuery("#lastName").val();
                    }
                };
                EditProfile.prototype.getDisc = function () {
                    return jQuery("#userDiscrip").val();
                };
                EditProfile.prototype.getGerne = function () {
                    return jQuery("#genre").val();
                };
                EditProfile.prototype.getFBLink = function () {
                    return jQuery("#linkFB").val();
                };
                EditProfile.prototype.getYoutubeLink = function () {
                    return jQuery("#linkYoutube").val();
                };
                EditProfile.prototype.getTwitterLink = function () {
                    return jQuery("#linkTwitter").val();
                };
                EditProfile.prototype.checkLasttName = function () {
                    if (this.getLastName() && this.getLastName().length > 1) {
                        this.errLastName = "";
                        return true;
                    }
                    else {
                        this.errLastName = "Le nom est obligatoire.";
                        return false;
                    }
                };
                EditProfile.prototype.checkYoutubeLink = function () {
                    if (this.getYoutubeLink() && (this.getYoutubeLink().indexOf("https://www.youtube.com/") == 0 || this.getYoutubeLink().indexOf("https://youtube.com/") == 0 || this.getYoutubeLink().indexOf("http://www.youtube.com/") == 0 || this.getYoutubeLink().indexOf("http://youtube.com/") == 0)) {
                        this.errLinkYoutube = "";
                        return true;
                    }
                    else if (this.getYoutubeLink().length == 0) {
                        this.errLinkYoutube = "";
                        return true;
                    }
                    else {
                        this.errLinkYoutube = "Lien youtube erroné";
                        return false;
                    }
                };
                EditProfile.prototype.checkTwitterLink = function () {
                    if (this.getTwitterLink() && (this.getTwitterLink().indexOf("https://www.twitter.com/") == 0 || this.getTwitterLink().indexOf("https://twitter.com/") == 0 || this.getTwitterLink().indexOf("http://www.twitter.com/") == 0 || this.getTwitterLink().indexOf("http://twitter.com/") == 0)) {
                        this.errLinkTwitter = "";
                        return true;
                    }
                    else if (this.getTwitterLink().length == 0) {
                        this.errLinkTwitter = "";
                        return true;
                    }
                    else {
                        this.errLinkTwitter = "Lien twitter erroné";
                        return false;
                    }
                };
                EditProfile.prototype.checkFBLink = function () {
                    if (this.getFBLink() && (this.getFBLink().indexOf("https://www.facebook.com/") == 0 || this.getFBLink().indexOf("https://facebook.com/") == 0 || this.getFBLink().indexOf("http://www.facebook.com/") == 0 || this.getFBLink().indexOf("http://facebook.com/") == 0)) {
                        this.errLinkFB = "";
                        return true;
                    }
                    else if (this.getFBLink().length == 0) {
                        this.errLinkFB = "";
                        return true;
                    }
                    else {
                        this.errLinkFB = "Lien facebook erroné";
                        return false;
                    }
                };
                EditProfile.prototype.saveData = function () {
                    var _this = this;
                    if (this.checkFBLink() && this.checkFirstName() && this.checkLasttName() && this.checkTwitterLink() && this.checkYoutubeLink() && this.checkFBLink()) {
                        var gender = "";
                        if (this.getGerne() == "Homme") {
                            gender = "male";
                        }
                        else if (this.getGerne() == "Femme") {
                            gender = "female";
                        }
                        console.log(this.getGerne());
                        console.log(gender);
                        var body = JSON.stringify({
                            profileId: this.user._id,
                            firstName: this.getFirstName(),
                            lastName: this.getLastName(),
                            facebookLink: this.getFBLink(),
                            twitterLink: this.getTwitterLink(),
                            youtubeLink: this.getYoutubeLink(),
                            gender: gender,
                            about: this.getDisc()
                        });
                        this.http.post(app_settings_1.AppSettings.SERVER_URL + 'updateProfile', body, app_settings_1.AppSettings.OPTIONS)
                            .map(function (res) { return res.json(); })
                            .subscribe(function (response) {
                            console.log(response.profile);
                            if (response.status == 1) {
                                _this.loginService.updateUser(response.profile);
                                _this.loginService.actualize();
                                _this.user = _this.loginService.getUser();
                                _this.changeDetector.markForCheck();
                                swal({
                                    title: "Modifié!",
                                    text: "votre profil a été modifié",
                                    type: "success",
                                    timer: 2000,
                                    showConfirmButton: false
                                }).then(function () { }, function (dismiss) { });
                            }
                        }, function (err) { }, function () {
                        });
                    }
                };
                EditProfile = __decorate([
                    core_1.Component({
                        selector: 'edit-profile',
                        templateUrl: './src/client/app/main/parameters/edit-profile/editProfile.html',
                        changeDetection: core_1.ChangeDetectionStrategy.OnPush
                    }),
                    __metadata('design:paramtypes', [router_2.ActivatedRoute, http_1.Http, core_1.ChangeDetectorRef, router_1.Router, loginService_1.LoginService])
                ], EditProfile);
                return EditProfile;
            }());
            exports_1("EditProfile", EditProfile);
        }
    }
});
//# sourceMappingURL=editProfile.js.map
