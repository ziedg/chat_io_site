System.register(['@angular/core', '@angular/http', '@angular/forms', '@angular/router', 'rxjs/add/operator/map', '../../conf/app-settings', '../../service/loginService', '../../utils/validationService', "@angular/platform-browser"], function(exports_1, context_1) {
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
    var core_1, http_1, forms_1, router_1, app_settings_1, loginService_1, validationService_1, platform_browser_1;
    var Signup;
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
            function (validationService_1_1) {
                validationService_1 = validationService_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            }],
        execute: function() {
            Signup = (function () {
                /* constructor */
                function Signup(title, http, router, loginService) {
                    this.title = title;
                    this.http = http;
                    this.router = router;
                    this.loginService = loginService;
                    this.errorMessage = null;
                    this.loadingSign = false;
                    this.title.setTitle("Inscription - Speegar");
                    if (this.loginService.isConnected()) {
                        this.router.navigate(['/main/home']);
                    }
                    this.form = new forms_1.FormGroup({
                        firstName: new forms_1.FormControl('', forms_1.Validators.required),
                        lastName: new forms_1.FormControl('', forms_1.Validators.required),
                        email: new forms_1.FormControl('', forms_1.Validators.compose([forms_1.Validators.required, validationService_1.emailValidator])),
                        password: new forms_1.FormControl('', forms_1.Validators.required)
                    });
                }
                /* signup */
                Signup.prototype.signup = function () {
                    var _this = this;
                    this.errorMessage = null;
                    this.form.controls.firstName._touched = true;
                    this.form.controls.lastName._touched = true;
                    this.form.controls.email._touched = true;
                    this.form.controls.password._touched = true;
                    if (this.form.value.lastName == "") {
                        this.errorMessage = "Le nom est obligatoire.";
                        return;
                    }
                    if (this.form.value.firstName == "") {
                        this.errorMessage = "Le prenom est obligatoire.";
                        return;
                    }
                    if (this.form.value.email == "") {
                        this.errorMessage = "L'email est obligatoire.";
                        return;
                    }
                    if (validationService_1.emailValidator(this.form.controls.email)) {
                        this.errorMessage = "L'email saisi est invalide.";
                        return;
                    }
                    if (this.form.value.password == "") {
                        this.errorMessage = "Le mot de passe est obligatoire.";
                        return;
                    }
                    if (this.form.value.password.length < 5) {
                        this.errorMessage = "Créez un mot de passe d’au moins 5 caractères.";
                        return;
                    }
                    this.loadingSign = true;
                    var body = JSON.stringify(this.form.value);
                    this.http.post(app_settings_1.AppSettings.SERVER_URL + 'signup', body, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                        if (response.status == "0") {
                            localStorage.setItem('token', response.token);
                            localStorage.setItem('user', JSON.stringify(response.user));
                            if (response.user.isNewInscri == "true") {
                                localStorage.setItem('isNewInscri', "true");
                            }
                            _this.loginService.actualize();
                            //AppSettings.Redirect('/main/home');
                            _this.router.navigate(['/main/home']);
                            _this.loadingSign = false;
                        }
                        else {
                            if (response.message == "Email existe deja") {
                                _this.errorMessage = "Un autre compte utilise " + _this.form.value.email;
                            }
                            else {
                                _this.errorMessage = response.message;
                            }
                            _this.loadingSign = false;
                        }
                    }, function (err) {
                        console.error(err);
                        _this.errorMessage = "Erreur technique.";
                        _this.loadingSign = false;
                    }, function () {
                    });
                };
                Signup = __decorate([
                    core_1.Component({
                        selector: 'sign-up',
                        templateUrl: './src/client/app/login/signup/signup.html'
                    }),
                    __metadata('design:paramtypes', [platform_browser_1.Title, http_1.Http, router_1.Router, loginService_1.LoginService])
                ], Signup);
                return Signup;
            }());
            exports_1("Signup", Signup);
        }
    }
});
//# sourceMappingURL=signup.js.map
