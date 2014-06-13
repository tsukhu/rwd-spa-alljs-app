/**
 * Poll related API definition
 */

var mongoose = require('mongoose');

//Setup Database config for mongoose
var configDB = require('../config/userDb.js');


var db = mongoose.createConnection('localhost', 'pollsapp'); //connect to polls app DB

//mongoose.connect(configDB.pollsUrl); // connect to our database
//var db = mongoose.connection;

var PollSchema = require('../models/Poll.js').PollSchema; // load schema
var Poll = db.model('polls', PollSchema); // Load data model for schema

var nullVotes=[{ip:''}];
var pollArray=[
	{
		question:'Which is your favourite travel destination in India',
		choices: [
					{text: 'Goa',votes: nullVotes},
					{text: 'Himashal Pradesh',votes: nullVotes},
					{text: 'New Delhi',votes: nullVotes},
					{text: 'Mumbai',votes: nullVotes},
					{text: 'Andamans',votes: nullVotes},
					{text: 'Kashmir',votes: nullVotes}
			]
	},
	{
		question:'What is the preferred holiday theme',
		choices: [
					{text: 'Adventure Sports',votes: nullVotes},
					{text: 'Shopping',votes: nullVotes},
					{text: 'Pilgrimage',votes: nullVotes},
					{text: 'Nature',votes: nullVotes},
					{text: 'Historical Places',votes: nullVotes}
			]
	},
	{
		question:'What types of hotels do you generally stay in?',
		choices: [
					{text: '7 Star',votes: nullVotes},
					{text: '5 Star',votes: nullVotes},
					{text: '3 Start',votes: nullVotes}
			]
	},
	{
		question:'What is the preferred mode of travel within the city?',
		choices: [
					{text: 'Chauffer Driven Taxi',votes: nullVotes},
					{text: 'Self Driven Rented Car',votes: nullVotes},
					{text: 'Public Transport',votes: nullVotes}
			]
	},
	{
		question:'When you are on holiday, you generally?',
		choices: [
					{text: 'Are with Family',votes: nullVotes},
					{text: 'Are with Friends',votes: nullVotes},
					{text: 'go Alone',votes: nullVotes}
			]
	}

];

// Pre-populate DB on app startup
Poll.remove({}, function(err){
	var i=0;
	var saved=0;
	while(i < pollArray.length){
        new Poll(pollArray[i]).save(function(err, doc){
            saved++;
            if(err){
                console.log(err);
            } else {
                if(saved === pollArray.length) {
                    console.log('database populated');
                }
            }
        });
        i++;
    }
});

exports.index = function(req, res) {
	res.render('index', {
		title : 'Polls'
	});
};

// JSON API for list of polls
exports.list = function(req, res) {
	Poll.find({}, 'question', function(error, polls) {
		res.json(polls);
	});
};

// JSON API for getting a single poll
exports.poll = function(req, res) {
	// Load poll question by ID
	var pollId = req.params.id;
	Poll.findById(pollId, '', {
		lean : true
	}, function(err, poll) {
		// Poll question exists
		if (poll) {
			var userVoted = false, userChoice, totalVotes = 0;
			for (c in poll.choices) {
				var choice = poll.choices[c];
				for (v in choice.votes) {
					var vote = choice.votes[v];
					totalVotes++;
					// Mark if user already voted based on IP
					if (vote.ip === (req.header('x-forwarded-for') || req.ip)) {
						userVoted = true;
						userChoice = {
							_id : choice._id,
							text : choice.text
						};
					}
				}
			}
			poll.userVoted = userVoted;
			poll.userChoice = userChoice;
			poll.totalVotes = totalVotes;
			res.json(poll); // Return the poll response details
		} else { // Not found
			res.json({
				error : true
			});
		}
	});
};

// JSON API for creating a new poll
exports.create = function(req, res) {
	var reqBody = req.body, choices = reqBody.choices.filter(function(v) {
		return v.text !== '';
	}), pollObj = {
		question : reqBody.question,
		choices : choices
	};
	var poll = new Poll(pollObj);
	poll.save(function(err, doc) {
		if (err || !doc) {
			throw 'Error';
		} else {
			res.json(doc); // return saved poll object
		}
	});
};

// JSON API for deleting a poll
exports.remove = function(req,res) {
	// Load poll question by ID
	console.log("remove called");
	var pollId = req.params.id;
	// Find poll question by ID
	Poll.findByIdAndRemove(pollId, function(err, doc) {
		if (err || !doc) {
			throw 'Error';
		}
	});
};

// JSON API for poll vote event callback
exports.vote = function(socket) {
	// Send Vote event handler
	socket.on('send:vote', function(data) {
		// get sender IP
		var ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address.address;
		
		// Find poll question by ID
		Poll.findById(data.poll_id, function(err, poll) {
			var choice = poll.choices.id(data.choice);
			choice.votes.push({ ip: ip });
			
			// Save the poll response
			poll.save(function(err, doc) {
				var theDoc = { 
					question: doc.question, _id: doc._id, choices: doc.choices, 
					userVoted: false, totalVotes: 0 
				};

				// Loop through poll choices to determine if user has voted
				// on this poll, and if so, what they selected
				for(var i = 0, ln = doc.choices.length; i < ln; i++) {
					var choice = doc.choices[i]; 

					for(var j = 0, jLn = choice.votes.length; j < jLn; j++) {
						var vote = choice.votes[j];
						theDoc.totalVotes++;
						theDoc.ip = ip;
						// once voted mark ip for poll question as voted
						if(vote.ip === ip) {
							theDoc.userVoted = true;
							theDoc.userChoice = { _id: choice._id, text: choice.text };
						}
					}
				}
				// Sent event to every one
				socket.emit('myvote', theDoc);
				// end a message to everyone except the current socket
				socket.broadcast.emit('vote', theDoc);
			});			
		});
	});
};