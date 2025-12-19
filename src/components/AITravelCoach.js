import React, { useState } from "react";
import "./AITravelCoach.css";

const AITravelCoach = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hey traveler! I’m your AI Travel Coach. How can I help today?" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { sender: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput("");
    setLoading(true);

    try {
      const prompt = `You are a helpful travel assistant. ${userInput}`;

      const apiUrl = "http://localhost:5000/api/gemini/proxy";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // model: "llama3-8b-8192", // Rely on backend default
          messages: [{ role: "user", content: prompt }]
        }),
      });

      const result = await response.json();
      const aiReply =
        result.choices?.[0]?.message?.content ||
        "Sorry, I couldn’t find the answer. Try asking differently!";

      setMessages((prev) => [...prev, { sender: "bot", text: aiReply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Network error! Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button className="chat-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>AI Travel Coach 🌍</h3>
            <button className="close-btn" onClick={() => setIsOpen(false)}>✖</button>
          </div>

          <div className="chat-body">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="chat-message bot">🤖 Thinking...</div>}
          </div>

          <div className="chat-footer">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask me about your trip..."
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default AITravelCoach;
