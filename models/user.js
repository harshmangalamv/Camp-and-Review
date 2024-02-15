var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose"); 
// passport-local-mongoose is a Mongoose plugin that provides authentication functionality 
// for username and password authentication

var UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

UserSchema.plugin(passportLocalMongoose);
// applies this plugin to the user schema, enhancing it with authentication-related features
module.exports = mongoose.model("User", UserSchema);