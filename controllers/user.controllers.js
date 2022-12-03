const userModel = require("../models/user");
const productModel = require("../models/product");
const wishlistModel = require("../models/wishlist");
const cartModel = require("../models/cart");
const addressModel = require("../models/address");
const orderModel = require("../models/order");
const bannerModel = require("../models/banner");
const couponModel = require("../models/coupon");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const moment = require("moment");
const Razorpay = require("razorpay");
require("dotenv").config();

/////////////////////////////////// SESSION MIDDLEWARE ///////////////////////////////////
const proceedIfLoggedIn = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect("/");
  }
};
const proceedIfLoggedOut = (req, res, next) => {
  if (!req.session.isAuth) {
    next();
  } else {
    res.redirect("/");
  }
};

/////////////////////////////////// RENDERS ///////////////////////////////////
// RENDER LANDING PAGE
const landing_page = async (req, res) => {
  const userId = req.session.userId;
  let products = await productModel.find({
    is_deleted: false,
  });
  let banners = await bannerModel.find({
    is_deleted: false,
  });
  const wishlist = await wishlistModel
    .findOne({ userId: userId })
    .populate("productId");
  let wishlistItems;
  if (wishlist != null) {
    wishlistItems = wishlist?.productId;
  } else {
    wishlistItems = [];
  }
  console.log(banners);
  if (req.session.isAuth) {
    res.render("user/landing_page", {
      login: true,
      products,
      banners,
      wishlistItems,
    });
  } else {
    res.render("user/landing_page", {
      login: false,
      products,
      banners,
      wishlistItems,
    });
  }
};
// RENDER PRODUCT INFO
const product_page = async (req, res) => {
  const userId = req.session.userId;
  const proId = req.params.id;
  const cart = await cartModel.findOne({ userId });
  let cartItems;
  if (cart != null) {
    cartItems = cart?.products;
  } else {
    cartItems = [];
  }
  let product = await productModel
    .findOne({
      is_deleted: false,
      _id: proId,
    })
    .populate("category");
  console.log(product.category);
  const wishlist = await wishlistModel
    .findOne({ userId: userId })
    .populate("productId");
  let wishlistItems;
  if (wishlist != null) {
    wishlistItems = wishlist?.productId;
  } else {
    wishlistItems = [];
  }
  if (req.session.isAuth) {
    res.render("user/product_page", {
      login: true,
      product,
      wishlistItems,
      cartItems,
    });
  } else {
    res.render("user/product_page", {
      login: false,
      product,
      wishlistItems,
      cartItems: [],
    });
  }
};

// RENDER MY ORDERS PAGE
const my_orders = async (req, res) => {
  let sort = { created_date: -1 };
  const userId = req.session.userId;
  const user = await userModel.find({ _id: userId });
  const full_name = `${user[0].first_name} ${user[0].last_name}`;
  const phone_no = user[0].phone_no;
  const orders = await orderModel
    .find({ userId })
    .populate("products.productId")
    .populate("products.productId.category")
    .sort(sort);
  console.log(orders);
  res.render("user/my_orders", {
    orders,
    moment,
    full_name,
    phone_no,
    login: true,
  });
};

// CANCEL ORDER //
const cancel_order = async (req, res) => {
  const itemId = req.params.itemId;
  const orderId = req.params.orderId;
  let canceled_date = new Date();
  await orderModel.updateOne(
    { _id: orderId, "products._id": itemId },
    {
      $set: {
        canceled_date,
        delivered_date: "",
        "products.$.status": "Canceled",
      },
    }
  );
  res.redirect("/my_orders");
};

