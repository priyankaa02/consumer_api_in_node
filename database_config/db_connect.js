var mongoose = require('mongoose');
var db_url  = require('./db_url');
var con = db_url.url;
if(mongoose.connect(con, {useNewUrlParser : true}))
 console.log("database is connected");

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongodb connection error'));
module.exports = db;
