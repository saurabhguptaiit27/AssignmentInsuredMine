const express = require("express");
const router = express.Router();
const PolicyCarrier = require("../models/policyCarrier");

// Add policy carrier
router.post("/policycarrier/add", async (req, res) => {
  try {
    const policyCarrier = new PolicyCarrier(req.body);
    await policyCarrier.save();
    res.status(201).send(policyCarrier);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
