const express = require("express");
const router = express.Router();
const PolicyInfo = require("../models/policyInfo");

// Add policy info
router.post("/policy/add", async (req, res) => {
  try {
    const policyInfo = new PolicyInfo(req.body);
    await policyInfo.save();
    res.status(201).send(policyInfo);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Search policy info by username
router.get("/policy/:username", async (req, res) => {
  try {
    const user = await User.findOne({ firstName: req.params.username });
    if (!user) {
      return res.status(404).send();
    }
    const policies = await PolicyInfo.find({ userId: user._id });
    res.send(policies);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Aggregate policies by user
router.get("/policy/aggregate/byUser", async (req, res) => {
  try {
    const aggregatedPolicies = await PolicyInfo.aggregate([
      {
        $group: {
          _id: "$userId",
          policies: { $push: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 0,
          user: 1,
          policies: 1,
        },
      },
    ]);
    res.send(aggregatedPolicies);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
