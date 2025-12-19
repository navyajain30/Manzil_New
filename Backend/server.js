// Backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bookingRoutes from "./routes/bookingRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import geminiRoute from "./routes/geminiRoute.js";

// 🟢 Make sure rewardRoutes is added later (optional)
// import rewardRoutes from "./routes/rewardRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "*", // Allow all origins for development to avoid port mismatch issues
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.json());

// Logs
console.log("Amadeus Client ID Loaded:", !!process.env.AMADEUS_CLIENT_ID);
console.log("Amadeus Client Secret Loaded:", !!process.env.AMADEUS_CLIENT_SECRET);
console.log("RapidAPI Key Loaded:", !!process.env.RAPIDAPI_KEY);
console.log("Gemini API Key Loaded:", !!process.env.GEMINI_API_KEY);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use("/api", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/gemini", geminiRoute);

// app.use("/api/rewards", rewardRoutes); // only if using rewards API

// Default route
app.get("/", (req, res) => {
  res.send("Backend server is running successfully 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
