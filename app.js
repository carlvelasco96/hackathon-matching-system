/* ==========================================================
MODULES
========================================================== */

const express = require("express");
const mongoose = require("mongoose");

/* ==========================================================
VARIABLES
========================================================== */

const app = express();
const PORT = process.env.PORT || 80;
const MONGODB_URI = "mongodb+srv://roundtable:carlosandcarl@cluster0.acw3m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

/* ==========================================================
DATABASE
========================================================== */

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true,
});

/* ==========================================================
SERVER
========================================================== */

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));

/* ==========================================================
MIDDLEWARES
========================================================== */

// Serve Static Files
app.use(express.static(__dirname));
// Parsing of Incoming Data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ==========================================================
ROUTES
========================================================== */

const general = require("./routes/general.js");
app.use(general);
const profile = require("./routes/profile.js");
app.use(profile);

/* ==========================================================
END
========================================================== */