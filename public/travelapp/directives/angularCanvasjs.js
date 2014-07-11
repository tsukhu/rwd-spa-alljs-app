// directive to make all thumbnails the same size
angular.module('travelApp.directives.canvasjs', [])
    .directive('angularCanvasjs', function() {
        return {
            restrict: 'A',
            scope: {
                kpis: '=kpis',
                slot: '=',
                name: '@'
            },
            controller: function($scope, $element) {

                jQuery(document).ready(function() {
                    var slot = parseInt($scope.slot);
                    var chartData = $scope.kpis[slot];
                    var name = $scope.name;

                    var chart = new CanvasJS.Chart(name, chartData);

                    chart.render();


                });

            }
        };
    });
