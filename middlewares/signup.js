const zod = require("zod");
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const JWTKey = "okaokoaka";

const { Admin, User } = require("../models/schema.js")
mongoose.connect("mongodb+srv://rrahashya:3qOWujVGu2hS8MJn@cluster0.hy2hosm.mongodb.net/")

const schema_email = zod.string().email();
const schema_password = zod.string();

const signup_verify = zod.object({
  email: schema_email,
  password: schema_password
});

const signup_middleware = (req, res, next) => {

  const email = req.body.email;
  const password = req.body.password;

  try {
    const ZodResult = signup_verify.safeParse({
      email: email,
      password: password
    });

    // console.log(ZodResult.success);
    if (ZodResult.success == false) {
      res.redirect('/signup');
    }

    const token = jwt.sign({ email: email }, JWTKey);
    const CurrentUser = new User({
      email: email,
      password: password,
      token: token
    })
    async () => {
      await CurrentUser.save();
    }

    User.findOne({ email: email })
      .then((user) => {
        if (user) {
          if (user.password != password) {
            res.redirect('/signup');
          }
        }
        else {
          async () => {
            await CurrentUser.save();
          }
          // use next()
        }
      })
      .catch((err) => {
        console.log(err);
      })
    // token's work remains -> sending it back to the 


    // console.log(email, " ", password, " ", token);
    next();
  }
  catch {
    // console.log(err);
    res.send("renter the right way");
  }

  // jwt verification


  // if not in db, store it


  // otherwise go ahead
}

module.exports = { signup_middleware };