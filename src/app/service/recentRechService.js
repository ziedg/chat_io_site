System.register(['@angular/core'], function(exports_1, context_1) {
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
    var core_1;
    var RecentRechBeans, RecentRechService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            /* beans */
            /* class Recent Users Rech */
            RecentRechBeans = (function () {
                function RecentRechBeans() {
                }
                return RecentRechBeans;
            }());
            RecentRechService = (function () {
                /* constructor  */
                function RecentRechService() {
                    this.listRecentRech = [];
                    this.nbMaxRecentRecElement = 5;
                    this.actualize();
                }
                RecentRechService.prototype.actualize = function () {
                    if (localStorage.getItem('recentRechList')) {
                        this.listRecentRech = JSON.parse(localStorage.getItem('recentRechList'));
                    }
                    else {
                        this.listRecentRech = [];
                    }
                };
                RecentRechService.prototype.getListRecentRech = function () {
                    this.actualize();
                    return this.listRecentRech;
                };
                RecentRechService.prototype.isEmptyList = function () {
                    this.actualize();
                    return this.listRecentRech.length == 0;
                };
                RecentRechService.prototype.addToListRecentRech = function (newRechUser) {
                    this.actualize();
                    if (this.isEmptyList()) {
                        this.listRecentRech.unshift(newRechUser);
                    }
                    else {
                        for (var i = 0; i < this.listRecentRech.length; i++) {
                            if (this.listRecentRech[i]._id == newRechUser._id) {
                                this.listRecentRech.splice(i, 1);
                                break;
                            }
                        }
                        this.listRecentRech.unshift(newRechUser);
                        while (this.listRecentRech.length > this.nbMaxRecentRecElement) {
                            this.listRecentRech.splice(this.nbMaxRecentRecElement - 1, 1);
                        }
                    }
                    localStorage.setItem('recentRechList', JSON.stringify(this.listRecentRech));
                };
                RecentRechService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], RecentRechService);
                return RecentRechService;
            }());
            exports_1("RecentRechService", RecentRechService);
        }
    }
});
//# sourceMappingURL=recentRechService.js.map