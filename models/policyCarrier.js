const mongoose = require("mongoose");

const policyCarrierSchema = new mongoose.Schema({
  companyName: String,
});

module.exports = mongoose.model("PolicyCarrier", policyCarrierSchema);
