var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  paymentId: {
    type: Schema.Types.ObjectId,
    ref: "payment",
  },
  addressId: {
    type: Schema.Types.ObjectId,
    ref: "address",
  },
  order_status: {
    type: String,
  },
  productId: {
    type: [Schema.Types.ObjectId],
    ref: "product",
  },
  created_date: Date,
  delivered_date: Date,
  canceled_date: Date,
});

module.exports = mongoose.model("order", orderSchema);
