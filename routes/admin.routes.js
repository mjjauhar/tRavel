const express = require("express");
const app = express();
const adminController = require("../controllers/admin.controller");

// login
app
  .route("/admin_login")
  .get(adminController.admin_login_page)
  .post(adminController.admin_login);

// dashboard
app.route("/dashboard").get(adminController.dashboard);

// product management
app.route("/products").get(adminController.products);
app.route("/products/delete_product/:id").get(adminController.delete_products);
app.route("/products/edit_product/:id").get(adminController.edit_products_page);
app.route("/products/edit_product/:id").post(adminController.edit_products);
app
  .route("/products/add_product")
  .get(adminController.add_products_page)
  .post(adminController.add_products);

// user management
app. route("/users").get(adminController.users);
app.route('/users/block_user/:id').post(adminController.blockUser);
app.route('/users/unblock_user/:id').post(adminController.unblockUser);


// Admin logout
app.route("/admin_logout").post(adminController.admin_logout);

module.exports = app;
