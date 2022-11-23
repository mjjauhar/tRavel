var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var paymentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
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
    default: 'pending',
  },
  created_date: Date,
});

module.exports = mongoose.model("payment", paymentSchema);
