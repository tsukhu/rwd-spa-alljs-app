angular.module('travelApp.directives.switch', [])
    .directive('inputSwitch', function() {
        return {
            restrict: 'A',
            scope: {},
            controller: function($scope, $element) {
                jQuery(document).ready(function() {
                    jQuery('input[name="choice"],[type="radio"]').bootstrapSwitch();
                    isInitialized = true;
                });

            }
        };
    });
