import React, { useState, useContext, useEffect } from "react";
import "./PackingListPage.css";
import { TravelContext } from "../context/TravelContext";

const PackingListPage = () => {
  const { destination, mood, addPoints } = useContext(TravelContext); // 🟢 Added addPoints
  const [localDestination, setLocalDestination] = useState(destination || "");
  const [packingList, setPackingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle specific section
    }));
  };

  // ✅ Sync destination & mood automatically
  useEffect(() => {
    if (destination && destination !== localDestination) {
      setLocalDestination(destination);
    }
  }, [destination]);

  // ✅ Parse AI response text into structured list
  const parsePackingList = (text) => {
    const lines = text.split("\n");
    let parsedList = [];
    let currentCategory = null;

    lines.forEach((line) => {
      const cleanLine = line.trim();
      if (cleanLine === "") return;

      const categoryMatch = cleanLine.match(
        /^(#+\s*)?(\*{0,2})([A-Za-z0-9 ,.'()/-]+)(\*{0,2}):?$/
      );

      if (categoryMatch) {
        let catName = categoryMatch[3].trim();
        currentCategory = { category: catName, items: [] };
        parsedList.push(currentCategory);
      } else if (currentCategory) {
        const itemText = cleanLine
          .replace(/^[-*•]\s*/, "")
          .replace(/\*\*/g, "")
          .replace(/\*/g, "")
          .trim();

        if (itemText.length > 0) {
          currentCategory.items.push({ name: itemText, checked: false });
        }
      }
    });

    return parsedList;
  };

  // ✅ Generate packing list using mood from context
  const handleGeneratePackingList = async () => {
    if (!localDestination.trim()) {
      setError("Please enter a destination.");
      return;
    }

    setLoading(true);
    setPackingList([]);
    setError("");

    try {
      const tripMood = mood || "general"; // fallback if no mood selected
      const prompt = `Generate a packing list for a "${tripMood}" trip to "${localDestination}".
      Include categories like Clothing, Toiletries, Documents, Electronics, and Miscellaneous.
      Avoid Markdown or special characters; use bullet points for items.`;

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
        let structuredList = parsePackingList(text);

        if (structuredList.length === 0) {
          structuredList = [
            { category: "Packing List", items: [{ name: text, checked: false }] },
          ];
        }

        setPackingList(structuredList);

        // 🎯 Award points for generating packing list
        addPoints(30);
        alert("🧳 You earned +30 Manzil Miles for creating your packing list!");

        // Auto-expand the first category
        setExpandedSections({ 0: true });
      } else {
        setError("Failed to generate packing list. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Checkbox toggle
  const toggleCheck = (catIndex, itemIndex) => {
    const updatedList = [...packingList];
    updatedList[catIndex].items[itemIndex].checked =
      !updatedList[catIndex].items[itemIndex].checked;
    setPackingList(updatedList);
  };

  // ✅ Download list as .txt
  const handleDownload = () => {
    let textContent = `Packing List for ${localDestination}\nTrip Type: ${mood}\n\n`;
    packingList.forEach((category) => {
      textContent += `${category.category}:\n`;
      category.items.forEach((item) => {
        textContent += `- ${item.name}${item.checked ? " ✅" : ""}\n`;
      });
      textContent += "\n";
    });

    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${localDestination || "PackingList"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const categoryIcons = {
    Clothing: "👕",
    Toiletries: "💊",
    Documents: "📄",
    Electronics: "🔌",
    Miscellaneous: "🎒",
  };

  const getCategoryIcon = (category) => categoryIcons[category] || "⚡";

  return (
    <section className="packing-list-page">
      <video autoPlay loop muted className="video-background">
        <source
          src="https://media.istockphoto.com/id/808914462/video/multi-ethnic-family-pack-car-for-vacation-or-road-trip.mp4?s=mp4-640x640-is&k=20&c=qQtCEY1E47P0pUUC7WlORDfMf2xCEa8kA9dei_h0SgE="
          type="video/mp4"
        />
      </video>
      <div className="video-overlay"></div>

      <div className="packing-content">
        <h1 className="packing-title">🎒 Smart Packing List Generator</h1>
        <p className="packing-subtitle">
          Let AI plan your luggage based on your trip type automatically!
        </p>

        {/* ✅ Only one visible input now */}
        <div className="form-grid single-input">
          <input
            type="text"
            placeholder="Destination (e.g. Paris, Goa)"
            value={localDestination}
            onChange={(e) => setLocalDestination(e.target.value)}
            required
          />
        </div>

        <button
          onClick={handleGeneratePackingList}
          className="generate-button"
          disabled={loading}
        >
          {loading ? "Creating List..." : "Generate Packing List"}
        </button>

        {loading && <div className="loading">⏳ Gathering items...</div>}
        {error && <div className="error">{error}</div>}

        {packingList.length > 0 && (
          <div className="packing-output">
            <h2>Your Personalized Packing List</h2>
            {packingList.map((category, catIndex) => (
              <div key={catIndex} className="accordion-card">
                <div
                  className={`accordion-header ${expandedSections[catIndex] ? "active" : ""}`}
                  onClick={() => toggleSection(catIndex)}
                >
                  <h3>
                    {getCategoryIcon(category.category)} {category.category}
                  </h3>
                  <span className="accordion-icon">{expandedSections[catIndex] ? "−" : "+"}</span>
                </div>

                <div className={`accordion-body ${expandedSections[catIndex] ? "open" : ""}`}>
                  <ul>
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <label>
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => toggleCheck(catIndex, itemIndex)}
                          />
                          <span className={item.checked ? "checked-item" : ""}>
                            {item.name}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            <button className="download-btn" onClick={handleDownload}>
              ⬇️ Download Packing List
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PackingListPage;
