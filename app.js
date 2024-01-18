const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const zod = require("zod");
const { signup_middleware } = require("./middlewares/signup.js");

const PORT = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('home');
})

app.get('/signup', (req, res) => {
  res.render('signup');
})

app.get('/users', (req, res) => {
  res.render('users');
})

app.post('/signup', signup_middleware,  (req, res) => {
  res.redirect('home');
})


app.get('/home', (req, res) => {
  res.render('home');
})


app.listen(PORT);