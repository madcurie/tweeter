
var mongoose = require('mongoose');

var db = {};

//******** SET UP DATABASE



db.Schema = mongoose.Schema;
db.eventSchema = new db.Schema ({
  date: { type: String, required: true },
  user: { type: String, required: true },
  type: { type: String, required: true },
  message: { type: String },
  otheruser: { type: String }
});

db.Event = mongoose.model('Event', db.eventSchema);

db.roomSchema = new db.Schema({
  events: []
});
db.Room = mongoose.model('Room', db.roomSchema);

module.exports = db;