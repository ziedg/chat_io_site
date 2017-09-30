System.register(['@angular/core', '@angular/router', '@angular/common', 'rxjs/add/operator/map', '../service/loginService', '../beans/user', "../conf/app-settings", "@angular/http", "../service/recentRechService", "../service/dateService"], function(exports_1, context_1) {
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
    var core_1, router_1, common_1, loginService_1, user_1, app_settings_1, http_1, recentRechService_1, dateService_1;
    var Main;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (_1) {},
            function (loginService_1_1) {
                loginService_1 = loginService_1_1;
            },
            function (user_1_1) {
                user_1 = user_1_1;
            },
            function (app_settings_1_1) {
                app_settings_1 = app_settings_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (recentRechService_1_1) {
                recentRechService_1 = recentRechService_1_1;
            },
            function (dateService_1_1) {
                dateService_1 = dateService_1_1;
            }],
        execute: function() {
            Main = (function () {
                function Main(dateService, http, location, router, loginService, changeDetector, recentRechService) {
                    this.dateService = dateService;
                    this.http = http;
                    this.location = location;
                    this.router = router;
                    this.loginService = loginService;
                    this.changeDetector = changeDetector;
                    this.recentRechService = recentRechService;
                    //Variables declaration
                    this.autocomplete = false;
                    this.notification = false;
                    this.signoutHover = false;
                    this.user = new user_1.User();
                    this.listSearshUsers = [];
                    this.lastNotifId = "";
                    this.showButtonMoreNotif = false;
                    this.showNoNotif = false;
                    this.isVisitor = true;
                    this.linkHome = "";
                    this.listNotif = [];
                    this.linkHome = app_settings_1.AppSettings.SITE_URL + "main/home";
                    this.user = this.loginService.getVisitor();
                    if (loginService.isVisitor()) {
                        this.isVisitor = true;
                        this.user = this.loginService.getVisitor();
                    }
                    else {
                        this.isVisitor = false;
                        if (!this.recentRechService.isEmptyList())
                            this.RecentSearchList = this.recentRechService.getListRecentRech();
                        this.showButtonMoreNotif = false;
                        this.listNotif = [];
                        this.user = this.loginService.getUser();
                        this.loadNotif();
                    }
                }
                Main.prototype.loadNotif = function () {
                    var _this = this;
                    if (this.user && !this.isVisitor) {
                        if (this.user._id) {
                            setInterval(function () {
                                _this.http.get(app_settings_1.AppSettings.SERVER_URL + 'getNbNotificationsNotSeen?profileId=' + _this.user._id, app_settings_1.AppSettings.OPTIONS)
                                    .map(function (res) { return res.json(); })
                                    .subscribe(function (response) {
                                    if (!response.status) {
                                        if (response.nbNotificationsNotSeen > _this.nbNoSeenNotif) {
                                            var snd = new Audio('./assets/music/notification.mp3');
                                            snd.play();
                                        }
                                        _this.nbNoSeenNotif = response.nbNotificationsNotSeen;
                                    }
                                }, function (err) {
                                }, function () {
                                    _this.changeDetector.markForCheck();
                                });
                            }, 5000);
                        }
                    }
                };
                Main.prototype.saveRecentRech = function (_id, firstName, lastName, profilePicture, profilePictureMin) {
                    var newRechUser = {};
                    newRechUser = JSON.stringify({
                        _id: _id,
                        firstName: firstName,
                        lastName: lastName,
                        profilePicture: profilePicture,
                        profilePictureMin: profilePictureMin
                    });
                    this.recentRechService.addToListRecentRech(JSON.parse(newRechUser));
                    this.changeDetector.markForCheck();
                    this.disableAutocomplete();
                    this.RecentSearchList = this.recentRechService.getListRecentRech();
                    this.router.navigate(['/main/profile', _id]);
                };
                Main.prototype.onChange = function (newValue) {
                    this.listSearshUsers = [];
                    this.enableAutocomplete();
                    this.changeDetector.markForCheck();
                    if (newValue.length > 1) {
                        this.getListSearchUsers(newValue);
                    }
                    else {
                        if (this.recentRechService.isEmptyList()) {
                            this.disableAutocomplete();
                        }
                        else {
                            this.showRecentSearchUsers();
                        }
                    }
                    this.changeDetector.markForCheck();
                };
                Main.prototype.showRecentSearchUsers = function () {
                    if (this.recentRechService.isEmptyList()) {
                        this.disableAutocomplete();
                        this.showRecentSearch = false;
                    }
                    else {
                        this.enableAutocomplete();
                        this.RecentSearchList = this.recentRechService.getListRecentRech();
                        this.showRecentSearch = true;
                    }
                    this.changeDetector.markForCheck();
                };
                Main.prototype.goHome = function () {
                    this.router.navigate(['/main/home']);
                };
                Main.prototype.getListSearchUsers = function (key) {
                    var _this = this;
                    this.showRecentSearch = false;
                    this.http.get(app_settings_1.AppSettings.SERVER_URL + 'findProfile?ProfileName=' + key, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                        _this.listSearshUsers = [];
                        _this.changeDetector.markForCheck();
                        for (var i = 0; i < _this.listSearshUsers.length; i++) {
                            _this.listSearshUsers.pop();
                            _this.changeDetector.markForCheck();
                        }
                        if (response.status == 1) {
                            if (response.profiles)
                                for (var i = 0; i < response.profiles.length; i++) {
                                    _this.listSearshUsers[i] = response.profiles[i];
                                    _this.changeDetector.markForCheck();
                                }
                        }
                    }, function (err) {
                    }, function () {
                        if (_this.listSearshUsers.length == 0) {
                            _this.disableAutocomplete();
                        }
                        _this.changeDetector.markForCheck();
                    });
                };
                Main.prototype.checkAutoComplete = function () {
                    if (this.searchValue && this.searchValue.length > 1) {
                        this.getListSearchUsers(this.searchValue);
                    }
                    else {
                        this.enableAutocomplete();
                        this.showRecentSearchUsers();
                    }
                };
                Main.prototype.enableAutocomplete = function () {
                    jQuery(".recherche-results-holder").show();
                    jQuery(".upper-arrow-search").show();
                    this.changeDetector.markForCheck();
                };
                Main.prototype.disableAutocomplete = function () {
                    jQuery(".recherche-results-holder").hide();
                    jQuery(".upper-arrow-search").hide();
                };
                Main.prototype.showFirstNotif = function () {
                    this.loadFirstNotifactions();
                    this.enableNotification();
                };
                Main.prototype.enableNotification = function () {
                    jQuery(".notification-holder").toggle();
                    jQuery(".upper-arrow-notification").toggle();
                };
                Main.prototype.enableProfile = function () {
                    jQuery(".profile-hover").toggle();
                    jQuery(".upper-arrow-profile").toggle();
                };
                Main.prototype.ngOnInit = function () {
                    var _this = this;
                    jQuery((".recherche-results-holder")).blur(function () {
                        jQuery((".file-input-holder")).hide();
                    });
                    setInterval(function () {
                        _this.changeDetector.markForCheck();
                    }, 500);
                    jQuery(document).click(function (e) {
                        // check that your clicked
                        // element has no id=info
                        if (jQuery(e.target).closest(".recherche-results-holder").length === 0 && jQuery(e.target).closest(".header-center").length === 0) {
                            jQuery(".recherche-results-holder").hide();
                            jQuery(".upper-arrow-search").hide();
                        }
                        if (jQuery(e.target).closest(".notification-holder").length === 0 && jQuery(e.target).closest(".notification-parent").length === 0) {
                            jQuery(".notification-holder").hide();
                            jQuery(".upper-arrow-notification").hide();
                        }
                        if (jQuery(e.target).closest(".fa-sort-desc").length === 0) {
                            jQuery(".profile-hover").hide();
                            jQuery(".upper-arrow-profile").hide();
                        }
                    });
                };
                Main.prototype.loadFirstNotifactions = function () {
                    var _this = this;
                    this.lastNotifId = "";
                    this.showButtonMoreNotif = false;
                    this.showNoNotif = false;
                    if (this.user && !this.isVisitor) {
                        this.http.get(app_settings_1.AppSettings.SERVER_URL + 'getNotifications?profileId=' + this.user._id + '&lastNotificationId=', app_settings_1.AppSettings.OPTIONS)
                            .map(function (res) { return res.json(); })
                            .subscribe(function (response) {
                            if (response.length) {
                                _this.showNoNotif = false;
                                _this.listNotif = response;
                                _this.lastNotifId = response[response.length - 1]._id;
                                _this.http.get(app_settings_1.AppSettings.SERVER_URL + 'getNotifications?profileId=' + _this.user._id + '&lastNotificationId=' + _this.lastNotifId, app_settings_1.AppSettings.OPTIONS)
                                    .map(function (res) { return res.json(); })
                                    .subscribe(function (response) {
                                    if (response.length == 0) {
                                        _this.showButtonMoreNotif = false;
                                    }
                                    else {
                                        _this.showButtonMoreNotif = true;
                                    }
                                }, function (err) {
                                }, function () {
                                    _this.changeDetector.markForCheck();
                                });
                            }
                            else {
                                _this.listNotif = [];
                                _this.showNoNotif = true;
                                _this.showButtonMoreNotif = false;
                            }
                        }, function (err) {
                        }, function () {
                            _this.changeDetector.markForCheck();
                        });
                        this.changeDetector.markForCheck();
                    }
                };
                Main.prototype.loadMoreNotif = function () {
                    var _this = this;
                    if (this.user && !this.isVisitor) {
                        jQuery(".notification-holder").show();
                        jQuery(".upper-arrow-notification").show();
                        this.http.get(app_settings_1.AppSettings.SERVER_URL + 'getNotifications?profileId=' + this.user._id + '&lastNotificationId=' + this.lastNotifId, app_settings_1.AppSettings.OPTIONS)
                            .map(function (res) { return res.json(); })
                            .subscribe(function (response) {
                            if (response.length != 0) {
                                for (var i = 0; i < response.length; i++) {
                                    _this.listNotif.push(response[i]);
                                    _this.lastNotifId = response[i]._id;
                                }
                                _this.http.get(app_settings_1.AppSettings.SERVER_URL + 'getNotifications?profileId=' + _this.user._id + '&lastNotificationId=' + _this.lastNotifId, app_settings_1.AppSettings.OPTIONS)
                                    .map(function (res) { return res.json(); })
                                    .subscribe(function (response) {
                                    if (response.length == 0) {
                                        _this.showButtonMoreNotif = false;
                                    }
                                    else {
                                        _this.showButtonMoreNotif = true;
                                    }
                                }, function (err) {
                                }, function () {
                                    _this.changeDetector.markForCheck();
                                });
                            }
                            else {
                                _this.showButtonMoreNotif = false;
                            }
                        }, function (err) {
                        }, function () {
                            _this.changeDetector.markForCheck();
                        });
                        this.changeDetector.markForCheck();
                        jQuery(".notification-holder").show();
                        jQuery(".upper-arrow-notification").show();
                    }
                };
                Main.prototype.getNotificationTime = function (publishDateString) {
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
                        displayedDate = diffDate.day + " jours";
                    }
                    else if ((diffDate.hour) && (diffDate.hour == 1)) {
                        displayedDate = "1 h";
                    }
                    else if ((diffDate.hour) && (diffDate.hour > 0)) {
                        displayedDate = diffDate.hour + " hrs";
                    }
                    else if ((diffDate.min) && (diffDate.min > 1))
                        displayedDate = diffDate.min + " mins";
                    else
                        displayedDate = "maintenant";
                    return displayedDate;
                };
                Main.prototype.goTo = function (source, parm, notifId) {
                    var body = JSON.stringify({
                        notificationId: notifId
                    });
                    this.http.post(app_settings_1.AppSettings.SERVER_URL + 'setNotificationSeen ', body, app_settings_1.AppSettings.OPTIONS)
                        .map(function (res) { return res.json(); })
                        .subscribe(function (response) {
                    }, function (err) { }, function () { });
                    this.router.navigate(["/main/" + source, parm]);
                };
                Main = __decorate([
                    core_1.Component({
                        selector: 'main',
                        templateUrl: './src/client/app/main/main.html'
                    }),
                    __metadata('design:paramtypes', [dateService_1.DateService, http_1.Http, common_1.Location, router_1.Router, loginService_1.LoginService, core_1.ChangeDetectorRef, recentRechService_1.RecentRechService])
                ], Main);
                return Main;
            }());
            exports_1("Main", Main);
        }
    }
});
//# sourceMappingURL=main.js.map
