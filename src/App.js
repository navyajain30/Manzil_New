// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ✅ Global Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// ✅ Import All Pages
import Landing from "./pages/Landing";           // 🏠 Main landing page
import Flights from "./pages/Flights";
import Hotels from "./pages/Hotels";
import Explorer from "./pages/Explorer";
import Itinerary from "./pages/Itinerary";
import PackingList from "./pages/PackingList";
import Hero from "./components/Hero";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import TravelDiary from "./pages/TravelDiary";   // ✨ Travel Diary Page
import TranslatorPage from "./pages/TranslatorPage"; // 🌐 Translator Page
import RewardsPage from "./pages/RewardsPage";   // 🎁 Rewards Page
import TripMemoryAlbum from "./pages/TripMemoryAlbum";


// ✅ Context Provider
import { TravelProvider } from "./context/TravelContext";

function App() {
  return (
    <TravelProvider>
      <Router>
        {/* 🧭 Navbar — Rendered Once for All Pages */}
        <Navbar />

        <Routes>
          {/* 🌍 Main Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/explorer" element={<Explorer />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/packing" element={<PackingList />} />
          <Route path="/travel-diary" element={<TravelDiary />} />
          <Route path="/translator" element={<TranslatorPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/memory-album" element={<TripMemoryAlbum />} />

          <Route path="/hero" element={<Hero />} />

          {/* 🔐 Auth Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>

        {/* 🌎 Global Footer */}
        <Footer />
      </Router>
    </TravelProvider>
  );
}

export default App;