// RENDER CART
const cart = async (req, res) => {
  const userId = req.session.userId;
  const cart = await cartModel
    .findOne({ userId })
    .populate("products.productId");
  if (cart) {
    let itemsInCart;
    let cart_total;
    let cartId;
    let coupon_applied = false;
    if (cart != null) {
      itemsInCart = cart.products;
      cartId = cart._id;
      cart_total = cart.grandTotal;
      coupon_applied = true;
      if (cart_total === 0) {
        coupon_applied = false;
        cart_total = cart.cartTotal;
      }
    }
    // console.log(cartId);
    res.render("user/cart", {
      login: true,
      itemsInCart,
      cart_total,
      cartId,
      coupon_applied,
    });
  } else {
    res.render("user/cart", {
      login: true,
      itemsInCart: [],
      cart_total: 0,
      cartId: {},
      coupon_applied: false,
    });
  }
};
//ADD TO CART
const add_to_cart = async (req, res) => {
  const productId = req.params.id;
  const userId = req.session.userId;
  const cartExist = await cartModel.findOne({ userId });
  const product = await productModel.findOne({ _id: productId });
  const subTotal = product.price;
  if (cartExist) {
    let prodExistInCart = await cartModel.findOne({
      userId,
      "products.productId": productId,
    });
    if (prodExistInCart === null) {
      await cartModel.findOneAndUpdate(
        { userId },
        {
          $addToSet: { products: { productId, subTotal } },
          $inc: { cartTotal: subTotal },
        }
      );
    }
  } else {
    const new_cart = new cartModel({
      userId,
      products: [{ productId, subTotal }],
      cartTotal: subTotal,
    });
    await new_cart.save();
  }
  res.redirect("back");
};
// INCREMENT CART PRODUCT QUANTITY
const increment_cart_prod_qty = async (req, res) => {
  const product_id = req.params.proId;
  const userId = req.session.userId;
  let price = parseInt(req.params.proPrice);
  let product = await productModel.findById(product_id);
  await cartModel.findOneAndUpdate(
    { userId, "products.productId": product_id },
    {
      $inc: {
        "products.$.quantity": 1,
        "products.$.subTotal": product.price,
        cartTotal: product.price,
      },
    }
  );
  res.redirect("back");
};
// DECREMENT CART PRODUCT QUANTITY
const decrement_cart_prod_qty = async (req, res) => {
  const product_id = req.params.proId;
  const userId = req.session.userId;
  let price = parseInt(req.params.proPrice);
  // price = price * -1;
  let product = await productModel.findById(product_id);
  await cartModel.findOneAndUpdate(
    { userId, "products.productId": product_id },
    {
      $inc: {
        "products.$.quantity": -1,
        "products.$.subTotal": -product.price,
        cartTotal: -product.price,
      },
    }
  );
  res.redirect("back");
};
// REMOVE FROM CART
const remove_from_cart = async (req, res) => {
  const userId = req.session.userId;
  const productId = req.params.proId;
  const productQty = req.params.proQty;
  const cart = await cartModel.findOne({ userId });
  let cart_total;
  if (cart != null) {
    cart_total = cart.cartTotal;
  }
  const product = await productModel.findOne({ _id: productId });
  const product_price = product.price;
  const totalPrice = cart_total - product_price * productQty;
  const final_total = Math.abs(totalPrice);
  await cartModel.updateOne(
    { userId },
    { $set: { cartTotal: final_total, grandTotal: 0 } }
  );
  await cartModel.updateOne({ userId }, { $pull: { products: { productId } } });
  res.redirect("back");
};

// CHECKOUT PAGE
const checkout_page = async (req, res) => {
  const userId = req.session.userId;
  const cart = await cartModel.findOne({ userId });
  const coupons = await couponModel.find();
  console.log(Array.isArray(coupons));
  const prodsInCart = cart.products;
  if (prodsInCart.length != 0) {
    const userId = req.session.userId;
    const cart = await cartModel
      .findOne({ userId })
      .populate("products.productId");
    let products;
    let total_amount;
    let cartId;
    if (cart != null) {
      products = cart.products;
      cartId = cart._id;
      total_amount = cart.grandTotal;
      if (total_amount === 0) {
        total_amount = cart.cartTotal;
      }
    }
    const getUserAddresses = await addressModel.findOne({ user: userId });
    let addresses;
    if (getUserAddresses != null) {
      addresses = getUserAddresses.address;
    }
    res.render("user/checkout", {
      products,
      addresses,
      cartId,
      total_amount,
      coupons,
      userId,
    });
  } else {
    res.redirect("back");
  }
};

// APPLY COUPON //
const apply_coupon = async (req, res) => {
  const userId = req.session.userId;
  const couponId = req.body.couponId;
  if (couponId != "Check coupons") {
    const cart = await cartModel.findOne({ userId });
    const cart_total = cart.cartTotal;
    const coupon = await couponModel.findOne({ _id: couponId });
    const discount = coupon.discount;
    const grandTotal = (discount / 100) * cart_total;
    await cartModel.updateOne(
      { userId },
      {
        $set: {
          grandTotal,
          "discount.couponId": couponId,
          "discount.percentage": discount,
        },
      },
      { upsert: true }
    );
    console.log(grandTotal);
  }
  res.redirect("/checkout");
};

