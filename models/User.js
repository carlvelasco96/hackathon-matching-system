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
  preferences: { type: [String], required: true },
  connect: { type: Boolean, default: false }
});

/* ==========================================================
MIDDLEWARE
========================================================== */



/* ==========================================================
STATICS
========================================================== */

/**
 * Create a user instance
 * @param {Object} object 
 */
UserSchema.statics.build = function (object = {}) {
  return new Promise(async (resolve, reject) => {
    // Validation of properties
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

/**
 * 
 * @param {Object} query 
 * @returns 
 */
UserSchema.statics.findMatches = function (query = {}) {
  return new Promise(async (resolve, reject) => {
    // Fetch user of interest
    let user;
    try {
      user = await this.findOne(query);
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // Fetch all users
    let users;
    try {
      users = await this.find();
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // Find matches
    let matches = [];
    for (let i = 0; i < users.length; i++) {
      const otherUser = users[i];
      if (user.email === otherUser.email) {
        continue;
      }
      matches.push(otherUser);
    }
    // Return matches
    return resolve(matches);
  });
}

UserSchema.statics.reform = function (id, updates) {
  return new Promise(async (resolve, reject) => {
    // Fetch the user
    let user;
    try {
      user = await this.findById(id);
    } catch (error) {
      return reject({ status: "error", content: error });
    }
    // Update user
    for (const property in updates) {
      user[property] = updates[property];
    }
    // Save user
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