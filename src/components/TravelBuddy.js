// src/components/TravelBuddy.js
import React, { useState } from "react";
import TravelCoach from "../pages/TravelCoach"; // 👈 Import your existing AI Travel Coach
import "./TravelBuddy.css";

const TravelBuddy = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="travel-buddy">
      {/* Floating Avatar Button */}
      <div className="avatar-btn" onClick={() => setIsOpen(!isOpen)}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/4712/4712103.png"
          alt="AI Buddy"
        />
      </div>

      {/* Coach Chat Popup */}
      {isOpen && (
        <div className="coach-popup">
          <div className="coach-header">
            <h3>AI Travel Coach 🧭</h3>
            <button onClick={() => setIsOpen(false)}>✖</button>
          </div>
          <div className="coach-body">
            <TravelCoach /> {/* 👈 This shows your existing AI chat */}
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelBuddy;
