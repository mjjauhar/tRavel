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
  delete_address,
  product_page,
  cart,
  add_to_cart,
  wishlist,
  add_to_wishlist,
  remove_from_wishlist,
  remove_from_cart,
  increment_cart_prod_qty,
  decrement_cart_prod_qty,
} = require("../controllers/user.controllers");

app.route("/").get(landing_page);
app.route("/p/:id/:productname").get(product_page);
app.route("/cart").get(cart);
app.route("/add/cart/:id").post(add_to_cart);
app.route("/increment/qty/cart/:proId/:proPrice").post(increment_cart_prod_qty);
app.route("/decrement/qty/cart/:proId/:proPrice").post(decrement_cart_prod_qty);
app.route("/remove/cart/:proId/:proQty").post(remove_from_cart);

app.route("/wishlist").get(wishlist);
app.route("/add/wishlist/:id").post(add_to_wishlist);
app.route("/remove/wishlist/:id").post(remove_from_wishlist);

app.route("/user/logout").post(proceedIfLoggedIn, logout);
app.route("/user/account").get(proceedIfLoggedIn, account);
app.route("/user/account/:id").post(proceedIfLoggedIn, edit_user);

app.route("/user/address").get(proceedIfLoggedIn, address);
app.route("/user/add/address/:id").post(proceedIfLoggedIn, add_address);
app.route("/user/delete/address/:id").post(proceedIfLoggedIn, delete_address)
app
  .route("/user/edit/address/:id")
  .get(proceedIfLoggedIn, edit_address_page)
  .post(proceedIfLoggedIn, edit_address);

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
