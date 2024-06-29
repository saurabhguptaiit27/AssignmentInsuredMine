const { parentPort, workerData } = require("node:worker_threads");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

// Load models
const Agent = require("./models/agent");
const User = require("./models/user");
const UserAccount = require("./models/userAccount");
const PolicyCategory = require("./models/policyCategory");
const PolicyCarrier = require("./models/policyCarrier");
const PolicyInfo = require("./models/policyInfo");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/insuranceDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function insertData(filePath) {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    for (const record of jsonData) {
      const agent = new Agent({ agentName: record.Agent });
      await agent.save();

      const user = new User({
        firstName: record["User First Name"],
        dob: new Date(record["User DOB"]),
        address: record["User Address"],
        phoneNumber: record["User Phone Number"],
        state: record["User State"],
        zipCode: record["User Zip Code"],
        email: record["User Email"],
        gender: record["User Gender"],
        userType: record["User Type"],
      });
      await user.save();

      const userAccount = new UserAccount({
        accountName: record["User Account"],
      });
      await userAccount.save();

      const policyCategory = new PolicyCategory({
        categoryName: record["Policy Category"],
      });
      await policyCategory.save();

      const policyCarrier = new PolicyCarrier({
        companyName: record["Policy Carrier"],
      });
      await policyCarrier.save();

      const policyInfo = new PolicyInfo({
        policyNumber: record["Policy Number"],
        policyStartDate: new Date(record["Policy Start Date"]),
        policyEndDate: new Date(record["Policy End Date"]),
        policyCategoryId: policyCategory._id,
        policyCarrierId: policyCarrier._id,
        userId: user._id,
      });
      await policyInfo.save();
    }

    parentPort.postMessage({ status: 200, body: "Data inserted successfully" });
  } catch (error) {
    parentPort.postMessage({ status: 500, body: error.message });
  } finally {
    fs.unlinkSync(workerData.filePath);
    mongoose.connection.close();
  }
}

insertData(workerData.filePath);