// CONFIRM CHECKOUT
const confirm_checkout = async (req, res) => {
  const payment_method = req.body["payment_method"];
  const userId = req.session.userId;
  const cart = await cartModel.findOne({ userId });
  let cartId;
  let total_amount;
  if (cart != null) {
    cartId = cart._id;
    let grandTotal = cart.grandTotal;
    if (grandTotal === 0) {
      total_amount = cart.cartTotal;
    } else {
      total_amount = cart.grandTotal;
    }
  }

  if (payment_method === "cash_on_delivery") {
    res.json({ codSuccess: true });
  } else if (payment_method === "razerpay") {
    var instance = new Razorpay({
      key_id: "rzp_test_g5EMovE0Fdz2IM",
      key_secret: "wCcHyG6eCD0smoqjpQo4IjOs",
    });

    instance.orders.create(
      {
        amount: total_amount * 100,
        currency: "INR",
        receipt: "" + cartId,
      },
      function (err, order) {
        if (err) {
          console.log(err);
        } else {
          res.json({ order });
          console.log("New Order: ", order);
        }
      }
    );
  }
};

const verifyPayment = async (req, res) => {
  const details = req.body;
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>" + details);
  const crypto = require("crypto");
  let hmac = crypto.createHmac("sha256", "wCcHyG6eCD0smoqjpQo4IjOs");
  hmac.update(
    details.payment.razorpay_order_id +
      "|" +
      details.payment.razorpay_payment_id,
    "wCcHyG6eCD0smoqjpQo4IjOs"
  );
  hmac = hmac.digest("hex");

  if (hmac === details.payment.razorpay_signature) {
    console.log("order Successfull");
    res.json({ status: true });
  } else {
    res.json({ status: false });
    console.log("else === payment failed");
  }
};

// ORDER SUCCESS PAGE
const order_success = async (req, res) => {
  res.render("user/order_success");
  const userId = req.session.userId;
  const addressId = req.params.address_id;
  const couponId = req.params.couponId;
  const payment_method = req.params.pay_method;
  let payment_status;
  if (payment_method === "cash_on_delivery") {
    payment_status = "pending - pay on delivey";
  } else if (payment_method === "razerpay") {
    payment_status = "paid using razerpay - online payment";
  }
  const created_date = new Date();
  const now = new Date();
  const expected_delivery_date = now.setDate(now.getDate() + 7);
  const cart = await cartModel.findOne({ userId });
  let cartId;
  let total_amount;
  let products;
  let discount;
  if (cart != null) {
    cartId = cart._id;
    grandTotal = cart.grandTotal;
    if (grandTotal === 0) {
      total_amount = cart.cartTotal;
      discount = {};
    } else {
      total_amount = cart.grandTotal;
    }
    products = cart.products;
    discount = cart.discount;
  }
  if (couponId != "Check coupons") {
    await couponModel.updateOne(
      { _id: couponId },
      { $push: { users: userId } }
    );
  }
  const order_exists = await orderModel.findOne({
    userId,
    cartId,
  });
  if (!order_exists) {
    const new_order = new orderModel({
      cartId,
      userId,
      total_amount,
      addressId,
      products,
      discount,
      created_date,
      payment_method,
      payment_status,
      expected_delivery_date,
    });
    await new_order.save();
  }
  const current_order = await orderModel.findOne({ userId, cartId });
  const allproducts = await productModel.find();
  console.log(allproducts);
  const ordered_products = current_order.products;
  let ordered_products_ids = [];
  for (const product of ordered_products) {
    ordered_products_ids.push(product.productId);
  }
  let purchased_quantity;
  let i;
  let prod;
  let no_of_products = ordered_products.length;
  console.log("no_of_products " + no_of_products);
  for (i = 0; i < no_of_products; i++) {
    for (prod of allproducts) {
      let in_stock_product_id = "" + ordered_products[i].productId;
      let ordered_prod_id = "" + prod._id;
      if (in_stock_product_id === ordered_prod_id) {
        purchased_quantity = parseInt(ordered_products[i].quantity);
        await productModel.updateOne(
          { _id: in_stock_product_id },
          { $inc: { stock: -purchased_quantity } }
        );
      }
    }
  }
  await cartModel.deleteOne();
};

