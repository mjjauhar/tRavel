const productModel = require("../models/product");
const mainCategoryModel = require("../models/main_categories");
const subCategoryModel = require("../models/sub_categories");
const userModel = require("../models/user");
const orderModel = require("../models/order");
const couponModel = require("../models/coupon");
const bannerModel = require("../models/banner");
const addressModel = require("../models/address");
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
    let products = await productModel.find().populate("category").sort(sort);
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

  // RENDER ORDERS
  orders: async (req, res) => {
    let sort = { created_date: -1 };
    const all_orders = await orderModel
      .find()
      .populate("products.productId")
      .populate("userId")
      .sort(sort);
    // console.log(all_orders[0].userId);
    res.render("admin/orders", { all_orders, moment });
  },

  // RENDER BANNER PAGE
  banner: async (req, res) => {
    const banner = await bannerModel.find();
    console.log(banner);
    res.render("admin/banner", { banner, moment });
  },

  // RENDER ADD BANNER PAGE
  add_banner_page: async (req, res) => {
    res.render("admin/add_banner");
  },
  // RENDER EDIT BANNER PAGE
  edit_banner_page: async (req, res) => {
    const bannerId = req.params.id;
    const banner = await bannerModel.findOne({ _id: bannerId });
    res.render("admin/edit_banner", { banner });
  },

  // RENDER COUPON
  coupons: async (req, res) => {
    const coupons = await couponModel.find();
    res.render("admin/coupons", { coupons, moment });
  },

  // RENDER ADD COUPON
  add_coupons_page: async (req, res) => {
    res.render("admin/add_coupon");
  },
  // RENDER EDIT COUPON
  edit_coupons_page: async (req, res) => {
    const couponId = req.params.id;
    const coupon = await couponModel.findOne({ _id: couponId });
    res.render("admin/edit_coupon", { coupon });
  },

  /////////////////////////////////// ADD DATAS ///////////////////////////////////
  // ADD BANNER //
  add_banner: async (req, res) => {
    const { heading, description, extra_details } = req.body;
    req.files.forEach((img) => {});
    const bannerImages =
      req.files != null ? req.files.map((img) => img.path) : null;
    const created_date = new Date();
    const newBanner = new bannerModel({
      heading,
      description,
      extra_details,
      imgUrl: bannerImages,
      created_date,
    });
    await newBanner.save();
    res.redirect("/admin/banner");
  },

  // ADD COUPON //
  add_coupons: async (req, res) => {
    const { name, discount } = req.body;
    const created_date = new Date();
    const newCoupon = new couponModel({
      name,
      discount,
      users: [],
      created_date,
      modified_date: null,
    });
    await newCoupon.save();
    res.redirect("/admin/coupons");
  },

  // ADD PRODUCTS //
  add_products: async function (req, res) {
    const { name, description, category, stock, price } = req.body;
    const created_date = new Date();
    req.files.forEach((img) => {});
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
    await newProduct.save();
    res.redirect("/admin/products");
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
      modified_date: "",
    });
    const result = await newSubCategory.save();
    res.redirect("/admin/sub_categories");
    console.log(result);
  },

  /////////////////////////////////// EDIT DATAS ///////////////////////////////////
  // EDIT ORDER STATUS //
  edit_order_status: async (req, res) => {
    const itemId = req.params.itemId;
    const orderId = req.params.orderId;
    const status = req.params.status;
    console.log(itemId + "////" + orderId + "////" + status);
    if (status === "Delivered") {
      let delivered_date = new Date();
      await orderModel.updateOne(
        { _id: orderId, "products._id": itemId },
        { $set: { delivered_date, canceled_date: "" } }
      );
    }
    if (status === "Canceled") {
      let canceled_date = new Date();
      await orderModel.updateOne(
        { _id: orderId, "products._id": itemId },
        { $set: { canceled_date, delivered_date: "" } }
      );
    }
    await orderModel.updateOne(
      { _id: orderId, "products._id": itemId },
      { $set: { "products.$.status": status } }
    );
    res.redirect("back");
  },

  order_info: async (req, res) => {
    const prodId = req.params.id;
    const find_order = await orderModel
      .findOne({ "products.$._id": prodId })
      .populate("userId products.productId");
    const address_id = find_order.addressId;
    const find_address = await addressModel.findOne({
      "address.$._id": address_id,
    });
    const all_addresses = find_address.address;
    const all_products = find_order.products;
    console.log(all_products[0].status);
    let address_index;
    let product_index;
    all_addresses.forEach(function (address, index1) {
      let this_address_id = "" + address._id;
      let delivey_ad_id = "" + address_id;
      if (this_address_id === delivey_ad_id) {
        address_index = index1;
      }
    });
    all_products.forEach(function (prod, index2) {
      let this_prod_id = "" + prod.productId._id;
      let delivey_prod_id = "" + prodId;
      console.log(this_prod_id);
      if (this_prod_id === delivey_prod_id) {
        product_index = index2;
      }
    });
    console.log(all_products[product_index]);

    const ID = find_order._id;
    const CUSTOMER_NAME = `${find_order.userId.first_name} ${find_order.userId.last_name}`;
    const DELIVERY_ADDRESS = all_addresses[address_index];
    const DELIVERY_STATUS = all_products[product_index]?.status;
    const PRICE = all_products[product_index]?.subTotal;
    const PRODUCT_NAME = all_products[product_index]?.productId.name;
    const QUANTITY = all_products[product_index]?.quantity;
    const PAYMENT_DETAILS = find_order?.payment_status;
    const ORDER_DATE = find_order?.created_date;
    const PURCHASED_TOGETHER_WITH = all_products;
    const TOTAL_AMOUNT = find_order?.total_amount;
    res.render("admin/order_more_info", {
      ID,
      CUSTOMER_NAME,
      DELIVERY_ADDRESS,
      DELIVERY_STATUS,
      PRICE,
      QUANTITY,
      PAYMENT_DETAILS,
      PURCHASED_TOGETHER_WITH,
      TOTAL_AMOUNT,
      PRODUCT_NAME,
      ORDER_DATE,
    });
  },

  // EDIT PRODUCT //
  edit_products: async (req, res) => {
    const prodId = req.params.id;
    const { name, description, price, category, stock } = req.body;
    if (req.file) {
      const img = req.file;
      await productModel.findByIdAndUpdate(
        { _id: prodId },
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

  // EDIT BANNER //
  edit_banner: async (req, res) => {
    const bannerId = req.params.id;
    const { heading, description, extra_details } = req.body;
    const modified_date = new Date();
    if (req.file) {
      const img = req.file;
      await productModel.findByIdAndUpdate(
        { _id: bannerId },
        { $set: { imgUrl: img.path } }
      );
    }
    const save_edits = await bannerModel.findOneAndUpdate(
      { _id: bannerId },
      {
        $set: {
          heading,
          description,
          extra_details,
          modified_date,
        },
      }
    );
    await save_edits.save().then(() => {
      res.redirect("/admin/banner");
    });
  },
  // EDIT COUPON //
  edit_coupon: async (req, res) => {
    const couponId = req.params.id;
    const { name, discount, users } = req.body;
    const modified_date = new Date();
    const save_edits = await couponModel.findOneAndUpdate(
      { _id: couponId },
      {
        $set: {
          name,
          discount,
          modified_date,
        },
      }
    );
    await save_edits.save();

    res.redirect("/admin/coupons");
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
  // DELETE BANNER //
  disable_coupon: async (req, res) => {
    let couponId = req.params.id;
    await couponModel
      .findOneAndUpdate({ _id: couponId }, { disable: true }, { upsert: true })
      .then((response) => {
        res.redirect("/admin/coupons");
      });
  },
  enable_coupon: async (req, res) => {
    let couponId = req.params.id;
    await couponModel
      .findOneAndUpdate({ _id: couponId }, { disable: false }, { upsert: true })
      .then((response) => {
        res.redirect("/admin/coupons");
      });
  },

  delete_banner: async (req, res) => {
    let bannerId = req.params.id;
    await bannerModel
      .findOneAndUpdate({ _id: bannerId }, { is_deleted: true })
      .then((response) => {
        res.redirect("/admin/banner");
      });
  },
  // UNDO DELETE BANNER //
  restore_banner: async (req, res) => {
    let bannerId = req.params.id;
    await bannerModel
      .findOneAndUpdate({ _id: bannerId }, { is_deleted: false })
      .then((response) => {
        res.redirect("/admin/banner");
      });
  },

  // DELETE PRODUCTS //
  delete_products: async (req, res) => {
    let prodId = req.params.id;
    await productModel
      .findOneAndUpdate({ _id: prodId }, { is_deleted: true })
      .then((response) => {
        res.redirect("/admin/products");
      });
  },
  // RESTORE PRODUCTS //
  restore_products: async (req, res) => {
    let prodId = req.params.id;
    await productModel
      .findOneAndUpdate({ _id: prodId }, { is_deleted: false })
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
