var app = require("../app");
var jQuery = require("jQuery");



module.exports = app.directive('datetimepicker', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            jQuery(element).datetimepicker();

        }
    };
});