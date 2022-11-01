const express = require("express");
const app = express();
const userController = require("../controllers/user.controllers");

app.route("/").get(userController.landing_page);

app
  .route("/user_login")
  .get(userController.user_login_page)
  .post(userController.user_login);

app
  .route("/user_signup")
  .get(userController.user_signup_page)
  .post(userController.user_signup);

module.exports = app;
