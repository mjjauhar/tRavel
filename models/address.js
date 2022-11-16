var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var addressSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  address: [
    {
      name: {
        type: String,
        required: true,
      },
      phone_no: {
        type: Number,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      pincode: {
        type: Number,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        default: "home",
      },
    },
  ],
});

module.exports = mongoose.model("address", addressSchema);
