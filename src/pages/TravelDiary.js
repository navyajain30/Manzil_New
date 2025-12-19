import React, { useState, useContext, useEffect } from "react";
import "./TravelDiary.css";
import { TravelContext } from "../context/TravelContext";

const TravelDiary = () => {
  const { destination, setDestination } = useContext(TravelContext);
  const [localDestination, setLocalDestination] = useState(destination || "");
  const [diaryText, setDiaryText] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (destination && destination !== localDestination) {
      setLocalDestination(destination);
    }
  }, [destination]);

  // ✅ Generate AI summary of diary
  const handleGenerateSummary = async () => {
    if (!localDestination.trim() || !diaryText.trim()) {
      setError("Please fill in both the destination and your diary entry.");
      return;
    }

    setLoading(true);
    setError("");
    setAiSummary("");

    try {
      const prompt = `
      You are a friendly travel storyteller. Summarize the following travel diary into a warm, emotional story.
      Make it sound like a short travel blog post with a positive tone.
      Destination: ${localDestination}
      Diary: ${diaryText}
      `;

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

      if (
        result.choices &&
        result.choices[0]?.message?.content
      ) {
        setAiSummary(result.choices[0].message.content);
      } else {
        setError("Failed to generate summary. Please try again.");
      }
    } catch (err) {
      setError("Error connecting to AI service. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Download diary as a text file
  const handleDownload = () => {
    let textContent = `My Travel Diary - ${localDestination}\n\n`;
    textContent += `🗺️ Destination: ${localDestination}\n\n`;
    textContent += `✍️ My Experience:\n${diaryText}\n\n`;
    if (aiSummary) textContent += `🤖 AI Story Summary:\n${aiSummary}\n`;

    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${localDestination || "TravelDiary"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="travel-diary-page">
      <video autoPlay loop muted className="video-background">
        <source
          src="https://media.istockphoto.com/id/1329148950/video/travel-blogger-takes-a-video-with-a-smartphone-on-a-trip-a-young-woman-uses-a-smartphone-to.mp4?s=mp4-640x640-is&k=20&c=im4TKMeU44M4QicRwjEq3x8mklF8XBRaxUnm8D3TjOQ="
          type="video/mp4"
        />
      </video>
      <div className="video-overlay"></div>

      <div className="diary-container">
        <h1 className="diary-title">📝 My Travel Diary</h1>
        <p className="diary-subtitle">Reflect on your journey, and let AI craft your story!</p>

        <div className="form-grid">
          <input
            type="text"
            placeholder="Destination (e.g. Paris, Goa)"
            value={localDestination}
            onChange={(e) => {
              setLocalDestination(e.target.value);
              setDestination(e.target.value);
            }}
          />

          <input
            type="text"
            placeholder="Optional image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        {imageUrl && (
          <div className="preview-image">
            <img src={imageUrl} alt="Travel preview" />
          </div>
        )}

        <textarea
          rows="8"
          placeholder="Write about your travel experience..."
          value={diaryText}
          onChange={(e) => setDiaryText(e.target.value)}
        ></textarea>

        <button onClick={handleGenerateSummary} disabled={loading} className="generate-button">
          {loading ? "Creating Story..." : "Generate AI Summary"}
        </button>

        {error && <div className="error">{error}</div>}

        {aiSummary && (
          <div className="summary-section">
            <h2>🤖 AI Story Summary</h2>
            <p>{aiSummary}</p>

            <button className="download-btn" onClick={handleDownload}>
              ⬇️ Download Diary
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TravelDiary;
