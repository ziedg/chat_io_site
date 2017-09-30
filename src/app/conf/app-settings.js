System.register(['@angular/http'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var http_1;
    var AppSettings;
    return {
        setters:[
            function (http_1_1) {
                http_1 = http_1_1;
            }],
        execute: function() {
            AppSettings = (function () {
                function AppSettings() {
                }
                Object.defineProperty(AppSettings, "OPTIONS", {
                    get: function () {
                        var headers = new http_1.Headers();
                        headers.append('Accept', 'application/json');
                        headers.append('Content-Type', 'application/json; charset=UTF-8');
                        //headers.append('token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwiZ2V0dGVycyI6e30sIndhc1BvcHVsYXRlZCI6ZmFsc2UsImFjdGl2ZVBhdGhzIjp7InBhdGhzIjp7Im5vdGlmaWNhdGlvbnMiOiJpbml0IiwicGljdHVyZXMiOiJpbml0IiwicHVibGljYXRpb25zIjoiaW5pdCIsInN1YnNjcmliZXJzIjoiaW5pdCIsImVtYWlsIjoiaW5pdCIsInBhc3N3b3JkIjoiaW5pdCIsIm5iU3Vic2NyaWJlcnMiOiJpbml0IiwibmJMaWtlcyI6ImluaXQiLCJfaWQiOiJpbml0In0sInN0YXRlcyI6eyJkZWZhdWx0Ijp7fSwiaW5pdCI6eyJub3RpZmljYXRpb25zIjp0cnVlLCJwaWN0dXJlcyI6dHJ1ZSwicHVibGljYXRpb25zIjp0cnVlLCJzdWJzY3JpYmVycyI6dHJ1ZSwiZW1haWwiOnRydWUsInBhc3N3b3JkIjp0cnVlLCJuYlN1YnNjcmliZXJzIjp0cnVlLCJuYkxpa2VzIjp0cnVlLCJfaWQiOnRydWV9LCJtb2RpZnkiOnt9LCJyZXF1aXJlIjp7fX0sInN0YXRlTmFtZXMiOlsicmVxdWlyZSIsIm1vZGlmeSIsImluaXQiLCJkZWZhdWx0Il19fSwiaXNOZXciOmZhbHNlLCJfbWF4TGlzdGVuZXJzIjowLCJfZG9jIjp7Im5vdGlmaWNhdGlvbnMiOltdLCJwaWN0dXJlcyI6W10sInB1YmxpY2F0aW9ucyI6W10sInN1YnNjcmliZXJzIjpbXSwiZW1haWwiOiJoYW16YSIsInBhc3N3b3JkIjoiMjYyNiIsIm5iU3Vic2NyaWJlcnMiOjAsIm5iTGlrZXMiOjAsIl9pZCI6IjU3ODRkYWM1YTdiZWU5MTgwZjAwMDAwNCJ9LCJfcHJlcyI6eyJzYXZlIjpbbnVsbCxudWxsLG51bGxdfSwiX3Bvc3RzIjp7InNhdmUiOltdfSwiaWF0IjoxNDY4NDA3MjExfQ.A8Z8XpSkuZsLuc4aUXLZ4UaVVD3zNjsg9kA8W_aP7Jk');
                        return new http_1.RequestOptions({ headers: headers });
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AppSettings, "OPTIONS_POST", {
                    get: function () {
                        var headers_post = new http_1.Headers();
                        //headers_post.append('token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwiZ2V0dGVycyI6e30sIndhc1BvcHVsYXRlZCI6ZmFsc2UsImFjdGl2ZVBhdGhzIjp7InBhdGhzIjp7Im5vdGlmaWNhdGlvbnMiOiJpbml0IiwicGljdHVyZXMiOiJpbml0IiwicHVibGljYXRpb25zIjoiaW5pdCIsInN1YnNjcmliZXJzIjoiaW5pdCIsImVtYWlsIjoiaW5pdCIsInBhc3N3b3JkIjoiaW5pdCIsIm5iU3Vic2NyaWJlcnMiOiJpbml0IiwibmJMaWtlcyI6ImluaXQiLCJfaWQiOiJpbml0In0sInN0YXRlcyI6eyJkZWZhdWx0Ijp7fSwiaW5pdCI6eyJub3RpZmljYXRpb25zIjp0cnVlLCJwaWN0dXJlcyI6dHJ1ZSwicHVibGljYXRpb25zIjp0cnVlLCJzdWJzY3JpYmVycyI6dHJ1ZSwiZW1haWwiOnRydWUsInBhc3N3b3JkIjp0cnVlLCJuYlN1YnNjcmliZXJzIjp0cnVlLCJuYkxpa2VzIjp0cnVlLCJfaWQiOnRydWV9LCJtb2RpZnkiOnt9LCJyZXF1aXJlIjp7fX0sInN0YXRlTmFtZXMiOlsicmVxdWlyZSIsIm1vZGlmeSIsImluaXQiLCJkZWZhdWx0Il19fSwiaXNOZXciOmZhbHNlLCJfbWF4TGlzdGVuZXJzIjowLCJfZG9jIjp7Im5vdGlmaWNhdGlvbnMiOltdLCJwaWN0dXJlcyI6W10sInB1YmxpY2F0aW9ucyI6W10sInN1YnNjcmliZXJzIjpbXSwiZW1haWwiOiJoYW16YSIsInBhc3N3b3JkIjoiMjYyNiIsIm5iU3Vic2NyaWJlcnMiOjAsIm5iTGlrZXMiOjAsIl9pZCI6IjU3ODRkYWM1YTdiZWU5MTgwZjAwMDAwNCJ9LCJfcHJlcyI6eyJzYXZlIjpbbnVsbCxudWxsLG51bGxdfSwiX3Bvc3RzIjp7InNhdmUiOltdfSwiaWF0IjoxNDY4NDA3MjExfQ.A8Z8XpSkuZsLuc4aUXLZ4UaVVD3zNjsg9kA8W_aP7Jk');
                        return new http_1.RequestOptions({ headers: headers_post });
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AppSettings, "OPTIONS_POST_ENCODED", {
                    get: function () {
                        var headers_post_encoded = new http_1.Headers();
                        //headers_post_encoded.append('Accept', 'application/x-www-form-urlencoded');
                        //headers_post_encoded.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                        //headers_post_encoded.append('Access-Control-Allow-Origin', '*');
                        return new http_1.RequestOptions({ headers: headers_post_encoded });
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AppSettings, "OPTIONSFB", {
                    get: function () {
                        var headers = new http_1.Headers();
                        headers.append('Access-Control-Allow-Origin', "*");
                        headers.append('Content-Type', 'text/plain;application/x-www-form-urlencoded; charset=UTF-8');
                        headers.append('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
                        headers.append('Access-Control-Allow-Methods', 'GET,OPTIONS');
                        headers.append('Access-Control-Allow-Credentials', 'true');
                        return new http_1.RequestOptions({ headers: headers });
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AppSettings, "SERVER_URL", {
                    get: function () { return 'http://91.121.69.130:3000/'; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AppSettings, "SITE_URL", {
                    get: function () { return 'http://localhost:3000/'; },
                    enumerable: true,
                    configurable: true
                });
                AppSettings.Redirect = function (route) {
                    location.href = this.SITE_URL + "#" + route;
                };
                return AppSettings;
            }());
            exports_1("AppSettings", AppSettings);
        }
    }
});
//# sourceMappingURL=app-settings.js.map