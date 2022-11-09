const userModel = require("../models/user");
const productModel = require("../models/product");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");


// Otp config
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
    user: "travelauthentication@gmail.com",
    pass: "eabbvzhvhdifpqea",
  },
});

// render landing_page ----------------------------
const landing_page = async (req, res) => {
  let products = await productModel.find({ is_deleted: false, otp_verified:true });
  if (req.session.isAuth) {
    res.render("user/landing_page", {
      login: true,
      username: req.session.user,
      products,
    });
  } else {
    res.render("user/landing_page", { login: false, products });
  }
};
// ------------------------------------------------

// render user signup page.------------------------
const user_signup_page = (req, res) => {
  if (!req.session.isAuth) {
    res.render("user/user_signup", { emailExist: req.session.exists });
  } else {
    res.redirect("/");
  }
};
// ------------------------------------------------

// Post Request that handles Signup
const user_signup = async (req, res) => {
  const { first_name, last_name, username, phone_no, email, password } =
    req.body; // asigning user data to variables.
  req.session.exists = false;
  let user = await userModel.findOne({ email }); // checking if user email exist in database.
  if (user) {
    req.session.exists = true;
    return res.redirect("/user_signup");
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
    .then(res.render("user/otp_login", { user, msg:"" }))
    .catch((err) => {
      console.log(err);
    });
};
// ------------------------------------------------

const otp_login = async (req, res) => {
  if (!req.session.isAuth) {
    let usrId = req.params.id;
    if (req.body.otp == otp) {
      await userModel.findOneAndUpdate(
        { _id: usrId },
        { $set: { otp_verified: true } }
      );
      res.redirect("/user_login");
    } else {
      res.render("user/otp_login", { user, msg: "otp is incorrect" });
    }
  } else {
    res.redirect("/");
  }
};

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
    res.render("user/otp_login", { user, msg: "otp has been sent" });
  });
};

// render user signin page.------------------------
const user_login_page = (req, res) => {
  if (!req.session.isAuth) {
    res.render("user/user_login", {
      emailErr: req.session.emailError,
      passwordErr: req.session.passwordError,
    });
  } else {
    res.redirect("/");
  }
};
// ------------------------------------------------

// user login--------------------------------------
const user_login = async (req, res) => {
  const { email, password } = req.body; // asigning user entered datas to variables.
  const user = await userModel.findOne({
    $and: [{ email: email }, { type: "user" }, { is_blocked: false }],
  }); // checking if the email exist in database.
  req.session.emailError = false;
  req.session.passwordError = false;
  if (!user) {
    req.session.emailError = "Invalid email";
    return res.redirect("/user_login");
  } // If entered email doesn't exist..
  const isMatch = await bcrypt.compare(password, user.password); // If it does exist, check password..
  if (!isMatch) {
    req.session.passwordError = "Invalid password";
    return res.redirect("/user_login");
  } // If the password is incorrect..
  req.session.user = user.username;
  req.session.isAuth = true; // then save the state that the user is authenticated.
  res.redirect("/");
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/");
  });
};

const user_account = (req, res) => {
  if (req.session.isAuth) {
    res.render("user/user_account", {
      login: true,
      username: req.session.user,
    });
  } else {
    res.redirect("/");
  }
};

module.exports = {
  user_account,
  logout,
  user_login,
  user_login_page,
  user_signup,
  user_signup_page,
  landing_page,
  resend_otp,
  otp_login,
};
