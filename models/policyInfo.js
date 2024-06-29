const mongoose = require("mongoose");

const policyInfoSchema = new mongoose.Schema({
  policyNumber: String,
  policyStartDate: Date,
  policyEndDate: Date,
  policyCategoryId: mongoose.Schema.Types.ObjectId,
  policyCarrierId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model("PolicyInfo", policyInfoSchema);
