import express, { Express } from "express";
import mongoose from "mongoose";
import financialRecordRouter from "./routes/financial-records";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;
const mongoURI = "mongodb+srv://ibacarim:MANAlow32@financetracker.tobrihe.mongodb.net/"

app.use(express.json());
app.use(cors());

if (!mongoURI) {
  throw new Error("Please define the MONGODB_URI environment variable in the .env file");
}

mongoose
  .connect(mongoURI)
  .then(() => console.log("CONNECTED TO MONGODB!"))
  .catch((err) => console.error("Failed to Connect to MongoDB:", err));

app.use("/financial-records", financialRecordRouter);

app.listen(port, () => {
  console.log(`Server Running on Port ${port}`);
});
