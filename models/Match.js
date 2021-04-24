/* ==========================================================
MODULES
========================================================== */

const mongoose = require("mongoose");
const moment = require("moment-timezone");

/* ==========================================================
VARIABLES
========================================================== */

const Schema = mongoose.Schema;

/* ==========================================================
OTHER MODEL
========================================================== */

const User = require("./User.js");

/* ==========================================================
MODEL
========================================================== */

const MatchSchema = new Schema({
  receiver: { type: Schema.Types.ObjectId, required: true },
  sender: { type: Schema.Types.ObjectId, required: true },
  status: { type: String, default: "initiated" },
  date: {
    initiated: { type: String, required: true },
    accepted: { type: String, default: "" }
  }
});

/* ==========================================================
MIDDLEWARE
========================================================== */



/* ==========================================================
STATICS
========================================================== */

MatchSchema.statics.initiate = function (sender, receiver) {
  return new Promise(async (resolve, reject) => {
    // VALIDATION
    // TO DO
    // Validation of receiver's availability to connect
    let receiverUser;
    try {
      receiverUser = await User.findById(receiver);
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    if (!receiverUser) {
      return reject({ status: "failed", content: "The user does not exist." });
    } else if (!receiverUser.connect) {
      return reject({ status: "failed", content: "The user is not ready to connect." });
    }
    // Check if the receiver has already send the user a request
    let match;
    try {
      match = await this.findOne({ receiver: sender, sender: receiver });
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    if (match) {
      return reject({ status: "failed", content: "You already have received a match request from this user. Check your requests." });
    }
    // Build the match instance
    const currentDate = moment().tz("Pacific/Auckland").format();
    const match = new this({
      receiver, sender, date: { initiated: currentDate }
    });
    // Save the new match instance
    try {
      await match.save();
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // Success handler
    return resolve(match);
  });
}

/**
 * 
 * @param {mongoose.Types.ObjectId} id Id of the match
 * @param {string} receiver The email of the person who received the request
 * @returns 
 */
MatchSchema.statics.accept = function (id, receiver) {
  return new Promise(async (resolve, reject) => {
    // VALIDATION
    // TO DO
    // Validate the match
    let match;
    try {
      match = await this.findById(id);
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    if (!match) {
      return reject({ status: "failed", content: "There is no match with this ID." });
    } else if (match.receiver !== receiver) {
      return reject({ status: "failed", content: "This user is not the receiver of this match, and therefore, cannot accept this match." });
    }
    // Update the Match
    match.status = "accepted";
    // Save the Match
    try {
      await match.save();
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // Success handler
    return resolve(match);
  });
}

/* ==========================================================
METHODS
========================================================== */



/* ==========================================================
EXPORT
========================================================== */

module.exports = Match = mongoose.model("matches", MatchSchema);

/* ==========================================================
END
========================================================== */