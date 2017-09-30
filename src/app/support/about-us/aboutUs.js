System.register(['@angular/core', '@angular/http', '@angular/router', "@angular/platform-browser"], function(exports_1, context_1) {
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
    var core_1, http_1, router_1, router_2, platform_browser_1;
    var AboutUs;
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
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            }],
        execute: function() {
            AboutUs = (function () {
                function AboutUs(title, route, http, router) {
                    this.title = title;
                    this.route = route;
                    this.http = http;
                    this.router = router;
                    this.title.setTitle("A propos de nous");
                }
                AboutUs = __decorate([
                    core_1.Component({
                        selector: 'about-us',
                        templateUrl: './src/client/app/support/about-us/aboutUs.html',
                        changeDetection: core_1.ChangeDetectionStrategy.OnPush
                    }),
                    __metadata('design:paramtypes', [platform_browser_1.Title, router_2.ActivatedRoute, http_1.Http, router_1.Router])
                ], AboutUs);
                return AboutUs;
            }());
            exports_1("AboutUs", AboutUs);
        }
    }
});
//# sourceMappingURL=aboutUs.js.map
