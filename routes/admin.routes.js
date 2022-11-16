const express = require("express");
const app = express();
const {
  admin_login_page,
  admin_login,
  ProceedIfLoggedIn,
  ProceedIfLoggedOut,
  dashboard,
  products,
  delete_products,
  edit_products_page,
  edit_products,
  add_products_page,
  add_products,
  main_categories,
  get_add_main_category_page,
  add_main_category,
  users,
  blockUser,
  unblockUser,
  admin_logout,
  delete_main_category,
  edit_main_category,
  edit_main_category_page,
  restore_main_category,
  sub_categories,
  get_add_sub_category_page,
  add_sub_category,
  delete_sub_category,
  restore_sub_category,
  edit_sub_category_page,
  edit_sub_category,
} = require("../controllers/admin.controller");

// LOGIN
app
  .route("/admin_login")
  .get(ProceedIfLoggedOut, admin_login_page)
  .post(ProceedIfLoggedOut, admin_login);

// DASHBOARD
app.route("/dashboard").get(ProceedIfLoggedIn, dashboard);

// PRODUCT
app.route("/products").get(ProceedIfLoggedIn, products);
app
  .route("/products/delete_product/:id")
  .get(ProceedIfLoggedIn, delete_products);
app
  .route("/products/edit_product/:id")
  .get(ProceedIfLoggedIn, edit_products_page)
  .post(ProceedIfLoggedIn, edit_products);
app
  .route("/products/add_product")
  .get(ProceedIfLoggedIn, add_products_page)
  .post(ProceedIfLoggedIn, add_products);

// MAIN CATEGORY
app.route("/main_categories").get(ProceedIfLoggedIn, main_categories);
app
  .route("/main_categories/add_main_category")
  .get(ProceedIfLoggedIn, get_add_main_category_page)
  .post(ProceedIfLoggedIn, add_main_category);
app
  .route("/main_categories/delete_main_category/:id")
  .get(ProceedIfLoggedIn, delete_main_category);
app
  .route("/main_categories/restore_main_category/:id")
  .get(ProceedIfLoggedIn, restore_main_category);
app
  .route("/main_categories/edit_main_category/:id")
  .get(ProceedIfLoggedIn, edit_main_category_page)
  .post(ProceedIfLoggedIn, edit_main_category);

// SUB CATEGORY
app.route("/sub_categories").get(ProceedIfLoggedIn, sub_categories);
app
  .route("/sub_categories/add_sub_category")
  .get(ProceedIfLoggedIn, get_add_sub_category_page)
  .post(ProceedIfLoggedIn, add_sub_category);
app
  .route("/sub_categories/delete_sub_category/:id")
  .get(ProceedIfLoggedIn, delete_sub_category);
app
  .route("/sub_categories/restore_sub_category/:id")
  .get(ProceedIfLoggedIn, restore_sub_category);
app
  .route("/sub_categories/edit_sub_category/:id")
  .get(ProceedIfLoggedIn, edit_sub_category_page)
  .post(ProceedIfLoggedIn, edit_sub_category);

// USER
app.route("/users").get(ProceedIfLoggedIn, users);
app.route("/users/block_user/:id").post(ProceedIfLoggedIn, blockUser);
app.route("/users/unblock_user/:id").post(ProceedIfLoggedIn, unblockUser);

// LOGOUT
app.route("/admin_logout").post(ProceedIfLoggedIn, admin_logout);

module.exports = app;
