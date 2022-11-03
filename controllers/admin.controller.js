const productModel = require("../models/product");
const adminModel = require("../models/user");
const bcrypt = require("bcrypt");

module.exports = {
  dashboard: (req, res) => {
    if (req.session.isAuth) {
      res.render("admin/dashboard");
    } else {
      res.redirect("/admin/admin_login");
    }
  },
  products: (req, res) => {
    if (req.session.isAuth) {
      res.render("admin/products");
    } else {
      res.redirect("/admin/admin_login");
    }
  },
  add_products_page: (req, res) => {
    if (req.session.isAuth) {
      res.render("admin/add_products");
    } else {
      res.redirect("/admin/admin_login");
    }
  },
  add_products: async function (req, res) {
    const { name, description, product_category, stock, price } =
      req.body; // asigning product data to variables.
    console.log("reached add_products");
    const newProduct = new productModel({
      name,
      description,
      price,
      imgUrl: req.file.path,
      product_category,
      stock,
    }); 

    const result = await newProduct.save();
    res.redirect("/admin/products");
    console.log(result);
  },
  admin_login_page: (req, res) => {
    if (!req.session.isAuth) {
      res.render("admin/admin_login", { loginErr: req.session.loginError });
    } else {
      res.redirect("/admin/dashboard");
    }
  },
  admin_login: async (req, res) => {
    const { email, password } = req.body; // asigning user entered datas to variables.
    const admin = await adminModel.findOne({
      $and: [{ email: email }, { type: "admin" }],
    }); // checking if the admin email exist in database.
    if (!admin) {
      req.session.loginError = "Invalid email or password";
      return res.redirect("/admin/admin_login");
    } // If entered email doesn't exist..
    const isMatch = await bcrypt.compare(password, admin.password); // If it does exist, check password..
    if (!isMatch) {
      req.session.loginError = "Invalid email or password";
      return res.redirect("/admin/admin_login");
    } // If the password is incorrect..
    req.session.user = admin.username; // else continue
    req.session.isAuth = true; // then save the state that the user is authenticated.
    res.redirect("/admin/dashboard");
  },
  admin_logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) throw err;
      res.redirect("/admin/admin_login");
    });
  },
};
