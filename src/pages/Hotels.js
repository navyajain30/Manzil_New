import React, { useState, useMemo } from "react";
import "./HotelsPage.css";

// --- Hardcoded sample data with image URLs ---
// Note: Using publicly available stock photo URLs for a realistic look.
// --- Updated Hardcoded sample data with more reliable image URLs ---
const allHotels = [
  // MUMBAI HOTELS (3)
  {
    id: 1,
    name: "The Grand Regal Tower, Andheri",
    location: "Mumbai, Maharashtra",
    // Changed URL to a direct Unsplash source (generally more reliable)
    image: "https://images.unsplash.com/photo-1596701041908-6058a5c3e536?fit=crop&w=800&q=80",
    rating: 4.6,
    reviews: 1850,
    price: 11200,
    type: "Luxury Hotel",
    amenities: ["Free Breakfast", "Sky Pool", "Bar"],
    discount: "20% OFF",
    tag: "MMT Assured",
  },
  {
    id: 2,
    name: "Elite Business Stay, BKC",
    location: "Mumbai, Maharashtra",
    // Changed URL to a direct Unsplash source
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?fit=crop&w=800&q=80",
    rating: 4.1,
    reviews: 930,
    price: 6500,
    type: "Hotel",
    amenities: ["Free Wi-Fi", "Airport Shuttle"],
    tag: "Value Deal",
  },
  {
    id: 3,
    name: "Aura Service Apartments",
    location: "Mumbai, Maharashtra",
    // Changed URL to a direct Unsplash source
    image: "https://images.unsplash.com/photo-1582234057635-4ed3a96025cc?fit=crop&w=800&q=80",
    rating: 4.4,
    reviews: 710,
    price: 8800,
    type: "Apartment",
    amenities: ["Kitchen", "Gym", "Parking"],
    tag: "Family Stay",
  },
  // GOA HOTELS (3)
  {
    id: 4,
    name: "Blue Lagoon Beach Resort",
    location: "Goa, North Goa",
    // Changed URL to a direct Unsplash source
    image: "https://images.unsplash.com/photo-1570198889955-e45f95b597c5?fit=crop&w=800&q=80",
    rating: 4.8,
    reviews: 1980,
    price: 14500,
    type: "Resort",
    amenities: ["Private Beach", "Spa", "Pool"],
    discount: "30% OFF",
    tag: "Best Seller",
  },
  {
    id: 5,
    name: "Palms & Sands Hotel, Baga",
    location: "Goa, North Goa",
    // Changed URL to a direct Unsplash source
    image: "https://images.unsplash.com/photo-1596436889106-c87a554a938c?fit=crop&w=800&q=80",
    rating: 4.2,
    reviews: 1100,
    price: 7800,
    type: "Hotel",
    amenities: ["Near Beach", "Free Wi-Fi"],
    tag: "Popular",
  },
  {
    id: 6,
    name: "The Portuguese Villa",
    location: "Goa, South Goa",
    // Changed URL to a direct Unsplash source
    image: "https://images.unsplash.com/photo-1592237084501-c5f1a30283c7?fit=crop&w=800&q=80",
    rating: 4.5,
    reviews: 580,
    price: 9900,
    type: "Villa",
    amenities: ["Private Pool", "Historic"],
    tag: "Exclusive",
  },
  // JAIPUR HOTELS (3)
  {
    id: 7,
    name: "Royal Heritage Haveli",
    location: "Jaipur, Rajasthan",
    // Changed URL to a direct Unsplash source
    image: "https://images.unsplash.com/photo-1588145785055-6670868a867b?fit=crop&w=800&q=80",
    rating: 4.9,
    reviews: 1500,
    price: 15500,
    type: "Heritage",
    amenities: ["Rooftop Dining", "History Tour"],
    discount: "25% OFF",
    tag: "Luxury Stay",
  },
  {
    id: 8,
    name: "Pink City Comfort Inn",
    location: "Jaipur, Rajasthan",
    // Changed URL to a direct Unsplash source
    image: "https://images.unsplash.com/photo-1579782530188-75b5b297b83d?fit=crop&w=800&q=80",
    rating: 3.8,
    reviews: 620,
    price: 4900,
    type: "Hotel",
    amenities: ["Near Hawa Mahal", "Free Parking"],
    tag: "Budget Friendly",
  },
  {
    id: 9,
    name: "The Leela Palace",
    location: "Jaipur, Rajasthan",
    // Changed URL to a direct Unsplash source
    image: "https://images.unsplash.com/photo-1520250400589-71285042459a?fit=crop&w=800&q=80",
    rating: 5.0,
    reviews: 2100,
    price: 25000,
    type: "Palace Hotel",
    amenities: ["Luxury Spa", "Private Butler"],
    tag: "VIP Only",
  },
];

