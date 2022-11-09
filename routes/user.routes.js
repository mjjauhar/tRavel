const express = require("express");
const app = express();
const userController = require("../controllers/user.controllers");

app.route("/").get(userController.landing_page);
app.route("/logout").post(userController.logout);
app.route("/user_account").get(userController.user_account);

app
  .route("/user_login")
  .get(userController.user_login_page)
  .post(userController.user_login);

app
  .route("/user_signup")
  .get(userController.user_signup_page)
  .post(userController.user_signup);

app
  .route("/otp_login/:id")
  .post(userController.otp_login);

  app.route('/resend').post(userController.resend_otp)

module.exports = app;
