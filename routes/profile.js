/* ==========================================================
MODULES
========================================================== */

const express = require("express");

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

router.get("/user/:email/fetch-matches", async () => {
  // Declare variables
});

/* ==========================================================
EXPORT
========================================================== */

module.exports = router;

/* ==========================================================
END
========================================================== */