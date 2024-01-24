// var express = require("express");
// var router = express.Router({ mergeParams: true });
// var Campground = require("../models/campground");
// var Comment = require("../models/comment");


// // ==============
// // Comments Routes
// // ==============

// //Comments New
// router.get("/index/:id/comments/new", isLoggedIn, function (req, res) {
//   // console.log("Helllllllllllloo:");
//   // console.log(req);
//   Campground.findById(req.params.id, function (err, campground) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.render("comments/new", { campground: campground });
//     }
//   });
// });

// //Comments Create
// //Add isLoggedIn to prevent from getting requests through postman
// router.post("/index/:id/comments", isLoggedIn, function (req, res) {

//   console.log(req.params.id);
//   Campground.findById(req.params.id, function (err, campground) {
//     if (err) {
//       console.log("Could not find the ID");
//       console.log(err);
//       console.log(req.body.comment);
//       res.redirect("/index");
//     } else {
//       Comment.create(req.body.comment, function (err, comment) {
//         if (err) {
//           console.log("Comment waala error");
//           console.log(err);
//           req.redirect("/index");
//         } else {
//           comment.author.id = req.user._id;
//           comment.author.username = req.user.username;
//           comment.save();
//           campground.Comments.push(comment);
//           campground.save();
//           console.log(comment);
//           res.redirect("/index/" + campground._id);
//         }
//       });

//     }

//   });
// });

// //Comment edit and delete
// router.get("/index/:id/comments/:comment_id/edit", checkCommentOwnership, function (req, res) {
//   Campground.findById(req.params.id, function (err, foundCampground) {
//     if (err) {
//       console.log(err);
//       res.redirect("/index/");
//     } else {
//       Comment.findById(req.params.comment_id, function (err, foundComment) {
//         if (err) {
//           console.log(err);
//           res.redirect("/index");
//         } else {
//           res.render("comments/edit.ejs", { campground: foundCampground, comment: foundComment });
//         }
//       });
//     }
//   });
// });

// //Post route for editing the comment
// router.put("/index/:id/comments/:comment_id", checkCommentOwnership, function (req, res) {
//   Campground.findById(req.params.id, function (err, foundCampground) {
//     if (err) {
//       console.log(err);
//       res.redirect("/index");
//     } else {
//       Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err) {
//         if (err) {
//           console.log(err);
//           res.redirect("back");

//         } else {
//           res.redirect("/index/" + req.params.id);

//         }
//       })
//     }
//   });
// });


// //Delete a comment
// router.delete("/index/:id/comments/:comment_id", checkCommentOwnership, function (req, res) {
//   Comment.findByIdAndRemove(req.params.comment_id, function (err) {
//     if (err) {
//       res.redirect("back");
//     } else {
//       res.redirect("/index/" + req.params.id);
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

// function checkCommentOwnership(req, res, next) {
//   if (req.isAuthenticated()) {
//     Comment.findById(req.params.comment_id, function (err, foundComment) {
//       if (err) {
//         res.redirect("back");
//       } else {
//         // does user own the comment?
//         if (foundComment.author.id.equals(req.user._id)) {
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


const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Comment = require("../models/comment");

// Comments New
router.get("/index/:id/comments/new", isLoggedIn, async (req, res) => {
  try {
    const campground = await Campground.findById(req.params.id).exec();
    res.render("comments/new", { campground });
  } catch (err) {
    console.error(err);
    res.redirect("/index");
  }
});

// Comments Create
router.post("/index/:id/comments", isLoggedIn, async (req, res) => {
  try {
    const campground = await Campground.findById(req.params.id).exec();
    const comment = await Comment.create(req.body.comment);
    comment.author.id = req.user._id;
    comment.author.username = req.user.username;
    comment.save();
    campground.Comments.push(comment);
    await campground.save();
    console.log(comment);
    res.redirect(`/index/${campground._id}`);
  } catch (err) {
    console.error(err);
    res.redirect("/index");
  }
});

// Comment edit and delete
router.get("/index/:id/comments/:comment_id/edit", checkCommentOwnership, async (req, res) => {
  try {
    const foundCampground = await Campground.findById(req.params.id).exec();
    const foundComment = await Comment.findById(req.params.comment_id).exec();
    res.render("comments/edit.ejs", { campground: foundCampground, comment: foundComment });
  } catch (err) {
    console.error(err);
    res.redirect("/index/");
  }
});

// Post route for editing the comment
router.put("/index/:id/comments/:comment_id", checkCommentOwnership, async (req, res) => {
  try {
    const foundCampground = await Campground.findById(req.params.id).exec();
    await Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment);
    res.redirect(`/index/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.redirect("back");
  }
});

// Delete a comment
router.delete("/index/:id/comments/:comment_id", checkCommentOwnership, async (req, res) => {
  try {
    await Comment.findByIdAndRemove(req.params.comment_id);
    res.redirect(`/index/${req.params.id}`);
  } catch (err) {
    res.redirect("back");
  }
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

async function checkCommentOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    try {
      const foundComment = await Comment.findById(req.params.comment_id).exec();
      if (!foundComment) {
        res.redirect("back");
      } else if (foundComment.author.id.equals(req.user._id)) {
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
