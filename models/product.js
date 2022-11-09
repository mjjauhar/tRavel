var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var product = new Schema({
  category: {
    type: String,
  },
  stock: {
    type: Number,
  },
  discount: {
    type: Number,
  },
  name: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    // required: true
  },
  description: {
    type: String,
    // required: true
  },
  price: {
    type: Number,
    // required: true
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  created_date: {
    type: Date,
    required: true
  },
  modified_date: {
    type: Date,
  },
  deleted_date: {
    type: Date,
  },
});

module.exports = mongoose.model("product", product);
