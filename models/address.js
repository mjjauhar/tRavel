var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var address = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "home",
  },
});

module.exports = mongoose.model("address", address);
