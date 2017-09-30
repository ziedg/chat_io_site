System.register(['@angular/core', '@angular/http', '@angular/router', 'rxjs/add/operator/map', '../../conf/app-settings', '../../service/loginService', "../../service/dateService", "../../beans/user"], function(exports_1, context_1) {
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
    var core_1, http_1, router_1, app_settings_1, loginService_1, dateService_1, user_1;
    var Notification;
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
            function (dateService_1_1) {
                dateService_1 = dateService_1_1;
            },
            function (user_1_1) {
                user_1 = user_1_1;
            }],
        execute: function() {
            Notification = (function () {
                function Notification(dateService, http, router, loginService, changeDetector) {
                    this.dateService = dateService;
                    this.http = http;
                    this.router = router;
                    this.loginService = loginService;
                    this.changeDetector = changeDetector;
                    this.lastNotifId = "";
                    this.showButtonMoreNotif = false;
                    this.showNoNotif = false;
                    this.user = new user_1.User();
                    this.noMoreNotif = false;
                    this.listNotif = [];
                    if (!this.loginService.isConnected()) {
                        if (this.loginService.isWasConnectedWithFacebook()) {
                            this.router.navigate(['/login/facebook-login']);
                        }
                        else {
                            this.router.navigate(['/login/sign-in']);
                        }
                    }
                    this.user = this.loginService.getUser();
                    this.loadFirstNotification();
                }
                Notification.prototype.loadFirstNotification = function () {
                    var _this = this;
                    this.lastNotifId = "";
                    this.showNoNotif = false;
                    if (this.user) {
                        this.http.get(app_settings_1.AppSettings.SERVER_URL + 'getNotifications?profileId=' + this.user._id + '&lastNotificationId=', app_settings_1.AppSettings.OPTIONS)
                            .map(function (res) { return res.json(); })
                            .subscribe(function (response) {
                            if (response.length) {
                                _this.listNotif = response;
                                _this.changeDetector.markForCheck();
                                _this.showNoNotif = false;
                                _this.lastNotifId = response[response.length - 1]._id;
                                _this.load5MoreNotif();
                            }
                            else {
                                _this.showNoNotif = true;
                            }
                        }, function (err) {
                        }, function () {
                            _this.changeDetector.markForCheck();
                            if (!_this.noMoreNotif) {
                                _this.load5MoreNotif();
                            }
                        });
                    }
                };
                Notification.prototype.load5MoreNotif = function () {
                    var _this = this;
                    this.http.get(app_settings_1.AppSettings.SERVER_URL + 'getNotifications?profileId=' + this.user._id + '&lastNotificationId=' + this.lastNotifId, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                        if (response.length) {
                            _this.noMoreNotif = false;
                            for (var i = 0; i < response.length; i++) {
                                _this.listNotif.push(response[i]);
                                _this.lastNotifId = response[i]._id;
                                _this.changeDetector.markForCheck();
                            }
                        }
                        else {
                            _this.noMoreNotif = true;
                        }
                    }, function (err) {
                    }, function () {
                        _this.changeDetector.markForCheck();
                    });
                };
                Notification.prototype.onScrollDown = function () {
                    if (this.showNoNotif || this.noMoreNotif) {
                        return 0;
                    }
                    this.load5MoreNotif();
                    this.changeDetector.markForCheck();
                };
                Notification.prototype.getNotificationTime = function (publishDateString) {
                    var date = new Date();
                    var currentDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
                    var publishDate = this.dateService.convertIsoToDate(publishDateString);
                    var displayedDate = "";
                    var diffDate = this.dateService.getdiffDate(publishDate, currentDate);
                    if (diffDate.day > 28) {
                        displayedDate = this.dateService.convertPublishDate(publishDate);
                    }
                    else if (diffDate.day && diffDate.day == 1) {
                        displayedDate = "hier";
                    }
                    else if (diffDate.day > 0) {
                        displayedDate = diffDate.day + " jour(s)";
                    }
                    else if ((diffDate.hour) && (diffDate.hour == 1)) {
                        displayedDate = "1 h";
                    }
                    else if ((diffDate.hour) && (diffDate.hour > 0)) {
                        displayedDate = diffDate.hour + " h";
                    }
                    else if ((diffDate.min) && (diffDate.min > 1))
                        displayedDate = diffDate.min + " min(s)";
                    else
                        displayedDate = "maintenant";
                    return displayedDate;
                };
                Notification.prototype.goTo = function (source, parm, notifId) {
                    var body = JSON.stringify({
                        notificationId: notifId
                    });
                    this.http.post(app_settings_1.AppSettings.SERVER_URL + 'setNotificationSeen ', body, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                    }, function (err) { }, function () { });
                    this.router.navigate(["/main/" + source, parm]);
                };
                Notification = __decorate([
                    core_1.Component({
                        selector: 'notification',
                        templateUrl: './src/client/app/main/notification/notification.html',
                        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
                    }),
                    __metadata('design:paramtypes', [dateService_1.DateService, http_1.Http, router_1.Router, loginService_1.LoginService, core_1.ChangeDetectorRef])
                ], Notification);
                return Notification;
            }());
            exports_1("Notification", Notification);
        }
    }
});
//# sourceMappingURL=notification.js.map
