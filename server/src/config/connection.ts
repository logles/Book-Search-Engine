import mongoose from "mongoose";

async function connectToDb() {
  await mongoose.connect(
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/googlebooks"
  );

  console.log("Database connected!");
}

export default connectToDb;
