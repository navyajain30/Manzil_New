// backend/routes/authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

/* ===================== SIGNUP ===================== */
router.post("/signup", async (req, res) => {
  console.log("📩 Signup route hit");
  console.log("Received body:", req.body);

  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      console.log("❌ Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();
    console.log("✅ User saved successfully!");
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("❌ Error in signup:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

/* ===================== LOGIN ===================== */
router.post("/login", async (req, res) => {
  try {
    console.log("➡️ Login route hit");
    console.log("Received body:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      console.log("❌ Missing email or password");
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found");
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Invalid credentials");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("✅ Login successful for:", user.email);
    res.status(200).json({
      message: "Login successful!",
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("❌ Error in login:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

export default router;
