const productModel = require("../models/product");
const userModel = require("../models/user");
const bcrypt = require("bcrypt");

module.exports = {
  // SHOW DASHBOARD
  dashboard: (req, res) => {
    if (req.session.isAdminAuth) {
      res.render("admin/dashboard");
    } else {
      res.redirect("/admin/admin_login");
    }
  },

  // SHOW PRODUCTS PAGE
  products: async (req, res) => {
    if (req.session.isAdminAuth) {
      let products = await productModel.find({ is_deleted: false });
      console.log(products);
      res.render("admin/products", { products });
    } else {
      res.redirect("/admin/admin_login");
    }
  },

  // SHOW ADD PRODUCT PAGE
  add_products_page: (req, res) => {
    if (req.session.isAdminAuth) {
      res.render("admin/add_products");
    } else {
      res.redirect("/admin/admin_login");
    }
  },

  // ADD PRODUCTS
  add_products: async function (req, res) {
    const { name, description, category, stock, price } = req.body; // asigning product data to variables.
    console.log("reached add_products");
    const newProduct = new productModel({
      name,
      description,
      price,
      imgUrl: req.file.path,
      category,
      stock,
    });
    const result = await newProduct.save();
    res.redirect("/admin/products");
    console.log(result);
  },

  // EDIT PRODUCT
  edit_products: async (req, res) => {
    const prodId = req.params.id;
    const { name, description, price, category, stock } = req.body;
    if (req.file) {
      const img = req.file;
      await productModel.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: { imgUrl: img.path } }
      );
    }
    const save_edits = await productModel.findOneAndUpdate(
      { _id: prodId },
      {
        $set: {
          name,
          description,
          price,
          category,
          stock,
        },
      }
    );
    await save_edits.save().then(() => {
      res.redirect("/admin/products");
    });
  },

  // SHOW EDIT PRODUCT PAGE
  edit_products_page: async (req, res) => {
    let prodId = req.params.id;
    let product = await productModel.findOne({ _id: prodId });
    if (req.session.isAdminAuth) {
      res.render("admin/edit_products", { product });
    } else {
      res.redirect("/admin/admin_login");
    }
  },

  // DELETE PRODUCTS
  delete_products: async (req, res) => {
    let prodId = req.params.id;
    console.log("reached admin controller");
    await productModel
      .findOneAndUpdate({ _id: prodId }, { is_deleted: true })
      .then((response) => {
        res.redirect("/admin/products");
      });
  },
  users: async (req, res) => {
    if (req.session.isAdminAuth) {
      let users = await userModel.find();
      console.log(users);
      res.render("admin/users", { users });
    } else {
      res.redirect("/admin/admin_login");
    }
  },

  // LOGIN PAGE
  admin_login_page: (req, res) => {
    if (!req.session.isAdminAuth) {
      res.render("admin/admin_login", {
        emailErr: req.session.emailError,
        passwordErr: req.session.passwordError,
      });
    } else {
      res.redirect("/admin/dashboard");
    }
  },

  //LOGIN
  admin_login: async (req, res) => {
    const { email, password } = req.body; // asigning user entered datas to variables.
    const admin = await userModel.findOne({
      $and: [{ email: email }, { type: "admin" }],
    }); // checking if the admin email exist in database.
    req.session.emailError = false;
    req.session.passwordError = false;
    if (!admin) {
      req.session.emailError = true;
      return res.redirect("/admin/admin_login");
    } // If entered email doesn't exist..
    const isMatch = await bcrypt.compare(password, admin.password); // If it does exist, check password..
    if (!isMatch) {
      req.session.passwordError = true;
      return res.redirect("/admin/admin_login");
    } // If the password is incorrect..
    req.session.user = admin.username; // else continue
    req.session.isAdminAuth = true; // then save the state that the user is authenticated.
    res.redirect("/admin/dashboard");
  },

  //LOGOUT
  admin_logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) throw err;
      res.redirect("/admin/admin_login");
    });
  },
};
