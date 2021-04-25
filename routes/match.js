/* ==========================================================
MODULES
========================================================== */

const express = require("express");
const mongoose = require("mongoose");
const moment = require("moment-timezone");

/* ==========================================================
VARIABLES
========================================================== */

const router = new express.Router();

/* ==========================================================
MODELS
========================================================== */

const Match = require("../models/Match.js");
const Message = require("../models/Message.js");

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
router.get("/match/fetch-received/:id", async (req, res) => {
  // Declare variables
  const receiver = mongoose.Types.ObjectId(req.params.id);
  // Fetch matches
  let matches;
  try {
    matches = await Match.find({ receiver, status: "initiated" });
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

// @route   POST
// @desc    
// @access  PUBLIC
router.post("/match/delete", async (req, res) => {
  // Declare variables
  const id = mongoose.Types.ObjectId(req.body.id);
  const user = mongoose.Types.ObjectId(req.body.user);
  // Delete match
  try {
    await Match.demolish(id, user);
  } catch (data) {
    return res.send(data);
  }
  // Success handler
  return res.send({ status: "succeeded", content: "The match has been deleted." });
});

router.get("/match/fetch-messages/:id", async (req, res) => {
  // Declare variables
  const id = mongoose.Types.ObjectId(req.params.id);
  //
  let messages;
  try {
    messages = await Message.find({ match: id });
  } catch (error) {
    return res.send({ status: "error", content: error });
  }
  //
  messages.sort(sortMessages);
  //
  return res.send({ status: "succeeded", content: messages });
});

router.post("/match/send-message", async (req, res) => {
  // Declare variables
  const match = mongoose.Types.ObjectId(req.body.match);
  const sender = mongoose.Types.ObjectId(req.body.sender);
  const message = req.body.message;
  //
  let newMessage;
  try {
    newMessage = await Message.build({ match, sender, message });
  } catch (data) {
    return res.send(data);
  }
  //
  return res.send({ status: "succeeded", content: newMessage });
});

const sortMessages = (messageA, massageB) => {
  const dateA = messageA.date;
  const dateB = massageB.date;
  const momentA = moment(dateA);
  const momentB = moment(dateB);
  const difference = momentA.diff(momentB);
  if (difference > 0) {
    return -1;
  } else if (difference < 0) {
    return 1;
  } else {
    return 0;
  }
}

/* ==========================================================
EXPORT
========================================================== */

module.exports = router;

/* ==========================================================
END
========================================================== */