// RENDER WISHLIST
const wishlist = async (req, res) => {
  if (req.session.isAuth) {
    const userId = req.session.userId;
    const cart = await cartModel.findOne({ userId });
    const wishlist = await wishlistModel
      .findOne({ userId })
      .populate("productId");
    let items;
    let wishlist_total_amount = 0;
    if (wishlist != null) {
      items = wishlist.productId;
      for (let i = 0; i < items.length; i++) {
        wishlist_total_amount = wishlist_total_amount + items[i].price;
      }
    } else {
      items = [];
    }
    let cartItems;
    if (cart != null) {
      cartItems = cart?.products;
    } else {
      cartItems = [];
    }
    res.render("user/wishlist", {
      login: true,
      items,
      cartItems,
      wishlist_total_amount,
    });
  } else {
    res.render("user/wishlist", { login: false, cart });
  }
};
// ADD TO WISHLIST
const add_to_wishlist = async (req, res) => {
  const proId = req.params.id;
  const userId = req.session.userId;
  const wishlistExist = await wishlistModel.findOne({ userId });
  if (wishlistExist) {
    await wishlistModel.findOneAndUpdate(
      { userId },
      { $addToSet: { productId: proId } }
    );
  } else {
    const new_wishlist = new wishlistModel({
      userId,
      productId: [proId],
    });
    await new_wishlist.save();
  }
  res.redirect("back");
};
// REMOVE FROM WISHLIST
const remove_from_wishlist = async (req, res) => {
  const userId = req.session.userId;
  const proId = req.params.id;

  await wishlistModel.updateOne({ userId }, { $pull: { productId: proId } });
  res.redirect("back");
};
// RENDER SIGNUP PAGE
const signup_page = (req, res) => {
  res.render("user/signup", { emailExist: req.session.exists });
};
// RENDER SIGNIN PAGE
const login_page = (req, res) => {
  res.render("user/login", {
    emailErr: req.session.emailError,
    passwordErr: req.session.passwordError,
  });
};
// RENDER ACCOUNT PAGE
const account = async (req, res) => {
  const userId = req.session.userId;
  const user = await userModel.find({ _id: userId });
  const full_name = `${user[0].first_name} ${user[0].last_name}`;
  const phone_no = user[0].phone_no;
  const email = user[0].email;
  const first_name = user[0].first_name;
  const last_name = user[0].last_name;
  const username = user[0].username;
  const gender = user[0].gender;

  res.render("user/account", {
    login: true,
    userId,
    full_name,
    phone_no,
    email,
    first_name,
    last_name,
    username,
    gender,
  });
};
// RENDER ADDRESS PAGE
const address = async (req, res) => {
  const userId = req.session.userId;
  const user = await userModel.findOne({ _id: userId });
  const getUserAddresses = await addressModel.findOne({ user: userId });
  let userAddresses;
  if (getUserAddresses != null) {
    userAddresses = getUserAddresses.address;
  } else {
    userAddresses = [];
  }
  const full_name = `${user.first_name} ${user.last_name}`;
  const phone_no = user.phone_no;
  res.render("user/address", {
    login: true,
    userId,
    full_name,
    phone_no,
    userAddresses,
  });
};
// RENDER ADDRESS EDIT PAGE
const edit_address_page = async (req, res) => {
  const addIndex = req.params.id;
  const userId = req.session.userId;
  const getAddress = await addressModel.findOne({ user: userId });
  const name = getAddress.address[addIndex].name;
  const phone_no = getAddress.address[addIndex].phone_no;
  const country = getAddress.address[addIndex].country;
  const pincode = getAddress.address[addIndex].pincode;
  const city = getAddress.address[addIndex].city;
  const type = getAddress.address[addIndex].type;
  const addId = getAddress.address[addIndex]._id;

  res.render("user/edit_address", {
    name,
    phone_no,
    country,
    pincode,
    city,
    type,
    addId,
    addIndex,
  });
};
const add_address_page = async (req, res) => {
  res.render("user/add_address");
};

/////////////////////////////////// ADD DATA ///////////////////////////////////
// ADD ADDRESS
const add_address = async (req, res) => {
  const userId = req.session.userId;
  const push_address = req.body;

  let adr_exists_check = await addressModel.findOne({ user: userId });
  if (adr_exists_check) {
    await addressModel.findOneAndUpdate(
      { userId },
      { $push: { address: push_address } }
    );
  } else {
    const new_address = new addressModel({
      user: userId,
      address: [push_address],
    });
    await new_address.save();
  }
  res.redirect("back");
};

