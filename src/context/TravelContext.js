// src/context/TravelContext.js
import React, { createContext, useState } from "react";

export const TravelContext = createContext();

export const TravelProvider = ({ children }) => {
  const [destination, setDestination] = useState("");
  const [mood, setMood] = useState("");
  const [points, setPoints] = useState(0); // 🟢 NEW: Tracks Manzil Miles

  // 🏆 Function to add points safely
  const addPoints = (value) => {
    setPoints((prev) => prev + value);
  };

  return (
    <TravelContext.Provider
      value={{
        destination,
        setDestination,
        mood,
        setMood,
        points,
        addPoints, // 🟢 export addPoints
      }}
    >
      {children}
    </TravelContext.Provider>
  );
};
