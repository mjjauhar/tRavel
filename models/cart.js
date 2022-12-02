var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
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
        default: 1,
      },
      price: {
        type: Number,
        ref: "product",
      },
      subTotal: {
        type: Number,
        ref: "product",
        default: 0,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  grandTotal: {
    type: Number,
    default:0,
  },
  discount: {
    couponId: Schema.Types.ObjectId,
    percentage: { type: Number, default: 0 },
  },
  cartTotal: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("cart", cartSchema);
