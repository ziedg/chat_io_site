System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var CommentBean;
    return {
        setters:[],
        execute: function() {
            CommentBean = (function () {
                function CommentBean() {
                    this.deleted = false;
                    this.isLiked = false;
                    this.isDisliked = false;
                    this.deleted = false;
                }
                return CommentBean;
            }());
            exports_1("CommentBean", CommentBean);
        }
    }
});
//# sourceMappingURL=comment-bean.js.map