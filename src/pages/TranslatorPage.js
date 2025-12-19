import React, { useState } from "react";
import "./TranslatorPage.css";

const TranslatorPage = () => {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("French");
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);

  // 🎤 Speech Recognition (Browser API)
  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Sorry, your browser does not support speech recognition.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e);
      setListening(false);
    };

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      setText(voiceText);
    };

    recognition.start();
  };

  // 🧠 Translate using Gemini API
  const handleTranslate = async () => {
    if (!text.trim()) {
      setError("Please enter or speak a phrase to translate.");
      return;
    }

    setError("");
    setLoading(true);
    setTranslation("");

    try {
      const prompt = `Translate the following English sentence into ${language} and provide only the translation, no explanations: "${text}"`;

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
        const translatedText = result.choices[0].message.content.trim();
        setTranslation(translatedText);

        // 🔊 Automatically speak translation
        handleSpeak(translatedText);
      } else {
        setError("Failed to get translation. Please try again.");
      }
    } catch (err) {
      console.error("Translation error:", err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔊 Speak translation using Text-to-Speech
  const handleSpeak = (textToSpeak) => {
    if (!window.speechSynthesis) {
      alert("Speech synthesis not supported in this browser.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang =
      language.includes("French") ? "fr-FR" :
        language.includes("Spanish") ? "es-ES" :
          language.includes("German") ? "de-DE" :
            language.includes("Italian") ? "it-IT" :
              language.includes("Japanese") ? "ja-JP" :
                language.includes("Chinese") ? "zh-CN" :
                  language.includes("Hindi") ? "hi-IN" :
                    language.includes("Korean") ? "ko-KR" : "en-US";

    window.speechSynthesis.speak(utterance);
  };

  return (
    <section className="translator-section">
      <video autoPlay loop muted className="video-background">
        <source
          src="https://media.istockphoto.com/id/1444452402/video/flight-over-the-earth-during-the-night.mp4?s=mp4-640x640-is&k=20&c=8k4znDLUsvUxD5lxx4Fz1snv9EJbghEwT7O2bKhZ7cg="
          type="video/mp4"
        />
      </video>
      <div className="video-overlay"></div>

      <div className="translator-container">
        <h1 className="translator-title">🌍 AI Voice Translator</h1>
        <p className="translator-subtitle">
          Speak or type your phrase — get instant translation & audio!
        </p>

        <div className="translator-form">
          <div className="input-with-mic">
            <textarea
              placeholder="Type or say something (e.g. 'Where is the nearest bus stop?')"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              className={`mic-btn ${listening ? "listening" : ""}`}
              onClick={handleVoiceInput}
              title="Speak now"
            >
              🎤
            </button>
          </div>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option>French 🇫🇷</option>
            <option>Spanish 🇪🇸</option>
            <option>German 🇩🇪</option>
            <option>Italian 🇮🇹</option>
            <option>Japanese 🇯🇵</option>
            <option>Chinese 🇨🇳</option>
            <option>Hindi 🇮🇳</option>
            <option>Korean 🇰🇷</option>
          </select>

          <button onClick={handleTranslate} disabled={loading}>
            {loading ? "Translating..." : "Translate"}
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        {translation && (
          <div className="translation-box">
            <h3>✨ Translation in {language.split(" ")[0]}:</h3>
            <p>{translation}</p>
            <button
              className="speak-btn"
              onClick={() => handleSpeak(translation)}
            >
              🔊 Listen Again
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TranslatorPage;