/////////////////////////////////// EDIT DATA ///////////////////////////////////
// EDIT USER
const edit_user = async (req, res) => {
  const userId = req.params.id;
  const { username, phone_no, email, first_name, last_name, gender } = req.body;
  const save_user_edits = await userModel.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        username,
        phone_no,
        email,
        first_name,
        last_name,
        gender,
      },
    }
  );
  await save_user_edits.save().then(() => {
    res.redirect("/user/account");
    console.log("user info edited");
  });
};
// EDIT ADDRESS
const edit_address = async (req, res) => {
  const userId = req.session.userId;
  var addId = req.params.id;
  const { country, name, phone_no, pincode, type, city } = req.body;
  await addressModel.updateMany(
    { user: userId, "address._id": addId },
    {
      $set: {
        "address.$.country": country,
        "address.$.name": name,
        "address.$.city": city,
        "address.$.phone_no": phone_no,
        "address.$.pincode": pincode,
        "address.$.type": type,
      },
    }
  );
  res.redirect("/user/address");
};
// DELETE ADDRESS
const delete_address = async (req, res) => {
  const userId = req.session.userId;
  var addId = req.params.id;

  await addressModel.updateOne(
    { user: userId },
    { $pull: { address: { _id: addId } } }
  );
  res.redirect("/user/address");
};

/////////////////////////////////// USER REGISTER AND LOGIN ///////////////////////////////////
// OTP CONFIG
var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
var userData;

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: "Gmail",
  auth: {
    user: process.env.AUTH_MAIL,
    pass: process.env.AUTH_MAIL_PASS,
  },
});

// RESEND OTP
const resend_otp = function (req, res) {
  var mailOptions = {
    to: email2,
    subject: "Otp for registration is: ",
    html:
      "<h3>OTP for account verification is </h3>" +
      "<h1 style='font-weight:bold;'>" +
      otp +
      "</h1>", // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    res.render("user/otp", { user, msg: "otp has been sent" });
  });
};

// OTP VALIDATION
const otp_validation = async (req, res) => {
  if (req.body.otp == otp) {
    const hashedPsw = await bcrypt.hash(userData.password, 12);
    const created_date = new Date();

    let newUser = new userModel({
      first_name: userData.first_name,
      last_name: userData.last_name,
      username: userData.username,
      created_date,
      phone_no: userData.phone_no,
      email: userData.email,
      gender: userData.gender,
      password: hashedPsw,
      otp_verified: true,
    });
    await newUser
      .save()
      .then(res.redirect("/user/login"))
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.render("user/otp", { user, msg: "otp is incorrect" });
  }
};
// SIGNUP POST
const signup = async (req, res) => {
  userData = req.body;
  req.session.exists = false;
  let user = await userModel.findOne({ email: "userData.email" });
  if (user) {
    req.session.exists = true;
    return res.redirect("/user/signup");
  }

  var mailOptions = {
    to: userData.email,
    subject: "Otp for registration is: ",
    html:
      "<h3>OTP for account verification is </h3>" +
      "<h1 style='font-weight:bold;'>" +
      otp +
      "</h1>",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  });

  res.render("user/otp", { user, msg: "" });
};

// LOGIN
const login = async (req, res) => {
  req.session.emailError = false;
  req.session.passwordError = false;
  const { email, password } = req.body;
  const user = await userModel.findOne({
    $and: [{ email: email }, { type: "user" }, { is_blocked: false }],
  });

  if (!user) {
    req.session.emailError = true;
    return res.redirect("/user/login");
  } else {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.session.passwordError = true;
      return res.redirect("/user/login");
    } else {
      req.session.user = user.username;
      req.session.userId = user._id;
      req.session.isAuth = true;
      res.redirect("/");
    }
  }
};
//LOGOUT
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/");
  });
};

module.exports = {
  account,
  logout,
  login,
  login_page,
  signup,
  signup_page,
  landing_page,
  resend_otp,
  otp_validation,
  edit_user,
  proceedIfLoggedIn,
  proceedIfLoggedOut,
  address,
  add_address,
  edit_address,
  edit_address_page,
  delete_address,
  product_page,
  cart,
  add_to_cart,
  remove_from_cart,
  wishlist,
  add_to_wishlist,
  remove_from_wishlist,
  increment_cart_prod_qty,
  decrement_cart_prod_qty,
  checkout_page,
  confirm_checkout,
  order_success,
  verifyPayment,
  my_orders,
  add_address_page,
  cancel_order,
  apply_coupon,
};
