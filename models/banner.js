var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var bannerSchema = new Schema({
  heading: {
    type: String,
  },
  description: {
    type: String,
  },
  extra_details:{
    type: String,
  },
  imgUrl: { type: [String] },
  created_date: Date,
  modified_date: Date,
  is_deleted: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model("banner", bannerSchema);
