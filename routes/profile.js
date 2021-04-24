/* ==========================================================
MODULES
========================================================== */

const express = require("express");
const mongoose = require("mongoose");

/* ==========================================================
VARIABLES
========================================================== */

const router = new express.Router();

/* ==========================================================
MODELS
========================================================== */

const User = require("../models/User.js");

/* ==========================================================
ROUTES
========================================================== */

// @route   POST /user/create
// @desc    Creating a new user
// @access  PUBLIC
router.post("/user/create", async (req, res) => {
  // Declare variables
  const object = req.body;
  // Build the user instance
  let user;
  try {
    user = await User.build(object);
  } catch (data) {
    return res.send(data);
  }
  // Success handler
  return res.send({ status: "succeeded", content: user });
});

// @route   GET /user/:email
// @desc    fetching a user
// @access  PUBLIC
router.get("/user/:email", async (req, res) => {
  // Declare variables
  const email = req.params.email;
  // Fetch user
  let user;
  try {
    user = await User.findOne({ email });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // Success handler
  return res.send({ status: "succeeded", content: user });
});

// @route   GET /user/:email/fetch-matches
// @desc    fetching all matches of a user
// @access  PUBLIC
router.get("/user/:email/fetch-matches", async (req, res) => {
  // Declare variables
  const email = req.params.email;
  // Fetch matches
  let users;
  try {
    users = await User.findMatches({ email });
  } catch (data) {
    return res.send(data);
  }
  // Success handler
  return res.send({ status: "succeeded", content: users });
});

// @route   POST /user/update
// @desc    Updating user details
// @access  PUBLIC
router.post("/user/update", async (req, res) => {
  // Declare variables
  const id = mongoose.Types.ObjectId(req.body.id);
  const updates = req.body.updates;
  // Update user
  let user;
  try {
    user = await User.reform(id, updates);
  } catch (data) {
    return res.send(data);
  }
  // Success handler
  return res.send({ status: "succeeded", content: user });
});

/* ==========================================================
EXPORT
========================================================== */

module.exports = router;

/* ==========================================================
END
========================================================== */