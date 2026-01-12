import mongoose from "mongoose";

export async function connectMongodb(url) {
  return mongoose.connect(url);
}
