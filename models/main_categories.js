var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var product_main_category = new Schema({
  name: {
    type: String,
    required: true,
  },
  delete: {
    type: Boolean,
    default: false,
  },
  description: String,
  created_date: Date,
  modified_date: Date,
  deleted_date: Date,
});

module.exports = mongoose.model("ProductMainCategory", product_main_category);
