// npm modules
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const session = require("express-session");
const mongoDBSession = require("connect-mongodb-session")(session);
require("dotenv").config();
const ejs = require("ejs");
const multer = require("multer");

// custom imports
const userRouter = require("./routes/user.routes");
const adminRouter = require("./routes/admin.routes");

const mongoURI = process.env.ATLAS_DB_LINK;
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    console.log("MongoDB connected");
    app.listen(7000, () =>
      console.log("Server running on port http://localhost:7000/")
    );
  })
  .catch((err) => console.log(err));

const store = new mongoDBSession({
  uri: mongoURI,
  collection: "mySession",
});

// session configurations
app.use(function (req, res, next) {
  res.header("Cache-Control", "no-cache, private, no-store, must-revalidate");
  next();
});
app.use(
  session({
    secret: "mykey",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// photo and other file upload using multer
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/product_img");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
  },
});

app.use(multer({ storage: fileStorage }).array("imgUrl", 5));

// static folder
app.use("/public", express.static("public"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use("/admin", adminRouter);
app.use("/", userRouter);

app.use("*", (req, res) => {
  res.render("404/404");
});

// app.listen(8000, () =>
//   console.log("Server running on port http://localhost:8000/")
// );

// Set up default mongoose connection
// const mongoURI = "mongodb://localhost:27017/travel";
// Mongo DB conncetion
