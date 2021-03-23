var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({

  fullname: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  socketSession: { type: String, required: false }
  
}, { timestamps: true } );

module.exports = mongoose.model('User', userSchema);
