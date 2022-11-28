const productModel = require("../models/product");
const mainCategoryModel = require("../models/main_categories");
const subCategoryModel = require("../models/sub_categories");
const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const moment = require("moment");

module.exports = {
  /////////////////////////////////// SESSION MIDDLEWARE ///////////////////////////////////
  ProceedIfLoggedIn: (req, res, next) => {
    if (req.session.isAdminAuth) {
      next();
    } else {
      res.redirect("/admin/admin_login");
    }
  },
  ProceedIfLoggedOut: (req, res, next) => {
    if (!req.session.isAdminAuth) {
      next();
    } else {
      res.redirect("/admin/dashboard");
    }
  },

  /////////////////////////////////// RENDERS ///////////////////////////////////
  // RENDER DASHBOARD //
  dashboard: (req, res) => {
    res.render("admin/dashboard");
  },
  // LOGIN PAGE //
  admin_login_page: (req, res) => {
    res.render("admin/admin_login", {
      emailErr: req.session.emailError,
      passwordErr: req.session.passwordError,
    });
  },
  // RENDER PRODUCTS PAGE //
  products: async (req, res) => {
    let sort = { created_date: -1 };
    let products = await productModel
      .find({ is_deleted: false })
      .populate("category")
      .sort(sort);
    res.render("admin/products", { products, moment });
  },
  // RENDER ADD PRODUCT PAGE //
  add_products_page: async (req, res) => {
    let sub_categories = await subCategoryModel.find();
    res.render("admin/add_products", { sub_categories });
  },
  // RENDER EDIT PRODUCT PAGE //
  edit_products_page: async (req, res) => {
    let prodId = req.params.id;
    let product = await productModel.findOne({ _id: prodId });
    res.render("admin/edit_products", { product });
  },
  // RENDER MAIN CATEGORY //
  main_categories: async (req, res) => {
    let sort = { created_date: -1 };
    let main_categories = await mainCategoryModel.find().sort(sort);
    res.render("admin/main_categories", { main_categories, moment });
  },
  // RENDER ADD MAIN CATEGORY //
  get_add_main_category_page: (req, res) => {
    res.render("admin/add_main_category");
  },
  // RENDER EDIT MAIN CATEGORY PAGE //
  edit_main_category_page: async (req, res) => {
    let mCatId = req.params.id;
    let main_category = await mainCategoryModel.findOne({ _id: mCatId });
    res.render("admin/edit_main_category", { main_category });
  },
  // RENDER SUB CATEGORY //
  sub_categories: async (req, res) => {
    let sort = { created_date: -1 };
    let sub_categories = await subCategoryModel.find().sort(sort);
    res.render("admin/sub_categories", { sub_categories, moment });
  },
  // RENDER ADD SUB CATEGORY PAGE //
  get_add_sub_category_page: async (req, res) => {
    let main_categories = await mainCategoryModel.find();
    let sub_categories = await subCategoryModel.find();
    res.render("admin/add_sub_category", { main_categories, sub_categories });
  },
  // RENDER EDIT SUB CATEGORY PAGE //
  edit_sub_category_page: async (req, res) => {
    let sCatId = req.params.id;
    let main_categories = await mainCategoryModel.find();
    let sub_category = await subCategoryModel.findOne({ _id: sCatId });
    res.render("admin/edit_sub_category", { sub_category, main_categories });
  },
  // RENDER USERS //
  users: async (req, res) => {
    let sort = { created_date: -1 };
    let users = await userModel.find().sort(sort);
    res.render("admin/users", { users, moment });
  },

  /////////////////////////////////// ADD DATAS ///////////////////////////////////
  // ADD PRODUCTS //
  add_products: async function (req, res) {
    const { name, description, category, stock, price } = req.body; // asigning product data to variables.
    console.log("reached add_products");
    const created_date = new Date();
    req.files.forEach((img) => {});
    // console.log(req.files);
    const productImages =
      req.files != null ? req.files.map((img) => img.path) : null;
    const newProduct = new productModel({
      category,
      name,
      description,
      price,
      imgUrl: productImages,
      stock,
      created_date,
    });
    const result = await newProduct.save();
    res.redirect("/admin/products");
    console.log("...NEW PRODUCT ADDED...");
    console.log(result);
  },
  // ADD MAIN CATEGORY //
  add_main_category: async function (req, res) {
    const { name, description } = req.body; // asigning product data to variables.
    console.log(name);
    const created_date = new Date();
    const newMainCategory = new mainCategoryModel({
      name,
      description,
      created_date,
    });
    const result = await newMainCategory.save();
    res.redirect("/admin/main_categories");
    console.log("...NEW MAIN CATEGORY ADDED...");
    console.log(result);
  },
  // ADD SUB CATEGORY //
  add_sub_category: async function (req, res) {
    const { name, description, main_category } = req.body; // asigning product data to variables.
    console.log(name);
    const created_date = new Date();
    const newSubCategory = new subCategoryModel({
      name,
      description,
      main_category,
      created_date,
    });
    const result = await newSubCategory.save();
    res.redirect("/admin/sub_categories");
    console.log(result);
  },

  /////////////////////////////////// EDIT DATAS ///////////////////////////////////
  // EDIT PRODUCT //
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
  // EDIT MAIN CATEGORY //
  edit_main_category: async (req, res) => {
    const mCatId = req.params.id;
    const { name, description } = req.body;
    const modified_date = new Date();
    const save_main_category_edits = await mainCategoryModel.findOneAndUpdate(
      { _id: mCatId },
      {
        $set: {
          name,
          description,
          modified_date,
        },
      }
    );
    await save_main_category_edits.save().then(() => {
      res.redirect("/admin/main_categories");
    });
  },
  // EDIT SUB CATEGORY //
  edit_sub_category: async (req, res) => {
    const sCatId = req.params.id;
    const { name, description, main_category } = req.body;
    const modified_date = new Date();
    const save_sub_category_edits = await subCategoryModel.findOneAndUpdate(
      { _id: sCatId },
      {
        $set: {
          name,
          description,
          main_category,
          modified_date,
        },
      }
    );
    await save_sub_category_edits.save().then(() => {
      res.redirect("/admin/sub_categories");
    });
  },

  /////////////////////////////////// SOFT DELETE DATAS ///////////////////////////////////
  // DELETE PRODUCTS //
  delete_products: async (req, res) => {
    let prodId = req.params.id;
    console.log("reached admin controller");
    await productModel
      .findOneAndUpdate({ _id: prodId }, { is_deleted: true })
      .then((response) => {
        res.redirect("/admin/products");
      });
  },
  // DELETE MAIN CATEGORY //
  delete_main_category: async (req, res) => {
    let mCatId = req.params.id;
    console.log("reached delete category controller");
    await mainCategoryModel
      .findOneAndUpdate({ _id: mCatId }, { delete: true })
      .then((response) => {
        res.redirect("/admin/main_categories");
      });
  },
  // DELETE SUB CATEGORY //
  delete_sub_category: async (req, res) => {
    let sCatId = req.params.id;
    console.log("reached delete category controller");
    await subCategoryModel
      .findOneAndUpdate({ _id: sCatId }, { delete: true })
      .then((response) => {
        res.redirect("/admin/sub_categories");
      });
  },
  // BLOCK USER //
  blockUser: async (req, res) => {
    let id = req.params.id;
    await userModel.findByIdAndUpdate(
      { _id: id },
      { $set: { is_blocked: true } }
    );
    res.redirect("/admin/users");
  },

  /////////////////////////////////// UNDO SOFT DELETE ///////////////////////////////////
  // RESTORE MAIN CATEGORY //
  restore_main_category: async (req, res) => {
    let mCatId = req.params.id;
    console.log("reached restore category controller");
    await mainCategoryModel
      .findOneAndUpdate({ _id: mCatId }, { delete: false })
      .then((response) => {
        res.redirect("/admin/main_categories");
      });
  },
  // RESTORE SUB CATEGORY //
  restore_sub_category: async (req, res) => {
    let sCatId = req.params.id;
    console.log("reached restore category controller");
    await subCategoryModel
      .findOneAndUpdate({ _id: sCatId }, { delete: false })
      .then((response) => {
        res.redirect("/admin/sub_categories");
      });
  },
  // UNBLOCK USER //
  unblockUser: async (req, res) => {
    let id = req.params.id;
    await userModel.findByIdAndUpdate(
      { _id: id },
      { $set: { is_blocked: false } }
    );
    res.redirect("/admin/users");
  },

  /////////////////////////////////// LOGIN / LOGOUT ///////////////////////////////////
  // LOGIN //
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
  // LOGOUT //
  admin_logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) throw err;
      res.redirect("/admin/admin_login");
    });
  },
};
