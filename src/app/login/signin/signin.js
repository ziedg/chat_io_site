System.register(['@angular/core', '@angular/http', '@angular/forms', '@angular/router', 'rxjs/add/operator/map', '../../conf/app-settings', '../../service/loginService', "@angular/platform-browser"], function(exports_1, context_1) {
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
    var core_1, http_1, forms_1, router_1, app_settings_1, loginService_1, platform_browser_1;
    var Signin;
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
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            }],
        execute: function() {
            Signin = (function () {
                function Signin(title, http, router, loginService) {
                    this.title = title;
                    this.http = http;
                    this.router = router;
                    this.loginService = loginService;
                    this.errorMessage = null;
                    this.loadingSign = false;
                    this.title.setTitle("Connexion - Speegar");
                    this.form = new forms_1.FormGroup({
                        email: new forms_1.FormControl('', forms_1.Validators.required),
                        password: new forms_1.FormControl('', forms_1.Validators.required)
                    });
                    if (loginService.isConnected()) {
                        this.router.navigate(['/main/home']);
                    }
                }
                Signin.prototype.signin = function () {
                    var _this = this;
                    this.errorMessage = null;
                    this.form.controls.email._touched = true;
                    this.form.controls.password._touched = true;
                    if (this.form.value.email == "") {
                        this.errorMessage = "Saisissez votre Email.";
                        return;
                    }
                    if (this.form.value.password == "") {
                        this.errorMessage = "Saisissez votre mot de passe.";
                        return;
                    }
                    this.loadingSign = true;
                    var body = JSON.stringify(this.form.value);
                    this.http.post(app_settings_1.AppSettings.SERVER_URL + 'signin', body, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                        if (response.status == "0") {
                            localStorage.setItem('token', response.token);
                            localStorage.setItem('user', JSON.stringify(response.user));
                            _this.loginService.actualize();
                            _this.router.navigate(['/main/home']);
                            _this.loadingSign = false;
                        }
                        else {
                            if (response.message == "Authentication failed. User not found.") {
                                _this.errorMessage = "Le nom d’utilisateur entré n’appartient à aucun compte. Veuillez le vérifer et réessayer.";
                            }
                            else if (response.message == "Authentication failed. Wrong password.") {
                                _this.errorMessage = "Votre mot de passe est incorrect. Veuillez le vérifer.";
                            }
                            else {
                                _this.errorMessage = response.message;
                            }
                            _this.loadingSign = false;
                        }
                    }, function (err) {
                        _this.errorMessage = "Erreur technique.";
                        _this.loadingSign = false;
                    }, function () {
                    });
                };
                Signin.prototype.RedirectTo = function (link) {
                    app_settings_1.AppSettings.Redirect(link);
                };
                Signin = __decorate([
                    core_1.Component({
                        selector: 'sign-in',
                        templateUrl: './src/client/app/login/signin/signin.html'
                    }),
                    __metadata('design:paramtypes', [platform_browser_1.Title, http_1.Http, router_1.Router, loginService_1.LoginService])
                ], Signin);
                return Signin;
            }());
            exports_1("Signin", Signin);
        }
    }
});
//# sourceMappingURL=signin.js.map
