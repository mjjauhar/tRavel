const userModel = require("../models/user");
const bcrypt = require("bcrypt");

module.exports = {
  // render landing_page ----------------------------
  landing_page: (req, res) => {
    if (req.session.isAuth) {
      res.render("landing_page", {
        login: true,
        username: req.session.user,
      });
    } else {
      res.render("landing_page", { login: false });
    }
  },
  // ------------------------------------------------

  // render user signup page.------------------------
  user_signup_page: (req, res) => {
    if (!req.session.isAuth) {
      res.render("user_signup");
    } else {
      res.redirect("/");
    }
  },
  // ------------------------------------------------

  // Create new user with data from the form.--------
  user_signup: async (req, res) => {
    const { first_name, last_name, username, phone_no, email, password } =
      req.body; // asigning user data to variables.
    let user = await userModel.findOne({ email }); // checking if user email exist in database.
    if (user) {
      return res.redirect("/user_signup");
    } // two or more users with same email can't exist.
    const hashedPsw = await bcrypt.hash(password, 12); // else continue and hash password.
    user = new userModel({
      first_name,
      last_name,
      username,
      phone_no,
      email,
      password: hashedPsw,
    }); // creating new user.
    await user.save(); // saving new user collection with the userModel.
    res.redirect("/user_login");
  },
  // ------------------------------------------------

  // render user signin page.------------------------
  user_login_page: (req, res) => {
    if (!req.session.isAuth) {
      res.render("user_login");
    } else {
      res.redirect("/");
    }
  },
  // ------------------------------------------------

  // user login--------------------------------------
  user_login: async (req, res) => {
    const { email, password } = req.body; // asigning user entered datas to variables.
    const user = await userModel.findOne({ email }); // checking if the email exist in database.
    if (!user) {
      return res.redirect("/user_login");
    } // If entered email doesn't exist..
    const isMatch = await bcrypt.compare(password, user.password); // If it does exist, check password..
    if (!isMatch) {
      return res.redirect("/user_login");
    } // If the password is incorrect..
    req.session.user = user.username; // else continue
    req.session.isAuth = true; // then save the state that the user is authenticated.
    res.redirect("/");
  },
};
