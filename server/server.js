// server/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// ✅ Import booking routes from Backend folder
import bookingRoutes from "../Backend/routes/bookingRoutes.js";
import authRoutes from "../Backend/routes/authRoutes.js";

dotenv.config(); // Load environment variables

const app = express();

// ✅ Middleware setup
app.use(
  cors({
    origin: "http://localhost:3000", // frontend origin
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());

// ✅ Environment variable checks
console.log("Amadeus Client ID Loaded:", !!process.env.AMADEUS_CLIENT_ID);
console.log("Amadeus Client Secret Loaded:", !!process.env.AMADEUS_CLIENT_SECRET);
console.log("RapidAPI Key Loaded:", !!process.env.RAPIDAPI_KEY);

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Log every incoming request
app.use((req, res, next) => {
  console.log(`➡ ${req.method} ${req.url}`);
  next();
});

// ✅ Routes
app.use("/api", bookingRoutes);
app.use("/api/auth", authRoutes);

// ✅ Default test route
app.get("/", (req, res) => {
  res.send("Server is running successfully 🚀");
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
