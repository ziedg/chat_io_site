System.register(['@angular/core', '@angular/http', '@angular/router', '@angular/common', '../service/loginService', '../beans/user', "@angular/platform-browser"], function(exports_1, context_1) {
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
    var core_1, http_1, router_1, router_2, common_1, loginService_1, user_1, platform_browser_1;
    var Support;
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
                router_2 = router_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (loginService_1_1) {
                loginService_1 = loginService_1_1;
            },
            function (user_1_1) {
                user_1 = user_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            }],
        execute: function() {
            Support = (function () {
                function Support(_loc, title, route, http, router, loginService, changeDetector) {
                    this._loc = _loc;
                    this.title = title;
                    this.route = route;
                    this.http = http;
                    this.router = router;
                    this.loginService = loginService;
                    this.changeDetector = changeDetector;
                    this.user = new user_1.User();
                    this.isConnected = false;
                    if (loginService.isConnected()) {
                        loginService.actualize();
                        this.user = loginService.user;
                        this.isConnected = true;
                    }
                    else {
                        this.isConnected = false;
                    }
                }
                Support.prototype.ngOnInit = function () {
                    this.currentLocation = this._loc.path();
                    if (this.currentLocation == "/support/about-us") {
                        jQuery("#aboutUsTab").show();
                    }
                    if (this.currentLocation == "/support/cgu") {
                        jQuery("#cguTab").show();
                    }
                    if (this.currentLocation == "/support/team") {
                        jQuery("#teamTab").show();
                    }
                };
                Support.prototype.collapse = function (a) {
                    jQuery(".support-mobile-tab").hide();
                    switch (a) {
                        case 0:
                            jQuery("#aboutUsTab").slideDown(500);
                            break;
                        case 1:
                            jQuery("#cguTab").slideDown(500);
                            break;
                        case 2:
                            jQuery("#teamTab").slideDown(500);
                            break;
                    }
                };
                Support = __decorate([
                    core_1.Component({
                        selector: 'support',
                        templateUrl: './src/client/app/support/support.html',
                        changeDetection: core_1.ChangeDetectionStrategy.OnPush
                    }),
                    __metadata('design:paramtypes', [common_1.Location, platform_browser_1.Title, router_2.ActivatedRoute, http_1.Http, router_1.Router, loginService_1.LoginService, core_1.ChangeDetectorRef])
                ], Support);
                return Support;
            }());
            exports_1("Support", Support);
        }
    }
});
//# sourceMappingURL=support.js.map
