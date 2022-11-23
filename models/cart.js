var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
      totalPrice: {
        type: Number,
        default: 0,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  cartTotal: {
    type: Number,
    default: 0,
  },
  
});

module.exports = mongoose.model("cart", cartSchema);
