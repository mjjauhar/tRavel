// npm modules
const express = require("express");
const session = require("express-session");
const app = express();
const ejs = require("ejs");

// custom imports
const connection = require("./config/connection");
const userRouter = require("./routes/user.routes");

// session configurations
app.use(function (req, res, next) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate');
  next();
});
app.use(
  session({
    secret: "mykey",
    resave: false,
    saveUninitialized: false,
    store: connection.store,
  })
);

// static folder
app.use("/public", express.static("public"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use("/", userRouter);

app.listen(5000, () =>
  console.log("Server running on port http://localhost:5000/")
);
