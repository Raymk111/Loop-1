var mongoose = require('mongoose');
var connection = mongoose.connect('mongodb://mongodb3500re:he0hof@danu7.it.nuigalway.ie:8717/mongodb3500',{useMongoClient:true},
(err) => {}
);

exports.connection = connection;
