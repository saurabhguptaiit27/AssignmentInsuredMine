const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const os = require("os-utils");
const nodeSchedule = require("node-schedule");
const { Worker } = require("node:worker_threads");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/insuranceDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', require('./routes/agent'));
app.use('/api', require('./routes/user'));
app.use('/api', require('./routes/userAccount'));
app.use('/api', require('./routes/policyCategory'));
app.use('/api', require('./routes/policyCarrier'));
app.use('/api', require('./routes/policyInfo'));

// Set up file upload
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// API to upload data from CSV/XLSX to MongoDB
app.post("/upload", upload.single("file"), (req, res) => {
  const filePath = path.join(__dirname, req.file.path);
  const worker = new Worker("./worker.js", { workerData: { filePath } });

  worker.on("message", (message) => {
    res.status(message.status).send(message.body);
  });

  worker.on("error", (error) => {
    res.status(500).send(error.message);
  });

  worker.on("exit", (code) => {
    if (code !== 0) {
      res.status(500).send(`Worker stopped with exit code ${code}`);
    }
  });
});

// CPU Utilization Monitoring
setInterval(() => {
  os.cpuUsage((v) => {
    if (v > 0.7) {
      console.log("CPU usage over 70%, restarting server...");
      process.exit(1);
    }
  });
}, 10000);

// Schedule Message Insertion
app.post("/scheduleMessage", (req, res) => {
  const { message, day, time } = req.body;
  const date = new Date(`${day} ${time}`);

  nodeSchedule.scheduleJob(date, async () => {
    try {
      const newMessage = new Message({
        message,
        scheduledAt: date,
      });
      await newMessage.save();
      console.log("Message inserted into DB:", message);
    } catch (error) {
      console.error("Error inserting message into DB:", error);
    }
  });

  res.send("Message scheduled successfully");
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
