const userModel = require("../models/user");
const productModel = require("../models/product");
const wishlistModel = require("../models/wishlist");
const cartModel = require("../models/cart");
const addressModel = require("../models/address");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
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
  const wishlist = await wishlistModel
    .findOne({ userId: userId })
    .populate("productId");
  const wishlistItems = wishlist?.productId;
  if (req.session.isAuth) {
    res.render("user/landing_page", {
      login: true,
      products,
      wishlistItems,
    });
  } else {
    res.render("user/landing_page", {
      login: false,
      products,
      wishlistItems: [],
    });
  }
};
// RENDER PRODUCT INFO
const product_page = async (req, res) => {
  const proId = req.params.id;
  let product = await productModel.findOne({
    is_deleted: false,
    _id: proId,
  });

  if (req.session.isAuth) {
    res.render("user/product_page", {
      login: true,
      product,
    });
  } else {
    res.render("user/product_page", { login: false, product });
  }
};
// RENDER CART
const cart = async (req, res) => {
  if (req.session.isAuth) {
    const userId = req.session.userId;
    const cart = await cartModel
      .findOne({ userId })
      .populate("items.productId");
    if (cart) {
      let itemsInCart = cart.items;
      let cart_total = cart.cartTotal;
      res.render("user/cart", {
        login: true,
        itemsInCart,
        cart_total,
      });
    } else {
      res.render("user/cart", { login: false, itemsInCart: [], cart_total: 0 });
    }
  }
};
//ADD TO CART
const add_to_cart = async (req, res) => {
  const productId = req.params.id;
  const userId = req.session.userId;
  const cartExist = await cartModel.findOne({ userId });
  const product = await productModel.findOne({ _id: productId });
  const totalPrice = product.price;
  if (cartExist) {
    let prodExistInCart = await cartModel.findOne({
      userId,
      "items.productId": productId,
    });
    if (prodExistInCart === null) {
      await cartModel.findOneAndUpdate(
        { userId },
        {
          $addToSet: { items: { productId, totalPrice } },
          $inc: { cartTotal: totalPrice },
        }
      );
    } 
  } else {
    const new_cart = new cartModel({
      userId,
      items: [{ productId, totalPrice }],
      cartTotal: totalPrice,
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
    { userId, "items.productId": product_id },
    {
      $inc: {
        "items.$.quantity": 1,
        "items.$.totalPrice": price,
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
  price = price * -1;
  let product = await productModel.findById(product_id);
  await cartModel.findOneAndUpdate(
    { userId, "items.productId": product_id },
    {
      $inc: {
        "items.$.quantity": -1,
        "items.$.totalPrice": price,
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
  const product = await productModel.findOne({ _id: productId });
  const product_price = product.price;
  const cart_total = cart.cartTotal;
  const totalPrice = cart_total - product_price * productQty;
  const final_total = Math.abs(totalPrice);
  await cartModel.updateOne({ userId }, { $set: { cartTotal: final_total } });
  await cartModel.updateOne({ userId }, { $pull: { items: { productId } } });
  res.redirect("back");
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
    if (wishlist != null) {
      items = wishlist.productId;
    } else {
      items = [];
    }
    res.render("user/wishlist", {
      login: true,
      items,
    });
  } else {
    res.render("user/wishlist", { login: false });
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
  res.redirect("/user/address");
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
  const { country, name, phone_no, pincode, type } = req.body;
  await addressModel.updateMany(
    { user: userId, "address._id": addId },
    {
      $set: {
        "address.$.country": country,
        "address.$.name": name,
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
console.log(otp);
var email2;
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
  let usrId = req.params.id;
  if (req.body.otp == otp) {
    await userModel.findOneAndUpdate(
      { _id: usrId },
      { $set: { otp_verified: true } }
    );
    res.redirect("/user/login");
  } else {
    res.render("user/otp", { user, msg: "otp is incorrect" });
  }
};
// SIGNUP POST
const signup = async (req, res) => {
  const { first_name, last_name, username, phone_no, email, password, gender } =
    req.body;
  req.session.exists = false;
  let user = await userModel.findOne({ email });
  if (user) {
    req.session.exists = true;
    return res.redirect("/user/signup");
  }
  const hashedPsw = await bcrypt.hash(password, 12);
  const created_date = new Date();

  user = new userModel({
    first_name,
    last_name,
    username,
    created_date,
    phone_no,
    email,
    gender,
    password: hashedPsw,
  });

  email2 = email;
  var mailOptions = {
    to: email,
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

  await user
    .save()
    .then(res.render("user/otp", { user, msg: "" }))
    .catch((err) => {
      console.log(err);
    });
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
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    req.session.passwordError = true;
    return res.redirect("/user/login");
  }
  req.session.user = user.username;
  req.session.userId = user._id;
  req.session.isAuth = true;
  res.redirect("/");
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
};
