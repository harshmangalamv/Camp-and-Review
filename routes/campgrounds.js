var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));

// root url (but shows no user data - used when website is visited for the first time)
router.get("/", function (req, res) {
  Campground.find({})
    .exec()
    .then((allCampgrounds) => {
      res.render("campgrounds/index", { campgrounds: allCampgrounds });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
});

// INDEX----->Show all campgrounds
//At last we'll pass the user data(id and name) to the index page
router.get("/index", async function (req, res) {
  try {
    // Get all the campgrounds from the database and call it allcampgrounds
    const allcampgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds: allcampgrounds, currentUser: req.user });
    // Pass allcampgrounds fetched as campgrounds to the render
  } catch (err) {
    console.log(err);
    // Handle the error appropriately, e.g., send an error response
    res.status(500).send("Internal Server Error");
  }
});



// NEW------->Show form to create new campground
router.get("/index/new", isLoggedIn, function (req, res) {
  //This is the place to fill the form
  res.render("campgrounds/new");
});


// CREATE-----> add new campground
router.post("/index", isLoggedIn, async function (req, res) {
  // Get data from form and add it to campgrounds array
  // Redirect back to campgrounds list page
  console.log("entered post in campgrounds");
  try {
    // req.body will give us the content of the form which we filled
    console.log("entered post in campgrounds1");

    const name = await req.body.name;
    const url = await req.body.image;
    const desc = await req.body.desc;

    const author = {
      id: await req.user._id,
      username: await req.user.username
    };

    console.log("entered post in campgrounds2");

    console.log(req.user);

    const newCampground = {
      Name: name,
      Image: url,
      Desc: desc,
      Author: author
    };

    console.log("entered post in campgrounds3");

    // Use async/await with Campground.create
    console.log('post is about to inserted in db');
    const newCamp = await Campground.create(newCampground);
    console.log("New Campground added:", newCamp);

    res.redirect("/index");
  } catch (err) {
    console.log(err);
    // Handle the error appropriately, e.g., send an error response
    res.status(500).send("Internal Server Error");
  }
});

// Show campground
router.get("/index/:id", async (req, res) => {
  try {
    const foundCampground = await Campground.findById(req.params.id).populate("Comments").exec();
    console.log(foundCampground);
    res.render("campgrounds/show", { campground: foundCampground, currentUser: req.user });
  } catch (err) {
    console.error(err);
    res.redirect("/index");
  }
});

// Edit campground
router.get("/index/:id/edit", checkCampgroundOwnership, async (req, res) => {
  try {
    const foundCampground = await Campground.findById(req.params.id).exec();
    res.render("../views/campgrounds/edit", { campground: foundCampground });
  } catch (err) {
    console.error(err);
    res.redirect("/index");
  }
});

// Update campground
router.put("/index/:id", checkCampgroundOwnership, async (req, res) => {
  try {
    const updatedCampground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground, { new: true });
    res.redirect(`/index/${updatedCampground._id}`);
  } catch (err) {
    console.error(err);
    res.redirect("/index");
  }
});

// Destroy campground
router.delete("/index/:id", checkCampgroundOwnership, async (req, res) => {
  try {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/index");
  } catch (err) {
    console.error(err);
    res.redirect("/index");
  }
});

// check if the current user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('authenticated\n');
    next();
  } else {
    res.redirect("/login");
  }
}

// Check campground ownership
async function checkCampgroundOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    try {
      const foundCampground = await Campground.findById(req.params.id).exec();
      if (!foundCampground) {
        res.redirect("back");
      } else if (foundCampground.Author.id.equals(req.user._id)) {
        next();
      } else {
        res.redirect("back");
      }
    } catch (err) {
      console.error(err);
      res.redirect("back");
    }
  } else {
    res.redirect("back");
  }
}

module.exports = router;
