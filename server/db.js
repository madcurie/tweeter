
var mongoose = require('mongoose');
var db = {};

//set up event schema for db

db.Schema = mongoose.Schema;
db.eventSchema = new db.Schema ({
  date: { type: String, required: true },
  user: { type: String, required: true },
  type: { type: String, required: true },
  message: { type: String },
  otheruser: { type: String }
});

db.Event = mongoose.model('Event', db.eventSchema);

module.exports = db;
