import express from "express";
import cors from "cors";
import router from "./routes/url.js";
import { connectMongodb } from "./connectDatabase.js";
import logger from "./middleware/logger.js";
const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cors());
connectMongodb("mongodb://localhost/short-url")
  .then(() => {
    console.log("MongoDB connected.");
  })
  .catch((err) => console.log("Error: ", err));
app.use(logger);
app.use("/url", router);
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
