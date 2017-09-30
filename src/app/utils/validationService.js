System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function emailValidator(email) {
        if (email.value == "" || !email.value) {
            return null;
        }
        var valid = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(email.value);
        if (!valid) {
            return { 'isInvalidEmail': true };
        }
        return null;
    }
    exports_1("emailValidator", emailValidator);
    return {
        setters:[],
        execute: function() {
        }
    }
});
//# sourceMappingURL=validationService.js.map