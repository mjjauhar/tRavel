var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var paymentSchema = new Schema({
  cartId: {
    type: [Schema.Types.ObjectId],
    ref: "cart",
  },
  quantity: {
    type: Number,
  },
  created_date: Date,
  modified_date: Date,
});

module.exports = mongoose.model("payment", paymentSchema);
