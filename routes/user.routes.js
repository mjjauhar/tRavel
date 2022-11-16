const express = require("express");
const app = express();
const {
  landing_page,
  proceedIfLoggedIn,
  proceedIfLoggedOut,
  logout,
  account,
  edit_user,
  login_page,
  login,
  signup_page,
  signup,
  otp_validation,
  resend_otp,
  address,
  add_address,
  edit_address,
  edit_address_page,
} = require("../controllers/user.controllers");

app.route("/").get(landing_page);
app.route("/user/logout").post(proceedIfLoggedIn, logout);
app.route("/user/account").get(proceedIfLoggedIn, account);
app.route("/user/account/:id").post(proceedIfLoggedIn, edit_user);

app.route("/user/address").get(proceedIfLoggedIn, address);
app.route("/user/add/address/:id").post(proceedIfLoggedIn, add_address);
app.route("/user/edit/address/:id").get(proceedIfLoggedIn, edit_address_page);
app.route("/user/edit/address/:id").post(proceedIfLoggedIn, edit_address);

app
  .route("/user/login")
  .get(proceedIfLoggedOut, login_page)
  .post(proceedIfLoggedOut, login);

app
  .route("/user/signup")
  .get(proceedIfLoggedOut, signup_page)
  .post(proceedIfLoggedOut, signup);

app.route("/user/signup/otp/:id").post(proceedIfLoggedOut, otp_validation);

app.route("/user/otp/resend").post(proceedIfLoggedOut, resend_otp);

module.exports = app;
