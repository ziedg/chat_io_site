System.register(['@angular/http', '@angular/router', "../service/loginService", "@angular/core"], function(exports_1, context_1) {
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
    var http_1, router_1, loginService_1, core_1;
    var Logout;
    return {
        setters:[
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (loginService_1_1) {
                loginService_1 = loginService_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            Logout = (function () {
                function Logout(http, router, loginService) {
                    this.http = http;
                    this.router = router;
                    this.loginService = loginService;
                    this.loginService.logout();
                }
                Logout = __decorate([
                    core_1.Component({
                        selector: 'logout',
                        template: ''
                    }), 
                    __metadata('design:paramtypes', [http_1.Http, router_1.Router, loginService_1.LoginService])
                ], Logout);
                return Logout;
            }());
            exports_1("Logout", Logout);
        }
    }
});
//# sourceMappingURL=logout.js.map