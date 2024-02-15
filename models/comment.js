var mongoose = require("mongoose");
// comment schema
var commentSchema = new mongoose.Schema({
  content: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId, // id property is expected to contain MongoDB ObjectIds
      ref: "User" // establishes a reference to another Mongoose model named "User"
    },
    username: String
  }
});

module.exports = mongoose.model("Comment", commentSchema);