var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var product_sub_category = new Schema({
  main_category: {
    type: String,
    required: true,
  },
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

module.exports = mongoose.model("ProductSubCategory", product_sub_category);
