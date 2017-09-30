System.register(['@angular/core', '@angular/http', '@angular/router', 'rxjs/add/operator/map', '../../service/loginService', '../../beans/user', "@angular/platform-browser"], function(exports_1, context_1) {
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
    var core_1, http_1, router_1, router_2, loginService_1, user_1, platform_browser_1;
    var Parameters;
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
            function (_1) {},
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
            Parameters = (function () {
                function Parameters(title, route, http, router, loginService, changeDetector) {
                    this.title = title;
                    this.route = route;
                    this.http = http;
                    this.router = router;
                    this.loginService = loginService;
                    this.changeDetector = changeDetector;
                    this.user = new user_1.User();
                    this.title.setTitle("Modifier profile - Speegar");
                    if (loginService.isConnected()) {
                        loginService.actualize();
                        this.user = loginService.user;
                    }
                    else {
                        this.router.navigate(['/login/sign-in']);
                    }
                }
                Parameters = __decorate([
                    core_1.Component({
                        selector: 'parameters',
                        templateUrl: './src/client/app/main/parameters/parameters.html',
                        changeDetection: core_1.ChangeDetectionStrategy.OnPush
                    }),
                    __metadata('design:paramtypes', [platform_browser_1.Title, router_2.ActivatedRoute, http_1.Http, router_1.Router, loginService_1.LoginService, core_1.ChangeDetectorRef])
                ], Parameters);
                return Parameters;
            }());
            exports_1("Parameters", Parameters);
        }
    }
});
//# sourceMappingURL=parameters.js.map
