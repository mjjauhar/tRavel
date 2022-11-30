var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var couponSchema = new Schema({
  name: {
    type: String,
  },
  discount: {
    type: Number,
  },
  users:{
    type:[Schema.Types.ObjectId],
  },
  disable:{
    type: Boolean,
    default: false,
  },
  created_date: Date,
  modified_date: Date,
});

module.exports = mongoose.model("coupon", couponSchema);
