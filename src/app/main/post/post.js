System.register(['@angular/core', '@angular/http', '@angular/router', '../../service/loginService', '../../beans/user', "@angular/platform-browser"], function(exports_1, context_1) {
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
    var Post;
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
            Post = (function () {
                function Post(title, route, http, router, loginService, changeDetector) {
                    var _this = this;
                    this.title = title;
                    this.route = route;
                    this.http = http;
                    this.router = router;
                    this.loginService = loginService;
                    this.changeDetector = changeDetector;
                    this.publicationBeanList = [];
                    this.user = new user_1.User();
                    this.wrongPost = false;
                    this.changeDetector.markForCheck();
                    if (this.loginService.isVisitor()) {
                        this.isVisitor = true;
                    }
                    else {
                        this.isVisitor = false;
                    }
                    this.router.events.subscribe(function (route) {
                        if (_this.route.snapshot.params['id'] != _this.lastRouterPostId) {
                            _this.lastRouterPostId = _this.route.snapshot.params['id'];
                            _this.postId = _this.route.snapshot.params['id'];
                            _this.changeDetector.markForCheck();
                        }
                    });
                }
                Post = __decorate([
                    core_1.Component({
                        selector: 'post',
                        templateUrl: './src/client/app/main/post/post.html',
                    }),
                    __metadata('design:paramtypes', [platform_browser_1.Title, router_2.ActivatedRoute, http_1.Http, router_1.Router, loginService_1.LoginService, core_1.ChangeDetectorRef])
                ], Post);
                return Post;
            }());
            exports_1("Post", Post);
        }
    }
});
//# sourceMappingURL=post.js.map
