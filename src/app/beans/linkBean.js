System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var LinkBean;
    return {
        setters:[],
        execute: function() {
            /* LinkBean */
            LinkBean = (function () {
                function LinkBean() {
                    this.url = "http://speegar.com";
                    this.title = "Link Unavailable";
                    this.description = "Link Unavailable";
                    this.title = "Speegar";
                    this.image = null;
                    this.imageWidth = 0;
                    this.imageHeight = 0;
                    this.isSet = false;
                    this.isGif = false;
                }
                LinkBean.prototype.initialise = function () {
                    this.url = "http://speegar.com";
                    this.title = "Link Unavailable";
                    this.description = "Link Unavailable";
                    this.title = "Speegar";
                    this.image = null;
                    this.imageWidth = 0;
                    this.imageHeight = 0;
                    this.isSet = false;
                    this.isGif = false;
                };
                return LinkBean;
            }());
            exports_1("LinkBean", LinkBean);
        }
    }
});
//# sourceMappingURL=linkBean.js.map