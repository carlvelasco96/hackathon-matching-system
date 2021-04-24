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

const Match = require("../models/Match.js");

/* ==========================================================
ROUTES
========================================================== */

// @route   POST
// @desc    
// @access  PUBLIC
router.post("/match/initiate", async (req, res) => {
  // Declare variables
  const receiver = mongoose.Types.ObjectId(req.body.receiver);
  const sender = mongoose.Types.ObjectId(req.body.sender);
  // Initiate match request
  let match;
  try {
    match = await Match.initiate(sender, receiver);
  } catch (data) {
    return res.send(data);
  }
  // Success handler
  return res.send({ status: "succeeded", content: match });
});

// @route   POST
// @desc    
// @access  PUBLIC
router.post("/match/accept", async (req, res) => {
  // Declare variables
  const receiver = mongoose.Types.ObjectId(req.body.receiver);
  const id = mongoose.Types.ObjectId(req.body.id);
  // Accept the match request
  let match;
  try {
    match = await Match.accept(id, receiver);
  } catch (data) {
    return res.send(data);
  }
  // Success handler
  return res.send({ status: "succeeded", content: match });
});

// @route   GET
// @desc    
// @access  PUBLIC
router.get("/match/fetch-initiated/:id", async (req, res) => {
  // Declare variables
  const sender = mongoose.Types.ObjectId(req.params.id);
  // Fetch matches
  let matches;
  try {
    matches = await Match.find({ sender, status: "initiated" });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // Success handler
  return res.send({ status: "succeeded", content: matches });
});

// @route   GET
// @desc    
// @access  PUBLIC
router.get("/match/fetch-approved/:id", async (req, res) => {
  // Declare variables
  const id = mongoose.Types.ObjectId(req.params.id);
  // Fetch matches
  // Sent
  let sentMatches;
  try {
    sentMatches = await Match.find({ sender: id, status: "accepted" });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  // Received
  let receivedMatches;
  try {
    receivedMatches = await Match.find({ receiver: id, status: "accepted" });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  const matches = sentMatches.concat(receivedMatches);
  // Success handler
  return res.send({ status: "succeeded", content: matches });
});

/* ==========================================================
EXPORT
========================================================== */

module.exports = router;

/* ==========================================================
END
========================================================== */