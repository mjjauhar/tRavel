const express = require("express");
const app = express();
const adminController = require("../controllers/admin.controller");

app
  .route("/admin_login")
  .get(adminController.admin_login_page)
  .post(adminController.admin_login);
  
app.route("/dashboard").get(adminController.dashboard);
app.route("/products").get(adminController.products);
app
  .route("/products/add_products")
  .get(adminController.add_products_page)
  .post(adminController.add_products);

app.route("/admin_logout").post(adminController.admin_logout);


module.exports = app;
