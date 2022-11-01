var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var user = new Schema({
  type_of_user: {
    type: String,
    // required: true
  },
  username: {
    type: String,
    required: true
  },
  first_name: {
    type: String,
    // required: true
  },
  last_name: {
    type: String,
    // required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone_no: {
    type: Number,
    // required: true
  },
  password: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    // required: true
  },
  active: {
    type: Boolean
  },
  last_active: {
    type: String
  },
  created_date: {
    type: Date,
    // required: true
  },
  modified_date: {
    type: Date,
    // required: true
  },
  address: {
    country: {
      type: String,
    //   required: true
    },
    pincode: {
      type: Number,
    //   required: true
    },
    place: {
      type: String,
    //   required: true
    }
  },
  blocked: {
    type: Boolean,
    // required: true
  }
});

module.exports = mongoose.model('user', user);