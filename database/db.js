const mongoose = require("mongoose");

const MongooseConnection = async (MONGOURL) => {
  try {
    await mongoose.connect(MONGOURL);
    console.log("Connected to Mongoose!");
  } catch (error) {
    console.log("Error while connecting to Mongoose: ", error);
  }
};

module.exports = { MongooseConnection };
