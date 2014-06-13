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