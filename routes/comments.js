const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Comment = require("../models/comment");

// ==============
// Comments' Routes
// ==============

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
    await Comment.findByIdAndDelete(req.params.comment_id);
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
