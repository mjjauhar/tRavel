const mongoose = require("mongoose");
const session = require("express-session");
const mongoDBSession = require("connect-mongodb-session")(session);

// Set up default mongoose connection
// const mongoURI = "mongodb://localhost:27017/travel";
// Mongo DB conncetion

const mongoURI =
  "mongodb+srv://t-ravel:ZjXAx6cMuoz35E9X@cluster0.mktchvf.mongodb.net/test?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

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
};
