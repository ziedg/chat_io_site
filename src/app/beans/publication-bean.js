System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var PublicationBean;
    return {
        setters:[],
        execute: function() {
            PublicationBean = (function () {
                function PublicationBean() {
                    this._id = "0";
                    this.comments = [];
                    this.displayed = true;
                }
                return PublicationBean;
            }());
            exports_1("PublicationBean", PublicationBean);
        }
    }
});
//# sourceMappingURL=publication-bean.js.map