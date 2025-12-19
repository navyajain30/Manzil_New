import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Map from "../components/Map";
import AITravelCoach from "../components/AITravelCoach";
import "./Landing.css";
import testimonials from "./testimonials.json";
import packages from "./packages.json";

const LandingPage = () => {
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-container">
      {/* ---- HERO SECTION ---- */}
      <div className="landing-hero">
        <video
          className="background-video"
          src="https://media.istockphoto.com/id/2087813515/video/walking-in-arashiyama-bamboo-forest-kyoto-osaka-japan.mp4?s=mp4-640x640-is&k=20&c=S3xGOL3HYTyLHWAPJZJYXeHwHXiSnmOSNRS5VQJ77KE="
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="overlay fade-in">
          <h1 className="title">Discover Your मनZil</h1>
          <p className="subtitle">Plan, Explore & Experience the perfect journey</p>
          <div className="cta-buttons">
            <Link to="/flights" className="btn explore">✈ Flights</Link>
            <Link to="/hotels" className="btn hotels">🏨 Hotels</Link>
            <Link to="/explorer" className="btn mood">🧭 Mood Explorer</Link>
          </div>
        </div>
      </div>

      {/* ---- PACKAGES SECTION ---- */}
      <section className="packages-section fade-in">
        <video className="packages-video" autoPlay muted loop>
          <source
            src="https://media.istockphoto.com/id/1319828898/video/durbar-square-kathmandu.mp4?s=mp4-640x640-is&k=20&c=Pw1-JIT4BNBkiA3T6qcrCqksc3bDfJ7N1WvKd0IK52A="
            type="video/mp4"
          />
        </video>
        <div className="packages-overlay">
          <h2>Curated Travel Packages</h2>
          <p>Explore places I've personally visited and recommend with love ✈</p>
          <div className="package-cards">
            {packages.map((pkg) => (
              <div key={pkg.id} className="package-card">
                {pkg.emoji} {pkg.title} – {pkg.description}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- TESTIMONIALS SECTION ---- */}
      <section className="testimonials fade-in">
        <video autoPlay loop muted playsInline className="background-video">
          <source
            src="https://media.istockphoto.com/id/2152844460/video/aerial-view-beautiful-rainbow-after-a-rainstorm-over-the-forest.mp4?s=mp4-640x640-is&k=20&c=0Vlrj1JbTdWV3CGvNUGE3LFvah2iWhTUIS4XblkvDPE="
            type="video/mp4"
          />
        </video>
        <div className="overlay"></div>
        <div className="content">
          <h2>What Travellers Say 💖</h2>
          <div className="testimonial-cards">
            {testimonials.map((t) => (
              <div className="testimonial-card" key={t.id}>
                <p>"{t.message}"</p>
                <h4>- {t.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- ABOUT US SECTION ---- */}
      <section className="about-section">
        <video autoPlay muted loop className="about-video">
          <source
            src="https://media.istockphoto.com/id/1482328578/video/kathmandus-durbar-square-a-timeless-journey.mp4?s=mp4-640x640-is&k=20&c=lbWftR8KAYUgGdCOchixzH1zRs-L6PyyUTj_vIJrI3c="
            type="video/mp4"
          />
        </video>
        <div className="about-content">
          <h2>About Us</h2>
          <p>
            We are passionate travelers on a mission to help you find your own 'मंज़िल'.
          </p>
          <div className="about-cards-container">
            <div className="about-card">✨ Personalized Itineraries for Every Mood</div>
            <div className="about-card">🌍 Trusted by Travelers Across the Globe</div>
            <div className="about-card">🚀 Fast, Responsive & Beautiful Experience</div>
            <div className="about-card">🤖 Mood-Based Trip Planning with AI</div>
            <div className="about-card">📦 All-in-One Travel Toolkit</div>
          </div>
        </div>
      </section>

      {/* ---- MAP SECTION ---- */}
      <section className="map-section fade-in" style={{ margin: "3rem 0" }}>
        <h2>Our Location</h2>
        <Map />
      </section>

      {/* ---- CONTACT SECTION ---- */}
      <div className="contact-container">
        <div className="contact-header">
          <h2>Get in Touch</h2>
          <p>
            Want to connect with us? We’d love to hear from you. Choose an option below:
          </p>
        </div>
        <div className="contact-grid">
          <div className="contact-card sales">
            <i className="fas fa-phone-alt contact-icon"></i>
            <h3>Talk to Sales</h3>
            <p>Interested in Manzil Travels? Call us anytime to chat with our sales team.</p>
            <a href="tel:+919876543210" className="contact-link">📞 +91 98765 43210</a>
          </div>

          <div className="contact-card support">
            <i className="fas fa-headset contact-icon"></i>
            <h3>Customer Support</h3>
            <p>Need help? Our support team is here for you 24/7.</p>
            <a href="mailto:support@manziltravels.com" className="support-btn">
              Contact Support
            </a>
          </div>

          <div className="contact-card email">
            <i className="fas fa-envelope contact-icon"></i>
            <h3>Email Us</h3>
            <p>Got queries? Drop us an email and we’ll get back shortly.</p>
            <a href="mailto:support@manziltravels.com" className="contact-link">
              📧 support@manziltravels.com
            </a>
          </div>

          <div className="contact-card location">
            <i className="fas fa-map-marker-alt contact-icon"></i>
            <h3>Visit Us</h3>
            <p>Come say hello at our office and let’s discuss your travel plans.</p>
            <p className="contact-link">📍 Connaught Place, New Delhi</p>
          </div>
        </div>
      </div>

      {/* ---- AI TRAVEL COACH (Floating Chat) ---- */}
      <AITravelCoach />
    </div>
  );
};

export default LandingPage;
