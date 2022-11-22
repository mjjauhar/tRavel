var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var offerSchema = new Schema({
  offer_name: {
    type: String,
  },
  discount: {
    type: Number,
  },
  created_date: Date,
  modified_date: Date,
});

module.exports = mongoose.model("payment", paymentSchema);
