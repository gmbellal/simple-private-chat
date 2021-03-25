var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userOnlineSchema = new Schema({
  user: { type: Object, required: true },
  socketSession: { type: String, required: true },
  isOnline: { type: Boolean, required: true }
}, { timestamps: true } );

module.exports = mongoose.model('Online_user', userOnlineSchema );
