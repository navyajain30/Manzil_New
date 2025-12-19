import React, { useContext, useEffect, useState, useRef } from "react";
import "./RewardsPage.css";
import { TravelContext } from "../context/TravelContext";
import confetti from "canvas-confetti";
import html2canvas from "html2canvas";

const RewardsPage = () => {
  const { points } = useContext(TravelContext);
  const [badge, setBadge] = useState("🚀 New Traveler");
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const badgeRef = useRef(null); // 🟢 Capture this area

  const getBadge = () => {
    if (points >= 500) return "🌍 Global Explorer";
    if (points >= 300) return "✈ Frequent Traveler";
    if (points >= 100) return "🧳 Adventurer";
    if (points >= 50) return "🎒 Beginner Explorer";
    return "🚀 New Traveler";
  };

  const nextGoal = points < 50 ? 50 : points < 100 ? 100 : points < 300 ? 300 : 500;
  const progress = Math.min((points / nextGoal) * 100, 100);

  useEffect(() => {
    const newBadge = getBadge();
    if (newBadge !== badge) {
      setBadge(newBadge);
      setShowLevelUp(true);
      triggerConfetti();
      generateAIMessage(newBadge);
      setTimeout(() => setShowLevelUp(false), 4000);
    }
  }, [points]);

  const triggerConfetti = () => {
    const duration = 2000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  const generateAIMessage = async (badgeName) => {
    const prompt = `Write a short, fun, motivational message (under 30 words) for a traveler who just earned the "${badgeName}" badge in a travel gamification app.`;
    try {
      const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
      const apiKey = "AIzaSyAX-2y5iGsMUw-LVQRQQbavG8xPsNf3T5Y";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
      setAiMessage(text);
    } catch {
      setAiMessage("Keep exploring — your next adventure awaits! 🌍");
    }
  };

  // 🖼️ Capture & Download Badge as Image
  const handleShareBadge = async () => {
    if (!badgeRef.current) return;
    const canvas = await html2canvas(badgeRef.current);
    const image = canvas.toDataURL("image/png");

    // Attempt native share
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Manzil Badge 🏅",
          text: `I just earned the "${badge}" badge with ${points} Manzil Miles! 🌍`,
          files: [
            new File([await (await fetch(image)).blob()], "manzil-badge.png", { type: "image/png" }),
          ],
        });
      } catch (err) {
        console.log("Share canceled", err);
      }
    } else {
      // Fallback: Download
      const link = document.createElement("a");
      link.href = image;
      link.download = "manzil-badge.png";
      link.click();
    }
  };

  return (
    <section className="rewards-page">
      <video autoPlay muted loop className="video-background">
        <source
          src="https://media.istockphoto.com/id/1302921341/video/airplane-flying-above-beautiful-clouds.mp4?s=mp4-640x640-is&k=20&c=GzAh_HUpjL1n9LwGAYPbVtPbVY8Kf8TzYXSP5IXkoOM="
          type="video/mp4"
        />
      </video>
      <div className="video-overlay"></div>

      <div className="rewards-content">
        <h1 className="title">🏅 Manzil Miles Rewards Center</h1>
        <p className="subtitle">Earn, unlock & share your achievements! ✨</p>

        {/* 🏆 Badge Section to Capture */}
        <div ref={badgeRef} className="points-display-box">
          <h2>Your Current Miles:</h2>
          <p className="points">{points}</p>
          <h3 className="badge">Your Badge: {badge}</h3>

          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="goal-text">Next Badge at {nextGoal} Miles 🌟</p>
        </div>

        <button className="share-btn" onClick={handleShareBadge}>
          📸 Share My Badge
        </button>

        {showLevelUp && (
          <div className="level-up-popup">
            <h2>🎉 Level Up!</h2>
            <p>You’ve unlocked: {badge}</p>
            {aiMessage && <p className="ai-message">🤖 {aiMessage}</p>}
          </div>
        )}

        <div className="rewards-grid">
          <div className="reward-card">
            <h3>🎟️ 100 Miles</h3>
            <p>Unlock a digital postcard pack.</p>
            <button disabled={points < 100}>Redeem</button>
          </div>
          <div className="reward-card">
            <h3>🧭 300 Miles</h3>
            <p>Exclusive AI trip-planning tips.</p>
            <button disabled={points < 300}>Redeem</button>
          </div>
          <div className="reward-card">
            <h3>🌍 500 Miles</h3>
            <p>VIP “Global Explorer” badge access.</p>
            <button disabled={points < 500}>Redeem</button>
          </div>
        </div>

        <p className="note">Keep exploring — share your journey with the world! 🌎</p>
      </div>
    </section>
  );
};

export default RewardsPage;
