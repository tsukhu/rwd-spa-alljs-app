angular.module('travelApp.directives.localWeather',[])
.directive('localWeather',function() {
	return {
		restrict: 'E',
		scope: {
			destination: '=',
			weather: "="
		},
		templateUrl: "travelapp/directives/localWeather.html",
		controller: function($scope,$element) {
			console.log($scope.destination.location);
			jQuery(document).ready(function () {
				var location=$scope.destination.location+","+$scope.destination.state +","+$scope.destination.country;
				jQuery.simpleWeather({
				    location: location,
				    woeid: '',
				    unit: 'c',
				    success: function(weather) {
				      html = '<h2><i class="icon-'+weather.code+'"></i> '+weather.temp+'&deg;'+weather.units.temp+'</h2>';
				      html += '<ul><li>'+weather.city+', '+weather.region+'</li>';
				      html += '<li class="currently">'+weather.currently+'</li>';
				      html += '<li>'+weather.wind.direction+' '+weather.wind.speed+' '+weather.units.speed+'</li></ul>';
				      $element.html(html);
				    },
				    error: function(error) {
					     $element.html('<p>'+error+'</p>');
				    }
				  });
			});

		}
	}
});