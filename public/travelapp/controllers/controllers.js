//This controller retrieves data from the RESTful destinations API and associates it with the $scope
//The $scope is ultimately bound to the customers view
app.controller('DestinationsController', ['i18n',
    '$scope',
    '$http',
    '$cookieStore',
    'travelService',
    function(i18n, $scope, $http, $cookieStore, travelService) {

        // I like to have an init() for controllers that need to perform
        // some initialization. Keeps things in
        // one place...not required though especially in the simple example
        // below
        $scope.i18n = i18n;
        $scope.destinations = [];
        $scope.user = null;
        $scope.favRegion = null;
        // $scope.favRegion = null;


        function init() {
            // $scope.destinations = travelService.getDestinations();
            travelService.getDestinations().then(function(dataResponse) {
                $scope.destinations = dataResponse.data;

            });

            travelService.getProfile().then(function(dataResponse) {
                $scope.user = dataResponse.data;

            });

            $scope.favRegion = $cookieStore.get('favRegion');

            // this.filter.region= "test";
            // alert($scope.favRegion);
        }

        init();

        $scope.setValue = function(favRegion) {

            if (favRegion) {

                $scope.favRegion = favRegion;
                $cookieStore.put('favRegion', $scope.favRegion);

            }
        };

        $scope.getWeather = function(divId, location) {
            alert("SimpleWeather Called");
            jQuery.simpleWeather({
                location: 'Austin, TX',
                woeid: '',
                unit: 'f',
                success: function(weather) {
                    html = '<h2><i class="icon-' + weather.code + '"></i> ' +
                        weather.temp + '&deg;' +
                        weather.units.temp +
                        '</h2>';
                    html += '<ul><li>' + weather.city + ', ' +
                        weather.region + '</li>';
                    html += '<li class="currently">' + weather.currently +
                        '</li>';
                    html += '<li>' + weather.wind.direction + ' ' +
                        weather.wind.speed + ' ' + weather.units.speed + '</li></ul>';
                    alert("#" + divId);
                    $("#" + divId).html(html);
                },
                error: function(error) {
                    alert("#" + divId);
                    $("#" + divId).html('<p>' + error + '</p>');
                }
            });
        };
    }
]);

// This controller retrieves data from the RESTful destinations API and
// associates it with the $scope
// The $scope is ultimately bound to the customers view
app.controller('GroupedDestinationsController', ['$scope', '$http',
    'travelService',
    function($scope, $http, travelService) {

        // I like to have an init() for controllers that need to perform
        // some initialization. Keeps things in
        // one place...not required though especially in the simple example
        // below
        $scope.destinations = [];
        $scope.groups = [];


        function init() {
            // $scope.destinations = travelService.getDestinations();
            travelService.getDestinations().then(function(dataResponse) {
                $scope.destinations = dataResponse.data;

            });
        }

        init();

        // I sort the given collection on the given property.
        function sortOn(collection, region) {

            collection.sort(function(a, b) {

                if (a[region] <= b[region]) {

                    return (-1);

                }

                return (1);

            });

        }

        // -- Define Scope Methods. ----------------- //

        // group destinations list on the given property.
        $scope.groupBy = function(attribute) {

            // First, reset the groups.
            $scope.groups = [];

            // Now, sort the collection of friend on the
            // grouping-property. This just makes it easier
            // to split the collection.
            sortOn($scope.destinations, attribute);

            // I determine which group we are currently in.
            var groupValue = "_INVALID_GROUP_VALUE_";

            // As we loop over each friend, add it to the
            // current group - we'll create a NEW group every
            // time we come across a new attribute value.
            for (var i = 0; i < $scope.destinations.length; i++) {

                var destination = $scope.destinations[i];
                var group;
                // Should we create a new group?
                if (destination[attribute] !== groupValue) {

                    group = {
                        label: destination[attribute],
                        destinations: []
                    };

                    groupValue = group.label;

                    $scope.groups.push(group);

                }

                // Add the destination to the currently active
                // grouping.
                group.destinations.push(destination);

            }

        };

    }
]);

// This controller for the menu actions which checked if the getClass is true
// to initiate the route
app.controller('MenuController', ['i18n', '$scope', '$location',
    function(i18n, $scope, $location) {
        // Inject the service into the scope, so we can access __() and 'loaded'.
        $scope.i18n = i18n;
        $scope.isActive = function(viewLocation) {
            var active = (viewLocation === $location.path());
            return active;
        };
    }
]);

app.controller('ProfileController', ['$scope', '$http', 'travelService',
    function($scope, $http, travelService) {

        // I like to have an init() for controllers that need to perform
        // some initialization. Keeps things in
        // one place...not required though especially in the simple example
        // below
        $scope.user = null;

        travelService.getProfile().then(function(dataResponse) {
            $scope.user = dataResponse.data;

        });

    }
]);

// Managing the poll list
app.controller('PollListCtrl', ['$scope', 'Poll',
    function($scope, Poll) {

        $scope.polls = Poll.query();

    }
]);

// Voting / viewing poll results
app.controller('PollRemoveItemCtrl', ['$scope', '$routeParams', 'Poll',
    function($scope, $routeParams, Poll) {
        console.log("here");
        // Call Delete Poll ID which in turn will invoke the delete function in poll_routes.js
        Poll.delete({}, {
            'pollId': $routeParams.pollId
        }); // Calls: DELETE /polls/:pollId
        // Refresh list 
        $scope.polls = Poll.query();

    }
]);

