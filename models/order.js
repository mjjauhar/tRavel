var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  addressId: {
    type: Schema.Types.ObjectId,
    ref: "address",
  },
  order_status: {
    type: String,
    default: "Order Not Confirmed"
  },
  productId: {
    type: [Schema.Types.ObjectId],
    ref: "product",
  },
  cartId: {
    type: Schema.Types.ObjectId,
    ref: "cart",
  },
  total_amount:{
    type: Number,
  },
  payment_method: {
    type: String,
    default: "none",
  },
  payment_status: {
    type: String,
    default: 'none',
  },
  created_date: Date,
  delivered_date: Date,
  canceled_date: Date,
});

module.exports = mongoose.model("order", orderSchema);
