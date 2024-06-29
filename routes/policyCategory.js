const express = require("express");
const router = express.Router();
const PolicyCategory = require("../models/policyCategory");

// Add policy category
router.post("/policycategory/add", async (req, res) => {
  try {
    const policyCategory = new PolicyCategory(req.body);
    await policyCategory.save();
    res.status(201).send(policyCategory);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
