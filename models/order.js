var mongoose = require("mongoose");
var Schema = mongoose.Schema;


const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "product",
      },
      quantity: {
        type: Number,
        ref: "product",
      },
      price: {
        type: Number,
        ref: "product",
      },
      subTotal: {
        type: Number,
        ref: "product",
      },
      status: {
        type: String,
        default: "Order Confirmed",
      },
    },
  ],
  total_amount: {
    type: Number,
  },
  addressId: {
    type: Schema.Types.ObjectId,
    ref: "address",
  },
  cartId: {
    type: Schema.Types.ObjectId,
    ref: "cart",
  },
  created_date: Date,
  expected_delivery_date: Date,
  delivered_date: Date,
  canceled_date: Date,
  payment_method: {
    type: String,
    default: "none",
  },
  payment_status: {
    type: String,
    default: "Not paid",
  },
});

module.exports = mongoose.model("order", orderSchema);