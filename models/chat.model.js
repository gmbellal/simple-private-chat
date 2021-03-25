var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chatSchema = new Schema({
  from: { type: Object, required: true },
  to: { type: Object, required: true },
  message: { type: String, required: true },
  date: { type: String, required: true },
}, { timestamps: true } );

module.exports = mongoose.model('Chat', chatSchema);
