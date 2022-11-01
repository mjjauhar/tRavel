const mongoose = require("mongoose");
const session = require("express-session");
const mongoDBSession = require("connect-mongodb-session")(session);

// Set up default mongoose connection
const mongoURI = "mongodb://localhost:27017/travel";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    console.log("MongoDB connected");
  });

const store = new mongoDBSession({
  uri: mongoURI,
  collection: "mySession",
});

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

module.exports = {
    mongoose,
    db,
    store,
    mongoURI,
}