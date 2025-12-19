// src/pages/Explorer.js
import React, { useState, useContext } from "react";
import "./DestinationExplorerPage.css";
import { TravelContext } from "../context/TravelContext";

const DestinationExplorerPage = () => {
  const [moodInput, setMoodInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [parsedSuggestion, setParsedSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("mood");

  // ✅ Access global destination setter
  const { setDestination } = useContext(TravelContext);

  const handleGetSuggestion = async () => {
    let prompt = "";

    if (mode === "mood") {
      if (!moodInput.trim()) {
        setError("Please describe your mood or preferences to get a suggestion.");
        return;
      }
      prompt = `Based on the following mood and travel preferences, suggest a travel destination and a few activities suitable for that mood. Be creative and concise.
      Mood/Preferences: "${moodInput}"
      Example Output Format:
      Destination: [City/Region]
      Activities:
      - [Activity 1]
      - [Activity 2]
      - [Activity 3]`;
    } else {
      if (!destinationInput.trim()) {
        setError("Please enter a destination to get nearby attractions.");
        return;
      }
      prompt = `Suggest 3-5 popular nearby attractions and activities for the following destination. Be concise and provide short descriptions.
      Destination: "${destinationInput}"
      Example Output Format:
      Nearby Attractions for [Destination]:
      - [Attraction 1]: [Short description]
      - [Attraction 2]: [Short description]
      - [Attraction 3]: [Short description]`;
    }

    setLoading(true);
    setSuggestion("");
    setParsedSuggestion(null);
    setError("");

    try {
      const apiUrl = "http://localhost:5000/api/gemini/proxy";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }]
        }),
      });

      const result = await response.json();

      if (result.choices && result.choices[0]?.message?.content) {
        const text = result.choices[0].message.content;
        setSuggestion(text);
        parseSuggestion(text);
      } else {
        setError("Failed to get a suggestion. Please try again.");
        console.error("Unexpected API response:", result);
      }
    } catch (err) {
      setError("An error occurred while fetching suggestions. Please check your network connection.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Parse the API response cleanly (removes **, _, etc.)
  const parseSuggestion = (text) => {
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    let destination = "";
    let items = [];

    lines.forEach((line) => {
      if (line.startsWith("Destination:") || line.startsWith("Nearby Attractions for")) {
        destination = line.replace("Destination:", "").trim();
      } else if (line.startsWith("-")) {
        items.push(line.replace("-", "").trim());
      }
    });

    // 🧹 Clean up markdown (**bold**, *italic*, etc.)
    const cleanDestination = destination.replace(/[*_#]/g, "").trim();

    setParsedSuggestion({ destination: cleanDestination, items });

    // 🌍 Save globally for Itinerary + PackingList
    if (cleanDestination) setDestination(cleanDestination);
  };

  return (
    <section className="page-section destination-explorer-page">
      <video autoPlay loop muted className="video-background">
        <source
          src="https://media.istockphoto.com/id/1329221980/video/couple-enjoying-sightseeing-at-beautiful-landscape.mp4?s=mp4-640x640-is&k=20&c=jvC8vSCNXt6ST-6WGltyiw0CKNdI-hQYJKLXDJ0jKUM="
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <div className="video-overlay"></div>

      <h2 className="page-title">Destination Explorer: Find Your Perfect Trip</h2>
      <div className="form-container">
        <p className="ai-intro-text">
          Tell us your mood or a destination, and our AI will inspire your next adventure!
        </p>

        <div className="mode-selection">
          <button
            onClick={() => {
              setMode("mood");
              setSuggestion("");
              setError("");
              setMoodInput("");
              setDestinationInput("");
            }}
            className={`mode-selection-button ${mode === "mood" ? "active" : ""}`}
          >
            Mood-Based ✨
          </button>
          <button
            onClick={() => {
              setMode("destination");
              setSuggestion("");
              setError("");
              setMoodInput("");
              setDestinationInput("");
            }}
            className={`mode-selection-button ${mode === "destination" ? "active" : ""}`}
          >
            Nearby Attractions ✨
          </button>
        </div>

        {mode === "mood" ? (
          <div className="form-group">
            <label htmlFor="moodInput">Describe your mood or preferences:</label>
            <textarea
              id="moodInput"
              rows="4"
              placeholder="e.g., 'Relaxed beach vibes with fresh seafood and sunsets.'"
              value={moodInput}
              onChange={(e) => setMoodInput(e.target.value)}
            ></textarea>
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="destinationInput">Enter a Destination:</label>
            <input
              type="text"
              id="destinationInput"
              placeholder="e.g., Bali, New York, Prague"
              value={destinationInput}
              onChange={(e) => setDestinationInput(e.target.value)}
            />
          </div>
        )}

        <div className="form-center">
          <button
            onClick={handleGetSuggestion}
            className="ai-submit-button"
            disabled={loading}
          >
            {loading ? "Thinking..." : "Get Suggestion"}
          </button>
        </div>

        {loading && (
          <div className="loading-message">
            <svg
              className="spinner"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Generating your personalized travel idea...
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {parsedSuggestion && !loading && (
          <div className="ai-result-container">
            <h3 className="ai-result-title">Your Personalized Travel Suggestion:</h3>
            <div className="ai-result-card">
              {parsedSuggestion.destination && (
                <h4 className="ai-destination">📍 {parsedSuggestion.destination}</h4>
              )}
              <ul className="ai-activities-list">
                {parsedSuggestion.items.map((item, index) => (
                  <li key={index}>
                    <label className="checkbox-label">
                      <input type="checkbox" /> {item}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DestinationExplorerPage;
