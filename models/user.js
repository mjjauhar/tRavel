var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var user = new Schema({
  type: {
    type: String,
    default: "user",
  },
  username: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    // required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  phone_no: {
    type: Number,
    // required: true
  },
  password: {
    type: String,
    required: true,
    minLength: 3,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("password musn’t contain password");
      }
    },
  },
  otp_verified: {
    type: Boolean,
    default: false,
  },
  created_date: {
    type: Date,
    required: true,
  },
  modified_date: {
    type: Date,
  },
  is_blocked: {
    type: Boolean,
    default: false,
    required: true
  },
});

module.exports = mongoose.model("user", user);
