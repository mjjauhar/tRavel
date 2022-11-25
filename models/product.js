var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var product = new Schema({
  category: {
    type: Schema.Types.ObjectId,
    ref: "ProductSubCategory",
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  stock: Number,
  imgUrl: { type: [String] },
  description: String,
  created_date: Date,
  modified_date: Date,
  deleted_date: Date,
});

module.exports = mongoose.model("product", product);
