import React, { useState, useRef } from "react";
import "./TripMemoryAlbum.css";
import * as htmlToImage from "html-to-image";
import { jsPDF } from "jspdf";

const TripMemoryAlbum = () => {
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [photos, setPhotos] = useState([]);
  const [albumGenerated, setAlbumGenerated] = useState(false);
  const albumRef = useRef(null);

  // Upload multiple photos
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("You can upload up to 5 photos only!");
      return;
    }
    const newPhotos = files.map((file) => URL.createObjectURL(file));
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const handleGenerate = () => {
    if (!destination || !date || photos.length === 0) {
      alert("Please fill all fields and upload at least one photo!");
      return;
    }
    setAlbumGenerated(true);
  };

  // Export PNG
  const handleDownloadPNG = async () => {
    const dataUrl = await htmlToImage.toPng(albumRef.current);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${destination}_Scrapbook.png`;
    link.click();
  };

  // Export PDF
  const handleDownloadPDF = async () => {
    const dataUrl = await htmlToImage.toPng(albumRef.current);
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(dataUrl);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${destination}_Scrapbook.pdf`);
  };

  return (
    <div className="trip-memory-container">
      <div className="memory-overlay"></div>

      <div className="content">
        <h1 className="title">🌟AI Trip Memory Scrapbook🌟</h1>
        <p className="subtitle">Pin your favorite travel memories here 💫</p>

        <div className="trip-inputs">
          <input
            type="text"
            placeholder="Enter Destination (e.g., Paris)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="upload-box">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
          />
          <button className="glow-btn" onClick={handleGenerate}>
            Generate Scrapbook
          </button>
        </div>

        {albumGenerated && (
          <>
            <div className="scrapbook-board" ref={albumRef}>
              <h2 className="board-title">✈ Memories from {destination}</h2>
              <p className="board-date">Captured on {date}</p>

              <div className="polaroid-board">
                {photos.map((photo, index) => (
                  <div
                    key={index}
                    className={`polaroid polaroid-${index % 5}`}
                  >
                    <div className="tape top-left"></div>
                    <div className="tape top-right"></div>
                    <img src={photo} alt={`Moment ${index + 1}`} />
                    <p>Moment #{index + 1}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="download-buttons">
              <button className="download-btn" onClick={handleDownloadPNG}>
                🖼️ Download as PNG
              </button>
              <button className="download-btn" onClick={handleDownloadPDF}>
                📕 Download as PDF
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TripMemoryAlbum;
