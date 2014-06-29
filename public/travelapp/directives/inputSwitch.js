angular.module('travelApp.directives.switch',[])
.directive('inputSwitch',function() {
	return {
		restrict: 'A', 
		scope: {
		},
		controller: function($scope,$element) {
        	jQuery(document).ready(function () {
            	jQuery('input[type="checkbox"],[type="radio"]').bootstrapSwitch();
            	isInitialized = true;
        	});

		}
	}
});