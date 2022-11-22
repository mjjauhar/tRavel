var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var wishlistSchema = new Schema({
  productId: {
    type: [Schema.Types.ObjectId],
    ref: "product",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  created_date: Date,
  modified_date: Date,
});

module.exports = mongoose.model("wishlist", wishlistSchema);
