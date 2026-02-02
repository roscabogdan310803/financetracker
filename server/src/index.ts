import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import recordsRoutes from "./routes/financial-records"; // Asigură-te că extensia .js este pusă dacă folosești "type": "module"

dotenv.config();

const app = express();

// --- CONFIGURARE CORS FIXATĂ ---
const allowedOrigins = [
  "https://financetracker-one-green.vercel.app", // Frontend-ul tău de producție (FĂRĂ slash)
  "http://localhost:5173", // Vite (pentru development local)
  "http://localhost:3000", // React standard (opțional)
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite cererile fără origine (ex: Postman, aplicații mobile sau server-to-server)
      if (!origin) return callback(null, true);

      // Verificăm dacă originea cererii se află în lista noastră acceptată
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        // Dacă nu e în listă, respingem politicos
        console.log("Blocked by CORS:", origin); 
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Metode permise
    allowedHeaders: ["Content-Type", "Authorization"], // Header-ul Authorization e crucial pentru Clerk
    credentials: true, // Permite cookie-uri/token-uri securizate
  })
);
// -------------------------------

// parse JSON
app.use(express.json());

// prefix pentru rutele API
app.use("/financial-records", recordsRoutes);

// rută de test rapidă
app.get("/", (req, res) => {
  res.send("Backend Financetracker LIVE & CORS Fixed!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});