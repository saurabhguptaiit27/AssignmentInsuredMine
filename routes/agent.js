const express = require("express");
const router = express.Router();
const Agent = require("../models/agent");

// Add agent
router.post("/agent/add", async (req, res) => {
  try {
    const agent = new Agent(req.body);
    await agent.save();
    res.status(201).send(agent);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
