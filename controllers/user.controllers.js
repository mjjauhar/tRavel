const userModel = require("../models/user");
const productModel = require("../models/product");
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
// render_landing_page ----------------------------
const landing_page = async (req, res) => {
  let products = await productModel.find({
    is_deleted: false,
    otp_verified: true,
  });
  if (req.session.isAuth) {
    res.render("user/landing_page", {
      login: true,
      products,
    });
  } else {
    res.render("user/landing_page", { login: false, products });
  }
};
// render_user_signup_page.------------------------
const signup_page = (req, res) => {
  res.render("user/signup", { emailExist: req.session.exists });
};
// render_user_signin_page.------------------------
const login_page = (req, res) => {
  res.render("user/login", {
    emailErr: req.session.emailError,
    passwordErr: req.session.passwordError,
  });
};
// render_user_account_page
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

  // console.log(getAddress.address[addIndex].name);
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

// Resend OTP
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

// OTP Validation
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
// Post Request that handles Signup
const signup = async (req, res) => {
  const { first_name, last_name, username, phone_no, email, password, gender } =
    req.body; // asigning user data to variables.
  req.session.exists = false;
  let user = await userModel.findOne({ email }); // checking if user email exist in database.
  if (user) {
    req.session.exists = true;
    return res.redirect("/user/signup");
  } // two or more users with same email can't exist.
  const hashedPsw = await bcrypt.hash(password, 12); // else continue and hash password.
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
  }); // creating new user.

  email2 = email;
  // send mail with defined transport object
  var mailOptions = {
    to: email,
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
  });

  await user
    .save()
    .then(res.render("user/otp", { user, msg: "" }))
    .catch((err) => {
      console.log(err);
    });
};
// ------------------------------------------------

// user login--------------------------------------
const login = async (req, res) => {
  req.session.emailError = false;
  req.session.passwordError = false;
  const { email, password } = req.body; // asigning user entered datas to variables.
  const user = await userModel.findOne({
    $and: [{ email: email }, { type: "user" }, { is_blocked: false }],
  }); // checking if the email exist in database.

  if (!user) {
    req.session.emailError = true;
    return res.redirect("/user/login");
  }
  const isMatch = await bcrypt.compare(password, user.password); // If it does exist, check password..
  if (!isMatch) {
    req.session.passwordError = true;
    return res.redirect("/user/login");
  }
  req.session.user = user.username;
  req.session.userId = user._id;
  req.session.isAuth = true; // then save the state that the user is authenticated.
  res.redirect("/");
};

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
};