// --- Sub-Component: HotelCard ---
const HotelCard = ({ hotel }) => {
  // Simple calculation for mock old price
  const oldPrice = Math.round(hotel.price / (1 - (hotel.discount ? parseFloat(hotel.discount) / 100 : 0.05)));

  return (
    <div className="hotel-card-mmt">
      <div className="hotel-image-section">
        {/* Use actual hardcoded image URL */}
        <img src={hotel.image} alt={hotel.name} className="hotel-photo" loading="lazy" />
        {hotel.tag && <div className="hotel-tag">{hotel.tag}</div>}
      </div>
      <div className="hotel-details-section">
        <h3 className="hotel-name">{hotel.name}</h3>
        <p className="hotel-location">{hotel.location}</p>
        <div className="hotel-amenities">
          {hotel.amenities.map((amenity, index) => (
            <span key={index} className="amenity-badge">{amenity}</span>
          ))}
        </div>
        
        {/* Rating and Reviews Section */}
        <div className="rating-review-container">
            <div className="rating-box">
                <span>★ {hotel.rating}</span>
            </div>
            <span className="review-count">{hotel.reviews.toLocaleString()} reviews</span>
        </div>

        <div className="hotel-description">
          <p className="hotel-type">{hotel.type}</p>
          <div className="cancellation-policy">
            <span className="policy-badge">Free Cancellation</span>
          </div>
        </div>
      </div>
      <div className="hotel-price-section">
        <div className="price-info">
          <p className="old-price">{oldPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })}</p>
          <h4 className="current-price">{hotel.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })}</h4>
        </div>
        <span className="per-night">per night</span>
        {hotel.discount && <div className="discount-badge">{hotel.discount}</div>}
        <button className="view-details-btn">View Details</button>
      </div>
    </div>
  );
};

// --- Main Component: Hotels ---
const Hotels = () => {
  // Initial state is empty, and inputs are not pre-filled
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [lastSearchedDestination, setLastSearchedDestination] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setSearchAttempted(true);
    
    // Normalize and clean up the destination input for display
    const currentDestination = destination.trim() || "All Destinations";
    setLastSearchedDestination(currentDestination);

    // Normalize search term for filtering
    const search = destination.toLowerCase().trim();

    // Simulate API call delay
    setTimeout(() => {
      let filteredResults = [];

      if (search) {
        // Find hotels where location OR name includes the search term
        filteredResults = allHotels.filter(hotel => 
          hotel.location.toLowerCase().includes(search) || 
          hotel.name.toLowerCase().includes(search)
        );
      }
      
      // If no results found for the specific query, show a No Results message.
      // If the query was empty, and they hit search, we still show the initial state unless we explicitly want to show all.
      // Per requirements, if searching, only show filtered results.
      
      // Limit results to a maximum of 6 (or whatever is found)
      if (filteredResults.length > 6) {
          filteredResults = filteredResults.slice(0, 6);
      }

      setResults(filteredResults);
      setLoading(false);
    }, 1000);
  };
  
  // Note: No useEffect/useMemo runs on initial mount to ensure empty state.

  return (
    <div className="hotels-page-mmt">
      <div className="hotels-hero-section">
        <div className="search-bar-mmt-container">
          <form onSubmit={handleSearch} className="search-bar-mmt">
            <div className="input-group-mmt destination-group">
              <label htmlFor="destination">Destination</label>
              <input
                type="text"
                id="destination"
                placeholder="City, area, or property name (e.g., Mumbai)"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </div>

            <div className="input-group-mmt date-group check-in">
              <label htmlFor="check-in">Check In</label>
              <input
                type="date"
                id="check-in"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>

            <div className="input-group-mmt date-group check-out">
              <label htmlFor="check-out">Check Out</label>
              <input
                type="date"
                id="check-out"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>

            <div className="input-group-mmt guests-group">
              <label htmlFor="guests">Guests & Rooms</label>
              <input
                type="number"
                id="guests"
                placeholder="2 Guests, 1 Room"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                min="1"
              />
            </div>

            <button type="submit" className="search-btn-mmt" disabled={loading}>
              {loading ? 'Searching...' : 'SEARCH'}
            </button>
          </form>
        </div>
      </div>

      <div className="hotel-listing-mmt-container">
        <div className="listing-sidebar">
            <h4 className="sidebar-title">Filters</h4>
            <div className="filter-hint">
                <p>Filter logic is enabled:</p>
                <p>- Try searching "Mumbai", "Goa", or "Jaipur".</p>
                <p>- Only 3-6 hardcoded results will show.</p>
            </div>
        </div>

        <div className="listing-results">
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Fetching best stays in {lastSearchedDestination || "the area"}...</p>
            </div>
          )}

          {!loading && searchAttempted && results.length > 0 && (
            <>
              <h2 className="results-header">
                {results.length} Hotels found for "{lastSearchedDestination}"
              </h2>
              <div className="hotel-cards-grid">
                {results.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            </>
          )}

          {!loading && searchAttempted && results.length === 0 && (
            <div className="no-results-state">
                <h2>No Hotels Found</h2>
                <p>Try searching for "Mumbai", "Goa", or "Jaipur" for sample results.</p>
            </div>
          )}

          {!loading && !searchAttempted && (
            <div className="initial-state">
                <h2>Ready to explore?</h2>
                <p>Enter a destination and click search to find your perfect stay.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Hotels;