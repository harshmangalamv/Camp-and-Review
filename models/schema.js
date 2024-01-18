const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.connect("mongodb+srv://rrahashya:3qOWujVGu2hS8MJn@cluster0.hy2hosm.mongodb.net/")

const AdminSchema = new Schema({
  date: {type:Date, format: "%d-%m-%Y"},
  email: {type: String, required: true},
  password: {type: String, require: true},
  token: {typte: String}
});

const UserSchema = new Schema({
  // date: { type: Date, format: "%d-%m-%Y" },
  email: { type: String, required: true },
  password: { type: String, require: true },
  // token: { typte: String }
});

const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);

module.exports = {
  Admin,
  User
};