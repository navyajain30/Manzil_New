import React, { useState, useEffect, useRef, useMemo } from "react";
import "./Flights.css";

// --- SVG ICONS ---
const IconPrice = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);
const IconFastest = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);
const IconTime = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);
const IconClose = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
const IconBaggage = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 20h0a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h0"></path>
    <path d="M8 18V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14"></path>
    <path d="M10 6h4"></path>
  </svg>
);
const IconAircraft = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.34 9.34L13.66 2.66a2 2 0 0 0-2.83 0L8.66 4.83"></path>
    <path d="m2.26 15.17 3.51 3.51A2 2 0 0 0 7.19 19l4.42-4.42"></path>
    <path d="m11.61 13.41 4.42-4.42"></path>
    <path d="m3.69 13.68 1.8-1.79"></path>
    <path d="m7.19 10.17 1.8-1.8"></path>
    <path d="M21.74 15.74 18 12.01"></path>
    <path d="m17 8.01 3.73-3.73"></path>
    <path d="M14.23 1.75c-2.42 2.41-6.68 6.67-6.68 6.67s4.26 4.26 6.67 6.67"></path>
  </svg>
);
const IconFilter = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

// --- STATIC DATA (for Autocomplete/Filters) ---
const airportData = [
  { code: "DEL", city: "New Delhi", name: "Indira Gandhi International Airport" },
  { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Intl Airport" },
  { code: "BLR", city: "Bangalore", name: "Kempegowda International Airport" },
  { code: "MAA", city: "Chennai", name: "Chennai International Airport" },
  { code: "CCU", city: "Kolkata", name: "Netaji Subhas Chandra Bose Intl Airport" },
];
const airlines = [
  { code: "AI", name: "Air India" },
  { code: "6E", name: "IndiGo" },
  { code: "SG", name: "SpiceJet" },
  { code: "UK", name: "Vistara" },
];

// --- HELPER FUNCTIONS ---
const getAirlineLogo = (carrierCode) => {
  const colors = {
    AI: "FF0000/FFFFFF",
    "6E": "0000FF/FFFFFF",
    SG: "FFA500/000000",
    UK: "800080/FFFFFF",
  };
  const color = colors[carrierCode] || "888888/FFFFFF";
  return `https://placehold.co/80x40/${color}?text=${carrierCode}&font=roboto`;
};
const formatTime = (dateTimeString) => {
  if (!dateTimeString) return "N/A";
  return new Date(dateTimeString).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};
const formatDuration = (durationMinutes) => {
  if (isNaN(durationMinutes)) return "";
  const hours = Math.floor(durationMinutes / 60);
  const minutes = Math.round(durationMinutes % 60);
  return `${hours}h ${minutes}m`;
};
const formatPrice = (price) => {
  if (price === null || isNaN(price)) return "N/A";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};
const getDepartureTimeOfDay = (dateTimeString) => {
  const hour = new Date(dateTimeString).getHours();
  if (hour < 6) return "night";
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
};

// *** API DATA MAPPING ***
// This function converts the Amadeus API response (which you get from
// your server) into the format your UI components need.
const mapApiResponseToFlightModel = (apiFlight) => {
  const itinerary = (apiFlight.itineraries && apiFlight.itineraries[0]) || {};
  const segments = itinerary.segments || [];
  const firstSegment = segments[0] || {};
  const lastSegment = segments[segments.length - 1] || firstSegment;

  const carrierCode =
    (firstSegment.operating && firstSegment.operating.carrierCode) ||
    firstSegment.carrierCode ||
    "N/A";
  const flightNumber = firstSegment.number || firstSegment.flightNumber || "N/A";
  const departure =
    (firstSegment.departure && firstSegment.departure.iataCode) || "N/A";
  const arrival =
    (lastSegment.arrival && lastSegment.arrival.iataCode) || "N/A";
  const depTime = (firstSegment.departure && firstSegment.departure.at) || null;
  const arrTime = (lastSegment.arrival && lastSegment.arrival.at) || null;

  let durationMinutes = 0;
  if (itinerary.duration) {
    // Parse ISO duration string like "PT2H30M"
    const m = itinerary.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (m) {
      const h = Number(m[1] || 0);
      const mm = Number(m[2] || 0);
      durationMinutes = h * 60 + mm;
    }
  } else if (depTime && arrTime) {
    // Fallback calculation
    durationMinutes = Math.round(
      (new Date(arrTime) - new Date(depTime)) / 60000
    );
  }

  const priceObj = apiFlight.price || {};
  const priceValue = Number(priceObj.total) || 0;
  const currency = priceObj.currency || "INR";

  const numberOfStops = Math.max(0, segments.length - 1);
  const layovers = segments.slice(0, -1).map((s) => ({
    code: s.arrival && s.arrival.iataCode,
    duration: s.duration || null, // You might need to parse this too
  }));

  const fareDetails =
    (apiFlight.travelerPricings && apiFlight.travelerPricings[0]) || {};
  const baggage =
    fareDetails.fareDetailsBySegment &&
    fareDetails.fareDetailsBySegment[0] &&
    fareDetails.fareDetailsBySegment[0].includedCheckedBags &&
    fareDetails.fareDetailsBySegment[0].includedCheckedBags.quantity
      ? `${fareDetails.fareDetailsBySegment[0].includedCheckedBags.quantity} piece(s)`
      : "Info unavailable";

  // This is a placeholder. Real refund info is complex.
  const refundInfo = false; 

  const flightModel = {
    id: apiFlight.id || `${carrierCode}_${flightNumber}_${depTime || Math.random()}`,
    carrierCode,
    flightNumber,
    departure,
    arrival,
    depTime,
    arrTime,
    durationMinutes,
    numberOfStops,
    layovers,
    priceValue,
    oldPrice: Math.round(priceValue * 1.15), // Mocking old price
    priceCurrency: currency,
    tags: [], // Tags will be added by SmartPicks logic
    status: "On Time", // Amadeus shopping doesn't provide real-time status
    refundable: refundInfo,
    details: {
      baggage,
      aircraft:
        (firstSegment.aircraft &&
          (firstSegment.aircraft.code || firstSegment.aircraft)) ||
        "Info unavailable",
      cancellation: "See carrier policy", // Placeholder
      fareBreakup: {
        base: Number(priceObj.base) || Math.round(priceValue * 0.7),
        taxes: Number(priceObj.taxes) || Math.round(priceValue * 0.2),
        fee: Number(priceObj.fees) || Math.round(priceValue * 0.1),
      },
    },
  };

  return flightModel;
};

// --- HELPER COMPONENTS (Unchanged) ---

/**
 * Part 4: Filter Sidebar Component
 */
const FilterSidebar = ({ filters, onFilterChange, isVisible }) => {
  const handleStopChange = (stop) => {
    const newStops = filters.stops.includes(stop)
      ? filters.stops.filter((s) => s !== stop)
      : [...filters.stops, stop];
    onFilterChange({ ...filters, stops: newStops });
  };
  const handleAirlineChange = (code) => {
    const newAirlines = filters.airlines.includes(code)
      ? filters.airlines.filter((a) => a !== code)
      : [...filters.airlines, code];
    onFilterChange({ ...filters, airlines: newAirlines });
  };
  const handleTimeChange = (time) => {
    const newTimes = filters.departureTimes.includes(time)
      ? filters.departureTimes.filter((t) => t !== time)
      : [...filters.departureTimes, time];
    onFilterChange({ ...filters, departureTimes: newTimes });
  };
  const handlePriceChange = (e) => {
    onFilterChange({ ...filters, maxPrice: Number(e.target.value) });
  };
  const handleRefundableChange = (e) => {
    onFilterChange({ ...filters, refundable: e.target.checked });
  };
  return (
    <aside className={`filter-sidebar ${isVisible ? "visible" : ""}`}>
      <h3 className="filter-title">Filters</h3>
      <div className="filter-section">
        <h4>Price</h4>
        <label htmlFor="price-slider" className="price-label">
          Max: {formatPrice(filters.maxPrice)}
        </label>
        <input
          type="range"
          id="price-slider"
          min="3000"
          max="15000"
          value={filters.maxPrice}
          onChange={handlePriceChange}
          step="100"
        />
      </div>
      <div className="filter-section">
        <h4>Stops</h4>
        {[
          [0, "Non-stop"],
          [1, "1 Stop"],
        ].map(([stop, label]) => (
          <label key={stop} className="filter-checkbox">
            <input
              type="checkbox"
              checked={filters.stops.includes(stop)}
              onChange={() => handleStopChange(stop)}
            />
            {label}
          </label>
        ))}
      </div>
      <div className="filter-section">
        <h4>Departure Time</h4>
        {[
          ["morning", "Morning (6am-12pm)"],
          ["afternoon", "Afternoon (12pm-6pm)"],
          ["evening", "Evening (6pm-12am)"],
        ].map(([time, label]) => (
          <label key={time} className="filter-checkbox">
            <input
              type="checkbox"
              checked={filters.departureTimes.includes(time)}
              onChange={() => handleTimeChange(time)}
            />
            {label}
          </label>
        ))}
      </div>
      <div className="filter-section">
        <h4>Airlines</h4>
        {airlines.map((airline) => (
          <label key={airline.code} className="filter-checkbox">
            <input
              type="checkbox"
              checked={filters.airlines.includes(airline.code)}
              onChange={() => handleAirlineChange(airline.code)}
            />
            {airline.name}
          </label>
        ))}
      </div>
      <div className="filter-section">
        <h4>Fare Type</h4>
        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={filters.refundable}
            onChange={handleRefundableChange}
          />
          Refundable
        </label>
      </div>
    </aside>
  );
};

/**
 * Part 6: Smart Recommendations Component
 */
const SmartPicks = ({ picks, onPickClick }) => {
  if (!picks.cheapest) return null;
  return (
    <div className="smart-picks-container">
      <h3>Smart Picks</h3>
      <div className="smart-picks-grid">
        <div
          className="smart-pick-card"
          onClick={() => onPickClick(picks.cheapest.id)}
        >
          <span>Cheapest</span>
          <strong>{formatPrice(picks.cheapest.priceValue)}</strong>
        </div>
        <div
          className="smart-pick-card"
          onClick={() => onPickClick(picks.fastest.id)}
        >
          <span>Fastest</span>
          <strong>{formatDuration(picks.fastest.durationMinutes)}</strong>
        </div>
        <div
          className="smart-pick-card"
          onClick={() => onPickClick(picks.bestValue.id)}
        >
          <span>Best Value</span>
          <strong>{formatPrice(picks.bestValue.priceValue)}</strong>
        </div>
      </div>
    </div>
  );
};

/**
 * Part 2 & 7: Upgraded Flight Card Component
 */
const FlightCard = ({ flight, isRecommended, onPriceClick }) => {
  const [showDetails, setShowDetails] = useState(false);
  const statusClass =
    flight.status === "On Time"
      ? "status-on-time"
      : flight.status === "Delayed"
      ? "status-delayed"
      : "status-moderate";

  return (
    <div
      className={`flight-result-card ${
        isRecommended ? "recommended-glow" : ""
      }`}
      data-id={flight.id}
    >
      {flight.tags.map((tag) => (
        <div key={tag} className={`badge badge-${tag.replace(" ", "-").toLowerCase()}`}>
          {tag}
        </div>
      ))}
      <div className="card-main-content">
        <div className="card-col-airline">
          <div className="airline-logo">
            <img
              src={getAirlineLogo(flight.carrierCode)}
              alt={flight.carrierCode}
            />
          </div>
          <div className="airline-name">
            {flight.carrierCode}-{flight.flightNumber}
          </div>
          <div className={`airline-status ${statusClass}`}>{flight.status}</div>
        </div>
        <div className="card-col-timing">
          <div className="time-location">
            <div className="time">{formatTime(flight.depTime)}</div>
            <div className="location">{flight.departure}</div>
          </div>
          <div className="duration-stops">
            <div className="duration">
              {formatDuration(flight.durationMinutes)}
            </div>
            <div className="timeline-bar">
              <span className="timeline-dot"></span>
              {flight.numberOfStops > 0 && <span className="timeline-dot stop"></span>}
              <span className="timeline-line"></span>
              <span className="timeline-dot"></span>
            </div>
            <div className="stops">
              {flight.numberOfStops === 0
                ? "Non-stop"
                : `${flight.numberOfStops} Stop${flight.numberOfStops > 1 ? 's' : ''} ${
                    flight.layovers.length > 0 ? `via ${flight.layovers[0].code}` : ''
                  }`}
            </div>
          </div>
          <div className="time-location">
            <div className="time">{formatTime(flight.arrTime)}</div>
            <div className="location">{flight.arrival}</div>
          </div>
        </div>
        <div className="card-col-price">
          <button
            className="price-button"
            onClick={() => onPriceClick(flight)}
          >
            <div className="price">{formatPrice(flight.priceValue)}</div>
            <div className="old-price">{formatPrice(flight.oldPrice)}</div>
          </button>
          <button className="book-btn">Book Now</button>
        </div>
      </div>
      <div className="card-details-toggle">
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "Hide Details" : "Show Details"}
        </button>
      </div>
      {showDetails && (
        <div className="card-details-content">
          <div className="detail-item">
            <IconBaggage />
            <span>{flight.details.baggage}</span>
          </div>
          <div className="detail-item">
            <IconAircraft />
            <span>{flight.details.aircraft}</span>
          </div>
          <div className="detail-item">
            <span>{flight.refundable ? "Refundable" : "Non-Refundable"}</span>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Part 5: Fare Breakup Modal
 */
const FareBreakupModal = ({ flight, onClose }) => {
  if (!flight) return null;
  const { base, taxes, fee } = flight.details.fareBreakup;
  const total = base + taxes + fee;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Fare Breakup</h3>
          <button onClick={onClose} className="modal-close-btn">
            <IconClose />
          </button>
        </div>
        <div className="modal-body">
          <div className="fare-airline">
            {flight.carrierCode}-{flight.flightNumber} | {flight.departure}
            &rarr; {flight.arrival}
          </div>
          <table className="fare-table">
            <tbody>
              <tr>
                <td>Base Fare</td>
                <td>{formatPrice(base)}</td>
              </tr>
              <tr>
                <td>Surcharges & Taxes</td>
                <td>{formatPrice(taxes)}</td>
              </tr>
              <tr>
                <td>Convenience Fee</td>
                <td>{formatPrice(fee)}</td>
              </tr>
              <tr className="fare-total">
                <td>Total</td>
                <td>{formatPrice(total)}</td>
              </tr>
            </tbody>
          </table>
          <div className="fare-rules">
            <h4>Cancellation</h4>
            <p>{flight.details.cancellation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN FLIGHTS COMPONENT ---
const Flights = () => {
  // --- Form State ---
  // *** FIX #7: Set to "" instead of "DEL" / "BOM" ***
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  // --- End Fix #7 ---
  const [departureDate, setDepartureDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [returnDate, setReturnDate] = useState("");
  const [tripType, setTripType] = useState("oneWay");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [travelClass, setTravelClass] = useState("Economy");
  const [showTravellerPopup, setShowTravellerPopup] = useState(false);

  // --- Autocomplete State ---
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  // --- Results State ---
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [sortBy, setSortBy] = useState("price");
  const [recommendedPick, setRecommendedPick] = useState(null); // For glow

  // --- Part 4: Filter State ---
  const [showFilters, setShowFilters] = useState(true); // Default to true on desktop
  const [filters, setFilters] = useState({
    stops: [],
    airlines: [],
    departureTimes: [],
    maxPrice: 15000,
    refundable: false,
  });

  // --- Part 5: Modal State ---
  const [showFareBreakup, setShowFareBreakup] = useState(false);
  const [selectedFlightForModal, setSelectedFlightForModal] = useState(null);

  // --- Refs ---
  const travellerPopupRef = useRef(null);
  const originInputRef = useRef(null);
  const destInputRef = useRef(null);

  // --- Click outside handler ---
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        travellerPopupRef.current &&
        !travellerPopupRef.current.contains(event.target) &&
        !event.target.closest(".traveller-selector")
      ) {
        setShowTravellerPopup(false);
      }
      if (
        originInputRef.current &&
        !originInputRef.current.closest(".form-group-from").contains(event.target)
      ) {
        setShowOriginSuggestions(false);
      }
      if (
        destInputRef.current &&
        !destInputRef.current.closest(".form-group-to").contains(event.target)
      ) {
        setShowDestSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Effect to manage filter visibility on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setShowFilters(true);
      } else {
        setShowFilters(false);
      }
    };
    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Autocomplete Handlers ---
  const handleOriginChange = (e) => {
    const value = e.target.value;
    setOrigin(value);
    if (value.length > 0) {
      const filtered = airportData.filter(
        (airport) =>
          airport.code.toLowerCase().startsWith(value.toLowerCase()) ||
          airport.city.toLowerCase().startsWith(value.toLowerCase())
      );
      setOriginSuggestions(filtered);
      setShowOriginSuggestions(true);
    } else {
      setOriginSuggestions([]);
      setShowOriginSuggestions(false);
    }
  };
  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestination(value);
    if (value.length > 0) {
      const filtered = airportData.filter(
        (airport) =>
          airport.code.toLowerCase().startsWith(value.toLowerCase()) ||
          airport.city.toLowerCase().startsWith(value.toLowerCase())
      );
      setDestinationSuggestions(filtered);
      setShowDestSuggestions(true);
    } else {
      setDestinationSuggestions([]);
      setShowDestSuggestions(false);
    }
  };
  const onOriginSuggestionClick = (airport) => {
    setOrigin(airport.code);
    setOriginSuggestions([]);
    setShowOriginSuggestions(false);
  };
  const onDestSuggestionClick = (airport) => {
    setDestination(airport.code);
    setDestinationSuggestions([]);
    setShowDestSuggestions(false);
  };
  const handleSwapDestinations = () => {
    const tempOrigin = origin;
    setOrigin(destination);
    setDestination(tempOrigin);
  };

  // *** FIX #1 & #2: API CALL LOGIC ***
  // This function now calls YOUR server at localhost:5000
  // and sends the correct parameter names.
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSearchResults([]);
    setRecommendedPick(null);

    // 1. Construct API URL to call YOUR server
    const API_BASE = "http://localhost:5000"; // Your server
    
    // *** FIX: Use param names your server expects ***
    const params = new URLSearchParams({
      originLocationCode: origin.toUpperCase(),
      destinationLocationCode: destination.toUpperCase(),
      departureDate: departureDate,
      adults: adults.toString(),
      // *** FIX: Send travelClass in Amadeus format ***
      travelClass: travelClass.toUpperCase().replace(" ", "_"), // e.g., "ECONOMY" or "PREMIUM_ECONOMY"
      currencyCode: "INR",
    });

    // Add optional params
    if (children > 0) {
      params.set("children", children.toString());
    }
    if (infants > 0) {
      params.set("infants", infants.toString());
    }
    
    if (tripType === "roundTrip" && returnDate) {
      params.set("returnDate", returnDate);
    }

    const url = `${API_BASE}/api/flights?${params.toString()}`;

    try {
      if (!origin || !destination || !departureDate) {
        throw new Error("Please fill From, To and Departure date.");
      }

      // 2. Call your server
      console.log(`Calling server at: ${url}`); // For debugging
      const res = await fetch(url);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({})); // Try to get error msg from server
        // The screenshot shows the server returning the raw Amadeus error,
        // which often has a structure like { errors: [{ title: "..." }] }
        const amadeusError = errorData.errors?.[0]?.title || errorData.message;
        console.error("Server returned an error:", amadeusError || res.status);
        // *** FIX: Show the specific error from the server ***
        throw new Error(amadeusError || `Server error: ${res.status}`);
      }

      const apiResponse = await res.json();
      console.log("Got response from server:", apiResponse);

      // We assume your server returns the Amadeus data in a { data: [...] } object
      // If your server returns the array directly, just use `apiResponse.data || apiResponse`
      const responseData = apiResponse.data || apiResponse;

      if (!Array.isArray(responseData) || responseData.length === 0) {
        throw new Error("No flight offers found.");
      }

      // 3. Map API data to our UI model
      const formattedResults = responseData.map(mapApiResponseToFlightModel);

      // 4. (UNCHANGED) Apply Smart Picks logic
      let cheapest = formattedResults[0],
        fastest = formattedResults[0],
        bestValue = formattedResults[0];

      formattedResults.forEach((flight) => {
        if (!cheapest || flight.priceValue < cheapest.priceValue) cheapest = flight;
        if (!fastest || flight.durationMinutes < fastest.durationMinutes) fastest = flight;
        if (!bestValue || (flight.priceValue + flight.durationMinutes * 10 < bestValue.priceValue + bestValue.durationMinutes * 10)) {
          bestValue = flight;
        }
      });

      // Add tags
      if (cheapest) cheapest.tags.push("Cheapest");
      if (fastest) fastest.tags.push("Fastest");
      if (bestValue && bestValue.tags.length === 0) {
        bestValue.tags.push("Best Value");
      }
      if (bestValue) setRecommendedPick(bestValue.id); // Set for glow

      // 5. Set state
      setSearchResults(formattedResults);
    } catch (err) {
      console.error("❌ Flights fetch error:", err);
      setErrorMsg(err.message);
      setSearchResults([]); // Ensure results are empty on error
    } finally {
      setLoading(false);
    }
  };

  // *** FIX #7: Removed auto-search on load ***
  // We no longer search on load because the inputs are empty.
  // The user must click "Search" to start.
  // useEffect(() => {
  //   handleSearch();
  // }, []);


  /**
   * Part 4 & 3: Filtering and Sorting Logic
   */
  const filteredAndSortedResults = useMemo(() => {
    let results = [...searchResults];

    // Apply Filters
    results = results.filter((flight) => {
      // Stop filter
      if (
        filters.stops.length > 0 &&
        !filters.stops.includes(flight.numberOfStops)
      ) {
        return false;
      }
      // Airline filter
      if (
        filters.airlines.length > 0 &&
        !filters.airlines.includes(flight.carrierCode)
      ) {
        return false;
      }
      // Price filter
      if (flight.priceValue > filters.maxPrice) {
        return false;
      }
      // Time filter
      if (filters.departureTimes.length > 0) {
        const timeOfDay = getDepartureTimeOfDay(flight.depTime);
        if (!filters.departureTimes.includes(timeOfDay)) {
          return false;
        }
      }
      // Refundable filter
      if (filters.refundable && !flight.refundable) {
        return false;
      }
      return true;
    });

    // Apply Sorting
    switch (sortBy) {
      case "price":
        results.sort((a, b) => a.priceValue - b.priceValue);
        break;
      case "duration":
        results.sort((a, b) => a.durationMinutes - b.durationMinutes);
        break;
      case "departure":
        results.sort((a, b) => new Date(a.depTime) - new Date(b.depTime));
        break;
      case "arrival":
        results.sort((a, b) => new Date(b.arrTime) - new Date(a.arrTime));
        break;
      default:
        break;
    }
    return results;
  }, [searchResults, filters, sortBy]);

  /**
   * Part 6: Smart Picks Memo
   */
  const smartPicks = useMemo(() => {
    if (filteredAndSortedResults.length === 0) return {};
    
    // Find picks from the *filtered* list
    let cheapest = filteredAndSortedResults[0],
        fastest = filteredAndSortedResults[0],
        bestValue = filteredAndSortedResults[0];

    filteredAndSortedResults.forEach((flight) => {
        if (!cheapest || flight.priceValue < cheapest.priceValue) cheapest = flight;
        if (!fastest || flight.durationMinutes < fastest.durationMinutes) fastest = flight;
        if (!bestValue || (flight.priceValue + flight.durationMinutes * 10 < bestValue.priceValue + bestValue.durationMinutes * 10)) {
          bestValue = flight;
        }
      });

    return {
      cheapest,
      fastest,
      bestValue,
    };
  }, [filteredAndSortedResults]);

  // --- Modal Handlers (Part 5) ---
  const handleShowFareBreakup = (flight) => {
    setSelectedFlightForModal(flight);
    setShowFareBreakup(true);
  };
  const handleCloseFareBreakup = () => {
    setShowFareBreakup(false);
    setSelectedFlightForModal(null);
  };

  // --- Other Handlers ---
  const handlePickClick = (flightId) => {
    setRecommendedPick(flightId);
    // Scroll to the item
    const el = document.querySelector(
      `.flight-result-card[data-id="${flightId}"]`
    );
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  const totalTravellers = adults + children + infants;
  const travellerText = `${totalTravellers} Traveller${
    totalTravellers > 1 ? "s" : ""
  }`;

  // Counter component for popup
  const Counter = ({ label, description, value, onIncrease, onDecrease }) => (
    <div className="traveller-row">
      <div>
        <div className="traveller-label">{label}</div>
        <div className="traveller-desc">{description}</div>
      </div>
      <div className="traveller-counter">
        <button
          type="button"
          onClick={onDecrease}
          disabled={value <= (label === "Adults" ? 1 : 0)}
        >
          -
        </button>
        <span>{value}</span>
        <button
          type="button"
          onClick={onIncrease}
          disabled={value >= 9}
        >
          +
        </button>
      </div>
    </div>
  );

  // --- JSX RENDER ---
  return (
    <>
      <section className="page-section">
        <video autoPlay loop muted playsInline className="video-background">
          <source
            src="https://media.istockphoto.com/id/1329221980/video/couple-enjoying-sightseeing-at-beautiful-landscape.mp4?s=mp4-640x640-is&k=20&c=jvC8vSCNXt6ST-6WGltyiw0CKNdI-hQYJKLXDJ0jKUM="
            type="video/mp4"
          />
        </video>
        <div className="video-overlay"></div>

        {/* --- SEARCH FORM --- */}
        <div className="flight-card-glass">
          <div className="trip-type-selector">
            <button
              className={`trip-type-btn ${
                tripType === "oneWay" ? "active" : ""
              }`}
              onClick={() => setTripType("oneWay")}
            >
              One Way
            </button>
            <button
              className={`trip-type-btn ${
                tripType === "roundTrip" ? "active" : ""
              }`}
              onClick={() => setTripType("roundTrip")}
            >
              Round Trip
            </button>
          </div>

          <form
            onSubmit={handleSearch}
            className={`flight-search-form ${tripType}`}
          >
            <div className="form-group-composite-from-to">
              <div className="form-group form-group-from" ref={originInputRef}>
                <label htmlFor="from">From</label>
                <input
                  type="text"
                  id="from"
                  placeholder="From (e.g. DEL)"
                  value={origin}
                  onChange={handleOriginChange}
                  onFocus={() => setShowOriginSuggestions(true)}
                  autoComplete="off"
                  required
                />
                {showOriginSuggestions && originSuggestions.length > 0 && (
                  <ul className="suggestions-list">
                    {originSuggestions.map((airport) => (
                      <li
                        key={airport.code}
                        onClick={() => onOriginSuggestionClick(airport)}
                      >
                        <strong>{airport.code}</strong> - {airport.city}
                        <span>{airport.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                type="button"
                className="swap-button"
                onClick={handleSwapDestinations}
                title="Swap Origin and Destination"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.44 8.8998C16.63 8.7098 16.63 8.3998 16.44 8.2098L13.25 5.0198C13.06 4.8298 12.74 4.8298 12.55 5.0198C12.36 5.2098 12.36 5.5198 12.55 5.7098L15.34 8.4998L12.55 11.2898C12.36 11.4798 12.36 11.7898 12.55 11.9798C12.74 12.1698 13.06 12.1698 13.25 11.9798L16.44 8.8998Z"
                    fill="#555"
                  />
                  <path
                    d="M15.89 8.9998H4.21C3.93 8.9998 3.71 8.7798 3.71 8.4998C3.71 8.2198 3.93 7.9998 4.21 7.9998H15.89C16.17 7.9998 16.39 8.2198 16.39 8.4998C16.39 8.7798 16.17 8.9998 15.89 8.9998Z"
                    fill="#555"
                  />
                  <path
                    d="M7.56 15.0998C7.37 15.2898 7.37 15.5998 7.56 15.7898L10.75 18.9798C10.94 19.1698 11.26 19.1698 11.45 18.9798C11.64 18.7898 11.64 18.4798 11.45 18.2898L8.66 15.4998L11.45 12.7098C11.64 12.5198 11.64 12.2098 11.45 12.0198C11.26 11.8298 10.94 11.8298 10.75 12.0198L7.56 15.0998Z"
                    fill="#555"
                  />
                  <path
                    d="M8.11 14.9998H19.79C20.07 14.9998 20.29 15.2198 20.29 15.4998C20.29 15.7798 20.07 15.9998 19.79 15.9998H8.11C7.83 15.9998 7.61 15.7798 7.61 15.4998C7.61 15.2198 7.83 14.9998 8.11 14.9998Z"
                    fill="#555"
                  />
                </svg>
              </button>

              <div className="form-group form-group-to" ref={destInputRef}>
                <label htmlFor="to">To</label>
                <input
                  type="text"
                  id="to"
                  placeholder="To (e.g. BOM)"
                  value={destination}
                  onChange={handleDestinationChange}
                  onFocus={() => setShowDestSuggestions(true)}
                  autoComplete="off"
                  required
                />
                {showDestSuggestions &&
                  destinationSuggestions.length > 0 && (
                    <ul className="suggestions-list">
                      {destinationSuggestions.map((airport) => (
                        <li
                          key={airport.code}
                          onClick={() => onDestSuggestionClick(airport)}
                        >
                          <strong>{airport.code}</strong> - {airport.city}
                          <span>{airport.name}</span>
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="departure">Departure</label>
              <input
                type="date"
                id="departure"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group form-group-return">
              <label htmlFor="return">Return</label>
              <input
                type="date"
                id="return"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                min={departureDate || ""}
              />
            </div>

            <div className="form-group">
              <label>Travellers & Class</label>
              <div
                className="traveller-selector"
                onClick={() => setShowTravellerPopup(!showTravellerPopup)}
              >
                <strong>{travellerText}</strong>
                <span>{travelClass}</span>
              </div>

              {showTravellerPopup && (
                <div className="traveller-popup" ref={travellerPopupRef}>
                  <Counter
                    label="Adults"
                    description="12 yrs or above"
                    value={adults}
                    onIncrease={() => setAdults(adults + 1)}
                    onDecrease={() => setAdults(adults - 1)}
                  />
                  <Counter
                    label="Children"
                    description="2 - 12 yrs"
                    value={children}
                    onIncrease={() => setChildren(children + 1)}
                    onDecrease={() => setChildren(children - 1)}
                  />
                  <Counter
                    label="Infants"
                    description="0 - 2 yrs"
                    value={infants}
                    onIncrease={() => setInfants(infants + 1)}
                    onDecrease={() => setInfants(infants - 1)}
                  />
                  <hr className="popup-divider" />
                  <div className="class-selector">
                    {["Economy", "Premium Economy", "Business"].map((cls) => (
                      <button
                        type="button"
                        key={cls}
                        className={`class-btn ${
                          travelClass === cls ? "active" : ""
                        }`}
                        onClick={() => setTravelClass(cls)}
                      >
                        {cls}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="popup-done-btn"
                    onClick={() => setShowTravellerPopup(false)}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>

            <button type="submit" className="search-btn" disabled={loading}>
              {loading ? "..." : "Search"}
            </button>
          </form>
        </div>

        {/* --- MAIN CONTENT AREA: FILTERS + RESULTS --- */}
        <div className="page-content-grid">
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            isVisible={showFilters}
          />

          <main className="results-area">
            <SmartPicks picks={smartPicks} onPickClick={handlePickClick} />

            <div className="sort-bar-container">
              <div className="results-header">
                <h3 className="results-title">
                  Available Flights ({filteredAndSortedResults.length})
                </h3>
                <button
                  className="filter-toggle-btn"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <IconFilter />
                  {showFilters ? "Hide" : "Show"} Filters
                </button>
              </div>
              <div className="sort-bar">
                <button
                  className={`sort-option ${
                    sortBy === "price" ? "active" : ""
                  }`}
                  onClick={() => setSortBy("price")}
                >
                  <IconPrice />
                  Price
                  <span>Low to High</span>
                </button>
                <button
                  className={`sort-option ${
                    sortBy === "duration" ? "active" : ""
                  }`}
                  onClick={() => setSortBy("duration")}
                >
                  <IconFastest />
                  Fastest
                  <span>Shortest First</span>
                </button>
                <button
                  className={`sort-option ${
                    sortBy === "departure" ? "active" : ""
                  }`}
                  onClick={() => setSortBy("departure")}
                >
                  <IconTime />
                  Departure
                  <span>Earliest First</span>
                </button>
                <button
                  className={`sort-option ${
                    sortBy === "arrival" ? "active" : ""
                  }`}
                  onClick={() => setSortBy("arrival")}
                >
                  <IconTime />
                  Arrival
                  <span>Latest First</span>
                </button>
              </div>
            </div>

            {loading && (
              <div className="loading-message">Searching for flights...</div>
            )}
            
            {/* Show error message if there is one */}
            {errorMsg && <div className="error-message">{errorMsg}</div>}

            {/* Show flight results */}
            {!loading && filteredAndSortedResults.length > 0 && (
              <div className="flight-results-list">
                {filteredAndSortedResults.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    isRecommended={flight.id === recommendedPick}
                    onPriceClick={handleShowFareBreakup}
                  />
                ))}
              </div>
            )}
            
            {/* Show "no results" message ONLY if not loading AND no error AND no results from search */}
            {!loading &&
              !errorMsg &&
              searchResults.length > 0 && // This checks if the *original* search had results
              filteredAndSortedResults.length === 0 && ( // This checks if the *filters* cleared them all
                <div className="error-message">
                  No flights match your criteria. Try adjusting your filters.
                </div>
              )}
          </main>
        </div>
      </section>

      {/* --- Part 5: FARE BREAKUP MODAL --- */}
      {showFareBreakup && (
        <FareBreakupModal
          flight={selectedFlightForModal}
          onClose={handleCloseFareBreakup}
        />
      )}
    </>
  );
};

export default Flights;