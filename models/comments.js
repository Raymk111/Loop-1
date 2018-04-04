var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment-timezone');
require('./util');

var commentsSchema = new Schema({
    user_name: {type: String},
    comment: {type: String},
    date_created: {type: Date, default: moment().tz("Europe/Dublin").format() },
    up_votes: {type: Number, default: 0},
    down_votes: {type: Number, default: 0},
    loop: {type: String},
    college: {type: String},
    location: {type: String},
    token: {type: String}
});

module.exports = mongoose.model('Comment', commentsSchema);