// Voting / viewing poll results
app.controller('PollItemCtrl', ['$scope', '$routeParams', 'socket', 'Poll',
    function($scope, $routeParams, socket, Poll) {

        //////////////////////////
        $scope.chart = {};


        function init() {
            $scope.chart.type = "BarChart";
            $scope.chart.cssStyle = "height:300px; width:400px;";
            var chartCols = [{
                id: "text",
                label: "Option",
                type: "string"
            }, {
                id: "votes",
                label: "Votes",
                type: "number"
            }];
            var chartRows = [];
            $scope.chart.data = {
                "cols": chartCols,
                "rows": []
            };

            $scope.chart.options = {
                "title": "Poll Result",
                "isStacked": "false",
                "fill": 20,
                "displayExactValues": true,
                "vAxis": {
                    "title": "Poll Result",
                    "gridlines": {
                        "count": 6
                    }
                },
                "hAxis": {
                    "title": "Choice"
                }
            };

            $scope.chartformatters = {};


        }

        init();

        Poll.get({
            pollId: $routeParams.pollId
        }).$promise.then(function(poll) {

            $scope.poll = poll;

            if ($scope.poll) {
                if ($scope.poll.choices) {
                    for (var i = 0; i < $scope.poll.choices.length; i++) {
                        var choice = $scope.poll.choices[i];
                        var voteShare = choice.votes.length;
                        var chartRows = {
                            c: [{
                                v: choice.text
                            }, {
                                v: voteShare
                            }]
                        };
                        $scope.chart.data.rows.push(chartRows);
                    }
                }
            }
        });


        // myvote message handler
        // update poll object if viewing the same poll question
        socket.on('myvote', function(data) {
            console.dir(data);
            if (data._id === $routeParams.pollId) {
                $scope.poll = data;
                init();
                for (var i = 0; i < $scope.poll.choices.length; i++) {
                    var choice = $scope.poll.choices[i];
                    var voteShare = choice.votes.length;
                    var chartRows = {
                        c: [{
                            v: choice.text
                        }, {
                            v: voteShare
                        }]
                    };
                    $scope.chart.data.rows.push(chartRows);
                }
            }
        });

        // broadcast vote message handler
        // Update poll response numbers if viewing the same poll question
        socket.on('vote', function(data) {
            console.dir(data);
            if (data._id === $routeParams.pollId) {
                $scope.poll.choices = data.choices;
                $scope.poll.totalVotes = data.totalVotes;
                init();
                for (var i = 0; i < $scope.poll.choices.length; i++) {
                    var choice = $scope.poll.choices[i];
                    var voteShare = choice.votes.length;
                    var chartRows = {
                        c: [{
                            v: choice.text
                        }, {
                            v: voteShare
                        }]
                    };
                    $scope.chart.data.rows.push(chartRows);
                }
            }
        });

        // vote() method
        $scope.vote = function() {
            var pollId = $scope.poll._id,
                choiceId = $scope.poll.userVote;
            // Send out poll choice object to send:vote socket
            if (choiceId) {
                var voteObj = {
                    poll_id: pollId,
                    choice: choiceId
                };
                socket.emit('send:vote', voteObj);
            } else {
                alert('You must select an option to vote for');
            }
        };

    }
]);

// Creating a new poll
app.controller('PollNewCtrl', ['$scope', '$location', 'Poll',
    function($scope, $location, Poll) {
        $scope.poll = {
            question: '',
            choices: [{
                text: ''
            }, {
                text: ''
            }, {
                text: ''
            }]
        };
        $scope.addChoice = function() {
            $scope.poll.choices.push({
                text: ''
            });
        };
        $scope.createPoll = function() {
            console.log('Create Poll Called');
            var poll = $scope.poll;
            if (poll.question.length > 0) {
                // jQuery encoder to secure poll inputs.
                poll.question = jQuery.encoder.encodeForHTML(poll.question);
                var choiceCount = 0;
                for (var i = 0, ln = poll.choices.length; i < ln; i++) {
                    var choice = poll.choices[i];

                    if (choice.text.length > 0) {
                        choiceCount++;
                        // jQuery encoder to secure poll inputs.
                        poll.choices[i].text = jQuery.encoder.encodeForHTML(choice.text);
                    }
                }
                if (choiceCount > 1) {
                    var newPoll = new Poll(poll);
                    newPoll.$save(function(p, resp) {
                        if (!p.error) {
                            $location.path('polls');
                        } else {
                            console.log('Could not create poll');
                        }
                    });
                } else {
                    console.log('You must enter at least two choices');
                }
            } else {
                console.log('You must enter a question');
            }
        };

    }
]);

// Carousel Controller 		
app.controller('CarouselDemoCtrl', ['$scope',
    function($scope) {
        $scope.myInterval = 3000;
        $scope.slides = [{
            image: 'pics/hampi.jpg',
            href: 'http://goindia.about.com/od/historicalplaces/p/hampiguide.htm',
            label: 'Village of Hampi (Karnataka)'
        }, {
            image: 'pics/keralabackwaters.jpg',
            href: 'http://goindia.about.com/od/southindia/ig/Kerala-Backwaters-Attractions/',
            label: 'Kerala Backwaters'
        }, {
            image: 'pics/kochi.jpg',
            href: 'http://goindia.about.com/od/kerala/tp/Kochi-Attractions.htm',
            label: 'Kochi'
        }, {
            image: 'pics/madurai.jpg',
            href: 'http://goindia.about.com/od/tamilnadu/tp/top-tamil-nadu-attractions.htm',
            label: 'Madurai'
        }, {
            image: 'pics/varkala.jpg',
            href: 'http://goindia.about.com/od/festivalsevents/ig/Varkala-Temple-Festival/',
            label: 'Varkala Temple Festival'
        }];
    }
]);
