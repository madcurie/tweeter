
var mongoose = require('mongoose');

//set up event schema for db

var Schema = mongoose.Schema;
var eventSchema = new Schema ({
  date: { type: String, required: true },
  user: { type: String, required: true },
  type: { type: String, required: true },
  message: { type: String },
  otheruser: { type: String }
});

module.exports = mongoose.model('Event', eventSchema);


