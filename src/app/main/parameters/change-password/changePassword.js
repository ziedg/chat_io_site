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
    var ChangePassword;
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
            ChangePassword = (function () {
                function ChangePassword(changeDetector, route, http, router, loginService) {
                    this.changeDetector = changeDetector;
                    this.route = route;
                    this.http = http;
                    this.router = router;
                    this.loginService = loginService;
                    this.user = new user_1.User();
                    this.errNewPass2 = "";
                    this.errNewPass1 = "";
                    this.errOldPass = "";
                    if (loginService.isConnected()) {
                        loginService.actualize();
                        this.user = loginService.user;
                    }
                    else {
                        this.router.navigate(['/login/sign-in']);
                    }
                    this.form = new forms_1.FormGroup({
                        oldPass: new forms_1.FormControl('', forms_1.Validators.required),
                        newPass1: new forms_1.FormControl('', forms_1.Validators.required),
                        newPass2: new forms_1.FormControl('', forms_1.Validators.required),
                    });
                }
                ChangePassword.prototype.saveData = function () {
                    var _this = this;
                    var oldPass = this.form.value.oldPass;
                    var newPass1 = this.form.value.newPass1;
                    var newPass2 = this.form.value.newPass2;
                    if (newPass1 < 5) {
                        this.errNewPass1 = "Créez un mot de passe d’au moins 5 caractères.";
                        return;
                    }
                    else {
                        this.errNewPass1 = "";
                    }
                    if (newPass2 < 5 || newPass1 != newPass2) {
                        this.errNewPass2 = "Les deux mots de passe ne sont pas identiques.";
                        return;
                    }
                    else {
                        this.errNewPass2 = "";
                    }
                    this.changeDetector.markForCheck();
                    var body = JSON.stringify({
                        profileId: this.user._id,
                        oldPassword: oldPass,
                        newPassword: newPass1
                    });
                    this.http.post(app_settings_1.AppSettings.SERVER_URL + 'updatePassword', body, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                        if (response.status == 0) {
                            _this.errOldPass = "Mot de passe irroné";
                            _this.changeDetector.markForCheck();
                        }
                        else {
                            _this.errOldPass = "";
                            swal({
                                title: "Modifié!",
                                text: "votre mot de passe a éte actualisé",
                                type: "success",
                                timer: 2000,
                                showConfirmButton: false
                            }).then(function () { }, function (dismiss) { });
                        }
                    }, function (err) { }, function () {
                        _this.changeDetector.markForCheck();
                    });
                };
                ChangePassword = __decorate([
                    core_1.Component({
                        selector: 'change-password',
                        templateUrl: './src/client/app/main/parameters/change-password/changePassword.html',
                        changeDetection: core_1.ChangeDetectionStrategy.OnPush
                    }),
                    __metadata('design:paramtypes', [core_1.ChangeDetectorRef, router_2.ActivatedRoute, http_1.Http, router_1.Router, loginService_1.LoginService])
                ], ChangePassword);
                return ChangePassword;
            }());
            exports_1("ChangePassword", ChangePassword);
        }
    }
});
//# sourceMappingURL=changePassword.js.map
