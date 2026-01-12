import express from "express";
import cors from "cors";
import router from "./routes/url.js";
import { connectMongodb } from "./connectDatabase.js";
import logger from "./middleware/logger.js";
const PORT = process.env.PORT;
const app = express();
const dbUrl = process.env.MONGODB_URI;
app.use(express.json());
app.use(cors());
connectMongodb(dbUrl)
  .then(() => {
    console.log("MongoDB connected.");
  })
  .catch((err) => console.log("Error: ", err));
app.use(logger);
app.use("/url", router);
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
