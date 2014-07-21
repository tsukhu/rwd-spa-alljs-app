var mongoose = require('mongoose');

// Subdocument schema for votes
exports.destinationsSchema = new mongoose.Schema({
    country: String,
    region: String,
    location: String,
    district: String,
    state: String,
    description: String,
    source: String,
    img: String
});
