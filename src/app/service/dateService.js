System.register(['@angular/core', "../beans/diff-date-bean"], function(exports_1, context_1) {
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
    var core_1, diff_date_bean_1;
    var DateService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (diff_date_bean_1_1) {
                diff_date_bean_1 = diff_date_bean_1_1;
            }],
        execute: function() {
            /* beans */
            DateService = (function () {
                /* constructor  */
                function DateService() {
                }
                DateService.prototype.convertIsoToDate = function (isostr) {
                    if (!isostr)
                        return new Date(0);
                    var parts = isostr.match(/\d+/g);
                    var convertedDate = new Date();
                    convertedDate.setFullYear(+parts[0]);
                    convertedDate.setMonth(+parts[1] - 1);
                    convertedDate.setDate(+parts[2]);
                    convertedDate.setHours(+parts[3]);
                    convertedDate.setMinutes(+parts[4]);
                    convertedDate.setSeconds(+parts[5]);
                    return convertedDate;
                };
                DateService.prototype.getdiffDate = function (firstDate, secondDate) {
                    var diffDate = new diff_date_bean_1.DiffDateBean();
                    var tmp = secondDate.getTime() - firstDate.getTime();
                    tmp = Math.round(tmp / 1000);
                    tmp = Math.round((tmp - (tmp % 60)) / 60);
                    diffDate.min = tmp % 60;
                    tmp = Math.floor((tmp - diffDate.min) / 60);
                    diffDate.hour = tmp % 24;
                    tmp = Math.floor((tmp - diffDate.hour) / 24);
                    diffDate.day = tmp;
                    return diffDate;
                };
                DateService.prototype.convertPublishDate = function (publishDate) {
                    var currentDate = new Date();
                    var months = new Array("janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre");
                    var newDatePulish = publishDate.getDate() + " " + months[publishDate.getMonth()];
                    if (currentDate.getFullYear() != publishDate.getFullYear())
                        newDatePulish += ", " + publishDate.getFullYear();
                    return newDatePulish;
                };
                DateService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], DateService);
                return DateService;
            }());
            exports_1("DateService", DateService);
        }
    }
});
//# sourceMappingURL=dateService.js.map