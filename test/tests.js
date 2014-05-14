// tests.js

var chai = require('chai');
var request = require('supertest'), express = require('express');
var app = express();
var test_destinations = require('./test_destinations.js');
var destinations = test_destinations.destinations;

app.get('/destinations', function(req, res) {
	res.send(200, destinations);
});

describe('Array', function() {
	describe('#indexOf()', function() {
		it('should return -1 when the value is not present', function() {
			chai.assert.equal(-1, [ 1, 2, 3 ].indexOf(5));
			chai.assert.equal(-1, [ 1, 2, 3 ].indexOf(0));
		});
	});

	// Test Destinations API
	describe('GET /destinations', function() {

		it('respond with destinations json', function(done) {
			request(app).get('/destinations').set('Accept', 'application/json')
					.expect('Content-Type', /json/).expect(200).end(
							function(err, res) {
								if (err)
									return done(err);
								var result = res.body;
								// simple referencing
								chai.expect(result[0]).to.include
										.keys('country');
								chai.expect(result[0]).to.have.property(
										'district', 'Madurai');
								done()
							});
		});
	});
});