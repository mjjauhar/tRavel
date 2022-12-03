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
  orders,
  edit_order_status,
  order_info,
  banner,
  add_banner,
  add_banner_page,
  edit_banner,
  edit_banner_page,
  delete_banner,
  restore_banner,
  restore_products,
  coupons,
  add_coupons,
  add_coupons_page,
  edit_coupon,
  edit_coupons_page,
  disable_coupon,
  enable_coupon,
} = require("../controllers/admin.controller");
const { proceedIfLoggedIn } = require("../controllers/user.controllers");
const coupon = require("../models/coupon");

// LOGIN
app
  .route("/admin_login")
  .get(ProceedIfLoggedOut, admin_login_page)
  .post(ProceedIfLoggedOut, admin_login);

// DASHBOARD
app.route("/dashboard").get(ProceedIfLoggedIn, dashboard);

// PRODUCT
app.route("/products").get(ProceedIfLoggedIn, products);
app.route("/product/delete/:id").get(ProceedIfLoggedIn, delete_products);
app.route("/product/restore/:id").get(ProceedIfLoggedIn, restore_products);
app
  .route("/products/edit_product/:id")
  .get(ProceedIfLoggedIn, edit_products_page)
  .post(ProceedIfLoggedIn, edit_products);
app
  .route("/products/add_product")
  .get(ProceedIfLoggedIn, add_products_page)
  .post(ProceedIfLoggedIn, add_products);

// ORDERS
app.route("/orders").get(ProceedIfLoggedIn, orders);
app.route("/orders/:Oid/:Pid").get(ProceedIfLoggedIn, order_info);
app
  .route("/orders/update_status/:itemId/:orderId/:status")
  .post(ProceedIfLoggedIn, edit_order_status);

// BANNER
app.route("/banner").get(ProceedIfLoggedIn, banner);
app
  .route("/banner/add")
  .get(ProceedIfLoggedIn, add_banner_page)
  .post(ProceedIfLoggedIn, add_banner);
app
  .route("/banner/edit/:id")
  .get(proceedIfLoggedIn, edit_banner_page)
  .post(proceedIfLoggedIn, edit_banner);
app.route("/banner/delete/:id").get(proceedIfLoggedIn, delete_banner);
app.route("/banner/restore/:id").get(proceedIfLoggedIn, restore_banner);

// COUPON
app.route("/coupons").get(ProceedIfLoggedIn, coupons);
app
  .route("/coupons/add")
  .get(ProceedIfLoggedIn, add_coupons_page)
  .post(ProceedIfLoggedIn, add_coupons);
app
  .route("/coupons/edit/:id")
  .get(proceedIfLoggedIn, edit_coupons_page)
  .post(proceedIfLoggedIn, edit_coupon);
app.route("/coupon/disable/:id").get(proceedIfLoggedIn, disable_coupon);
app.route("/coupon/enable/:id").get(proceedIfLoggedIn, enable_coupon);

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
