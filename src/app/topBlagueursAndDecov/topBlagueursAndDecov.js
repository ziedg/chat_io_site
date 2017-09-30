System.register(['@angular/core', '@angular/http', '@angular/router', 'rxjs/add/operator/map', '../conf/app-settings', '../service/loginService', '../beans/user'], function(exports_1, context_1) {
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
    var core_1, http_1, router_1, app_settings_1, loginService_1, user_1;
    var TopBlagueursAndDecov;
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
            function (user_1_1) {
                user_1 = user_1_1;
            }],
        execute: function() {
            TopBlagueursAndDecov = (function () {
                function TopBlagueursAndDecov(http, router, loginService, changeDetector) {
                    this.http = http;
                    this.router = router;
                    this.loginService = loginService;
                    this.changeDetector = changeDetector;
                    this.topBlagueursDisplayList = [];
                    this.DecovDisplayList = [];
                    this.topBlagueursList = [];
                    this.DecovList = [];
                    this.user = new user_1.User();
                    this.nbBlagueursDisplayed = 0;
                    this.nbDecovDisplayed = 0;
                    this.nbMaxElements = 3;
                    loginService.actualize();
                    this.user = loginService.user;
                    this.loadtopBlagueursList();
                    this.loadDecovList();
                }
                TopBlagueursAndDecov.prototype.loadtopBlagueursList = function () {
                    var _this = this;
                    this.http.get(app_settings_1.AppSettings.SERVER_URL + 'getBlagueursPopulaires/?ProfileId=' + this.user._id, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                        _this.topBlagueursList = response.profiles;
                        for (var i = 0; i < _this.nbMaxElements && i < response.profiles.length; i++) {
                            _this.topBlagueursDisplayList[i] = _this.topBlagueursList[i];
                            _this.topBlagueursDisplayList[i].position = i;
                            _this.changeDetector.markForCheck();
                        }
                        _this.nbBlagueursDisplayed = _this.nbMaxElements;
                        _this.changeDetector.markForCheck();
                    }, function (err) {
                    }, function () {
                    });
                };
                TopBlagueursAndDecov.prototype.loadDecovList = function () {
                    var _this = this;
                    this.http.get(app_settings_1.AppSettings.SERVER_URL + 'getProfilesDecouvert/?ProfileId=' + this.user._id, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                        _this.DecovList = response.profiles;
                        for (var i = 0; i < _this.nbMaxElements && i < response.profiles.length; i++) {
                            _this.DecovDisplayList[i] = _this.DecovList[i];
                            _this.DecovDisplayList[i].position = i;
                            _this.changeDetector.markForCheck();
                        }
                        _this.nbDecovDisplayed = _this.nbMaxElements;
                        _this.changeDetector.markForCheck();
                    }, function (err) {
                    }, function () {
                    });
                };
                TopBlagueursAndDecov.prototype.doNotSubscribeUser = function (source, position, profileId, blag) {
                    var _this = this;
                    blag.isSubscribed = false;
                    if (source == "Decov") {
                        this.DecovDisplayList[position].isSubscribed = false;
                        this.DecovDisplayList[position].nbSuivi--;
                    }
                    else {
                        this.topBlagueursDisplayList[position].isSubscribed = false;
                        this.topBlagueursDisplayList[position].nbSuivi--;
                    }
                    this.changeDetector.markForCheck();
                    var body = JSON.stringify({
                        UserId: this.user._id,
                        profileId: profileId
                    });
                    this.http.post(app_settings_1.AppSettings.SERVER_URL + 'removeSubscribe', body, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                    }, function (err) { }, function () {
                        _this.changeDetector.markForCheck();
                    });
                };
                TopBlagueursAndDecov.prototype.subscribeUser = function (source, position, profileId, blag) {
                    var _this = this;
                    blag.isSubscribed = true;
                    if (source == "Decov") {
                        this.DecovDisplayList[position].isSubscribed = true;
                        this.DecovDisplayList[position].nbSuivi++;
                    }
                    else {
                        this.topBlagueursDisplayList[position].isSubscribed = true;
                        this.topBlagueursDisplayList[position].nbSuivi++;
                    }
                    this.changeDetector.markForCheck();
                    var body = JSON.stringify({
                        UserId: this.user._id,
                        profileId: profileId
                    });
                    this.http.post(app_settings_1.AppSettings.SERVER_URL + 'subscribe', body, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                        if (source == "Decov") {
                            if (_this.nbDecovDisplayed >= _this.DecovList.length) {
                            }
                            else {
                                _this.DecovDisplayList[position] = _this.DecovList[_this.nbDecovDisplayed];
                                _this.DecovDisplayList[position].position = position;
                                _this.DecovDisplayList[position].isSubscribed = false;
                                _this.nbDecovDisplayed++;
                            }
                        }
                        else {
                            if (_this.nbBlagueursDisplayed >= _this.topBlagueursList.length) {
                            }
                            else {
                                _this.topBlagueursDisplayList[position] = _this.topBlagueursList[_this.nbBlagueursDisplayed];
                                _this.topBlagueursDisplayList[position].position = position;
                                _this.topBlagueursDisplayList[position].isSubscribed = false;
                                _this.nbBlagueursDisplayed++;
                            }
                        }
                        _this.changeDetector.markForCheck();
                    }, function (err) { }, function () {
                        _this.changeDetector.markForCheck();
                    });
                };
                TopBlagueursAndDecov = __decorate([
                    core_1.Component({
                        selector: 'top-blagueurs-decov',
                        templateUrl: './src/client/app/topBlagueursAndDecov/topBlagueursAndDecov.html'
                    }),
                    __metadata('design:paramtypes', [http_1.Http, router_1.Router, loginService_1.LoginService, core_1.ChangeDetectorRef])
                ], TopBlagueursAndDecov);
                return TopBlagueursAndDecov;
            }());
            exports_1("TopBlagueursAndDecov", TopBlagueursAndDecov);
        }
    }
});
//# sourceMappingURL=topBlagueursAndDecov.js.map
