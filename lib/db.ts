import mongoose from "mongoose";

const DB_URL = process.env.DB_URL;

const connect = async () => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("Already Connected!");
    return;
  }
  if (connectionState === 2) {
    console.log("connecting...");
    return;
  }

  try {
    await mongoose.connect(DB_URL!, {
      dbName: "pharmatrack",
      bufferCommands: false,
    });
  } catch (err) {
    console.log("Error connecting to the database", err);
    throw new Error("Error connecting to the database");
  }
};

export default connect;
