// directive to make all thumbnails the same size
angular.module('travelApp.directives.canvasjs',[])
.directive('angularCanvasjs',function() {
	return {
		restrict: 'A', 
		scope: {
		},
		controller: function($scope,$element) {
		
        	jQuery(document).ready(function () {
        	
        	var chart = new CanvasJS.Chart("chartContainer", {

			title:{
				text:"Fortune Global 500 Companies by Country"				
			},
			axisX:{
				interval: 1,
				gridThickness: 0,
				labelFontSize: 10,
				labelFontStyle: "normal",
				labelFontWeight: "normal",
				labelFontFamily: "Lucida Sans Unicode"

			},
			axisY2:{
				interlacedColor: "rgba(1,77,101,.2)",
				gridColor: "rgba(1,77,101,.1)"

			},

			data: [
			{     
				type: "bar",
                name: "companies",
				axisYType: "secondary",
				color: "#014D65",				
				dataPoints: [
				
				{y: 5, label: "Sweden"  },
				{y: 6, label: "Taiwan"  },
				{y: 7, label: "Russia"  },
				{y: 8, label: "Spain"  },
				{y: 8, label: "Brazil"  },
				{y: 8, label: "India"  },
				{y: 9, label: "Italy"  },
				{y: 9, label: "Australia"  },
				{y: 12, label: "Canada"  },
				{y: 13, label: "South Korea"  },
				{y: 13, label: "Netherlands"  },
				{y: 15, label: "Switzerland"  },
				{y: 28, label: "Britain" },
				{y: 32, label: "Germany"   },
				{y: 32, label: "France"  },
				{y: 68, label: "Japan"   },
				{y: 73, label: "China"},
				{y: 132, label: "US" }
				]
						}
						
						]
			});
			
			chart.render();

			
        	});

		}
	}
});