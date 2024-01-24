var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// Start routing
// router.get("/", function (req, res) {
//   Campground.find({}, function (err, allCampgrounds) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.render("campgrounds/index", { campgrounds: allCampgrounds });
//     }
//   });
// });
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
// router.get("/index", function (req, res) {
//   //Get all the campgrounds from the database and call it allcampgrounds
//   Campground.find({}, function (err, allcampgrounds) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.render("campgrounds/index", { campgrounds: allcampgrounds, currentUser: req.user });
//       //Pass allcampgrounds fetched as campgrounds to the render
//     }
//   });
// });
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

  try {
    // req.body will give us the content of the form which we filled
    const name = req.body.name;
    const url = req.body.image;
    const desc = req.body.desc;

    const author = {
      id: req.user._id,
      username: req.user.username
    };

    // console.log(req.user);

    const newCampground = {
      Name: name,
      Image: url,
      Desc: desc,
      Author: author
    };

    // Use async/await with Campground.create
    async () => {
      const newCamp = await Campground.create(newCampground);

      console.log("New Campground added:", newCamp);
      res.redirect("/index");
    }
  } catch (err) {
    console.log(err);
    // Handle the error appropriately, e.g., send an error response
    res.status(500).send("Internal Server Error");
  }
});



// //SHOW -- show more information for the perticular id
// router.get("/index/:id", function (req, res) {
//   Campground.findById(req.params.id).populate("Comments").exec(function (err, foundCampground) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(foundCampground);
//       res.render("campgrounds/show", { campground: foundCampground, currentUser: req.user });
//     }
//   });
// });

// //Edit campground----->>>
// router.get("/index/:id/edit", checkCampgroundOwnership, function (req, res) {
//   Campground.findById(req.params.id, function (err, foundCampground) {
//     if (err) {
//       console.log(err);
//       res.redirect("/index");
//     } else {
//       res.render("../views/campgrounds/edit", { campground: foundCampground });
//     }
//   });

// });

// // UPDATE CAMPGROUND ROUTE
// router.put("/index/:id", checkCampgroundOwnership, function (req, res) {
//   // find and update the correct campground
//   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
//     if (err) {
//       console.log(err);
//       res.redirect("/index");
//     } else {
//       //redirect somewhere(show page)
//       res.redirect("/index/" + updatedCampground._id);
//     }
//   });
// });

// //Destroy campground rote
// router.delete("/index/:id", checkCampgroundOwnership, function (req, res) {
//   console.log("I'm here");
//   Campground.findByIdAndRemove(req.params.id, function (err) {
//     if (err) {
//       console.log(err);
//       res.redirect("/index");
//     } else {
//       res.redirect("/index");
//     }
//   });
// });


// function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   } else {
//     res.redirect("/login");
//   }
// }

// //Check campground ownership
// function checkCampgroundOwnership(req, res, next) {
//   if (req.isAuthenticated()) {
//     Campground.findById(req.params.id, function (err, foundCampground) {
//       if (err) {
//         res.redirect("back");
//       } else {
//         // does user own the campground?
//         if (foundCampground.Author.id.equals(req.user._id)) {
//           next();
//         } else {
//           res.redirect("back");
//         }
//       }
//     });
//   } else {
//     res.redirect("back");
//   }
// }

// module.exports = router;
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
    await Campground.findByIdAndRemove(req.params.id);
    res.redirect("/index");
  } catch (err) {
    console.error(err);
    res.redirect("/index");
  }
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
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
