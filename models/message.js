var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('./util');

var messageSchema = new Schema({
    user_nameTo: {type: String},
    user_nameFrom: {type: String},
    message: {type: String},
    date_created: {type: Date, default: new Date()},
});

module.exports = mongoose.model('Message', messageSchema);
