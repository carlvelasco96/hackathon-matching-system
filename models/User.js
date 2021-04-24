/* ==========================================================
MODULES
========================================================== */

const mongoose = require("mongoose");

/* ==========================================================
VARIABLES
========================================================== */

const Schema = mongoose.Schema;

/* ==========================================================
MODEL
========================================================== */

const UserSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  bio: { type: String, required: true },
  picture: { type: String, required: true },
  location: {
    street: { type: String, required: true },
    suburb: { type: String, required: true },
    city: { type: String, required: true },
    postcode: { type: Number, required: true },
    country: { type: String, required: true }
  },
  hobbies: { type: [String], required: true },
  interests: { type: [String], required: true },
  preferences: { type: [String], required: true }
});

/* ==========================================================
MIDDLEWARE
========================================================== */



/* ==========================================================
STATICS
========================================================== */

/**
 * Create a user instance
 * @param {*} object 
 * @param {*} save
 */
UserSchema.statics.build = function (object = {}) {
  return new Promise(async (resolve, reject) => {
    // Validation properties
    // TO DO
    // Create instance
    const user = new this(object);
    // Save instance
    try {
      await user.save();
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // Success handler
    return resolve(user);
  });
}

/* ==========================================================
METHODS
========================================================== */



/* ==========================================================
EXPORT
========================================================== */

module.exports = User = mongoose.model("users", UserSchema);

/* ==========================================================
END
========================================================== */