const express = require("express");
const router = express.Router();
const UserAccount = require("../models/userAccount");

// Add user account
router.post("/useraccount/add", async (req, res) => {
  try {
    const userAccount = new UserAccount(req.body);
    await userAccount.save();
    res.status(201).send(userAccount);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
