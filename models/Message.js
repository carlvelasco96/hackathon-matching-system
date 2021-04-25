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
MODEL
========================================================== */

const MessageSchema = new Schema({
  match: { type: Schema.Types.ObjectId, required: true },
  sender: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: String, required: true }
});

/* ==========================================================
MIDDLEWARE
========================================================== */



/* ==========================================================
STATICS
========================================================== */

MessageSchema.statics.build = function (object = {}) {
  return new Promise(async (resolve, reject) => {
    // Add date
    const currentDate = moment().tz("Pacific/Auckland").format();
    object.date = currentDate;
    // Create instance
    const newMessage = new this(object);
    // Save instance
    try {
      await newMessage.save();
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // Success handler
    return resolve(newMessage);
  });
}

/* ==========================================================
METHODS
========================================================== */



/* ==========================================================
EXPORT
========================================================== */

module.exports = Message = mongoose.model("messages", MessageSchema);

/* ==========================================================
END
========================================================== */