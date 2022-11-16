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
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phone_no: {
    type: Number,
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
  gender: {
    type: String,
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
