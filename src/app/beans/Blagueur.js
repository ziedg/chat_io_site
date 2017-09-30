System.register(['./user'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var user_1;
    var Blagueur;
    return {
        setters:[
            function (user_1_1) {
                user_1 = user_1_1;
            }],
        execute: function() {
            Blagueur = (function (_super) {
                __extends(Blagueur, _super);
                //default 
                function Blagueur() {
                    _super.call(this);
                    this.position = 0;
                    this.isSubscribed = false;
                }
                return Blagueur;
            }(user_1.User));
            exports_1("Blagueur", Blagueur);
        }
    }
});
//# sourceMappingURL=Blagueur.js.map