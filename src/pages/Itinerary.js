import React, { useState, useContext, useEffect } from "react";
import "./ItineraryGeneratorPage.css";
import { TravelContext } from "../context/TravelContext";

const ItineraryGeneratorPage = () => {
  const { destination, setDestination, addPoints } = useContext(TravelContext); // 🟢 added addPoints
  const [localDestination, setLocalDestination] = useState(destination || "");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Sync destination if changed globally
  useEffect(() => {
    if (destination && destination !== localDestination) {
      setLocalDestination(destination);
    }
  }, [destination]);

  const handleGenerateItinerary = async () => {
    if (!localDestination.trim() || !startDate || !endDate) {
      setError("Please fill in all fields.");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError("End date cannot be before start date.");
      return;
    }

    setLoading(true);
    setItinerary("");
    setError("");

    try {
      const prompt = `Generate a structured travel itinerary for "${localDestination}" from ${startDate} to ${endDate}. 
        Format it clearly with "Day 1:", "Day 2:" etc. Under each day, include 2-3 key activities with time suggestions.`;

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
        setItinerary(result.choices[0].message.content);

        // 🎯 Award points when itinerary is successfully generated
        addPoints(50);
        alert("🎉 You earned +50 Manzil Miles for planning your trip!");
      } else {
        setError("Failed to generate itinerary. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  // 🧾 Download itinerary as text file
  const handleDownload = () => {
    const blob = new Blob([itinerary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${localDestination || "Itinerary"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderItinerary = () => {
    return itinerary.split(/Day\s*\d+/i).map((dayBlock, index) => {
      if (!dayBlock.trim()) return null;

      const lines = dayBlock.trim().split(/\n|\*/).filter((line) => line.trim());
      const title = `Day ${index + 1}`;

      return (
        <div key={index} className="day-card">
          <h4>{title}</h4>
          <ul>
            {lines.map((activity, idx) => (
              <li key={idx}>
                <label>
                  <input type="checkbox" />
                  <span>{activity.replace(/\*\*/g, "").trim()}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      );
    });
  };

  return (
    <section className="itinerary-generator-page">
      <video autoPlay loop muted className="video-background">
        <source
          src="https://media.istockphoto.com/id/2178572575/video/a-highway-with-power-lines-stretching-across-a-mountain-landscape-with-snow-capped-peaks-in.mp4?s=mp4-640x640-is&k=20&c=4NAXlh7qTVfu2GB2xurJkC9uq_NNWv-AyEDe_kPdzWk="
          type="video/mp4"
        />
      </video>
      <div className="video-overlay"></div>

      <h2 className="page-title">✨ AI Itinerary Generator</h2>

      <div className="form-container">
        <p className="intro-text">Let AI plan your trip effortlessly!</p>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="destination">Destination</label>
            <input
              type="text"
              id="destination"
              placeholder="e.g., Paris"
              value={localDestination}
              onChange={(e) => {
                setLocalDestination(e.target.value);
                setDestination(e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <button
          className="generate-button"
          onClick={handleGenerateItinerary}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Itinerary"}
        </button>

        {loading && <div className="loading-message">⏳ Creating your itinerary...</div>}
        {error && <div className="error-message">{error}</div>}

        {itinerary && !loading && (
          <div className="result-container">
            <h3>Your Itinerary:</h3>
            <div className="itinerary-output">{renderItinerary()}</div>

            {/* 🧾 Download Button */}
            <button className="download-btn" onClick={handleDownload}>
              ⬇️ Download Itinerary
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ItineraryGeneratorPage;
