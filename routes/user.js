const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Add user
router.post("/user/add", async (req, res) => {
  try {
    console.log(req.body);
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Search user by name
router.get("/user/:name", async (req, res) => {
  try {
    const user = await User.findOne({ firstName: req.params.name });
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
