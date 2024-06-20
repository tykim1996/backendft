const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
require('dotenv').config();

const {MONGO_URL, MONGO_DB_NAME} = process.env;
const uri = MONGO_URL+ MONGO_DB_NAME;
async function connectToDatabase() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB locally");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error); // Sửa thông báo lỗi
  }
}
async function getMongoClient() {
  await connectToDatabase();
  return mongoose.connection.getClient();
}

module.exports = { connectToDatabase, getMongoClient };
