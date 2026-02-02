import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import recordsRoutes from "./routes/financial-records"; // exact cum se numește fișierul tău

dotenv.config();

const app = express();

// CORS - permite doar frontend-ul Vercel
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
  })
);

// parse JSON
app.use(express.json());

// prefix pentru rutele API
app.use("/financial-records", recordsRoutes);

// rută de test rapidă
app.get("/", (req, res) => {
  res.send("Backend Financetracker LIVE!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
