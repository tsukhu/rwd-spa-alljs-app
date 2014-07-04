// directive to make all thumbnails the same size
angular.module('travelApp.directives.equalHeight',[])
.directive('equalHeight',function() {
	return {
		restrict: 'A', 
		scope: {
		},
		controller: function($scope,$element) {
		
        	jQuery(document).ready(function () {
				group=jQuery(".caption");
				tallest = 0;    
				console.log(group.length);
				group.each(function() {  
					
					thisHeight = jQuery(this).height();
					if(thisHeight > tallest) {
						tallest = thisHeight;
					}
					console.log( "tallest = "+   tallest); 
				});
				group.each(function() { jQuery(this).height(tallest); });
			
        	});

		}
	}
});