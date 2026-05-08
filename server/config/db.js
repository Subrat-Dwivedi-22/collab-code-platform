const mongoose = require("mongoose");
const dns = require("node:dns");

dns.setServers(["1.1.1.1", "1.0.0.1"]);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;