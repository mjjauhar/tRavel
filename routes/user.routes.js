const express = require("express");
const app = express();
const {
  landing_page,
  proceedIfLoggedIn,
  proceedIfLoggedOut,
  logout,
  user_account,
  edit_user,
  user_login_page,
  user_login,
  user_signup_page,
  user_signup,
  otp_login,
  resend_otp,
  user_address,
  add_user_address,
  edit_user_address,
} = require("../controllers/user.controllers");

app.route("/").get(landing_page);
app.route("/logout").post(proceedIfLoggedIn, logout);
app.route("/user_account").get(proceedIfLoggedIn, user_account);
app.route("/user_account/:id").post(proceedIfLoggedIn, edit_user);

app.route("/user_address").get(proceedIfLoggedIn, user_address);
app.route("/add/user_address/:id").post(proceedIfLoggedIn, add_user_address);
app.route("/edit/user_address/:id").post(proceedIfLoggedIn, edit_user_address);

app
  .route("/user_login")
  .get(proceedIfLoggedOut, user_login_page)
  .post(proceedIfLoggedOut, user_login);

app
  .route("/user_signup")
  .get(proceedIfLoggedOut, user_signup_page)
  .post(proceedIfLoggedOut, user_signup);

app.route("/otp_login/:id").post(proceedIfLoggedOut, otp_login);

app.route("/resend").post(proceedIfLoggedOut, resend_otp);

module.exports = app;
