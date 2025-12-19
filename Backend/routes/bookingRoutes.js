// routes/bookingRoutes.js
import express from "express";
import axios from "axios";
import Booking from "../models/Booking.js";

const router = express.Router();

/* ============================================================
   ✈️ FLIGHT SEARCH ROUTE (AVIATIONSTACK)
============================================================ */
router.get("/flights", async (req, res) => {
  try {
    const { originLocationCode, destinationLocationCode, departureDate } = req.query;

    console.log("🟦 Received flight search request:", req.query);

    if (!originLocationCode || !destinationLocationCode) {
      console.log("❌ Missing required query params");
      return res.status(400).json({ error: "Missing required fields" });
    }

    const access_key = process.env.AVIATIONSTACK_API_KEY;
    const url = "http://api.aviationstack.com/v1/flights";

    console.log(`🌍 Requesting Aviationstack for ${originLocationCode} to ${destinationLocationCode}`);

    // Request to Aviationstack (Real-time data)
    // Note: Free tier might not filter by 'flight_date' effectively for future scheduled flights, 
    // so we mostly rely on dep_iata and arr_iata.
    const avResponse = await axios.get(url, {
      params: {
        access_key,
        dep_iata: originLocationCode,
        arr_iata: destinationLocationCode,
        limit: 20 // Limit results
      }
    });

    const aviationData = avResponse.data.data || [];
    console.log(`✅ Aviationstack returned ${aviationData.length} flights`);

    // Only return 'active' or 'scheduled' flights if possible, but for free tier we take what we get.
    // We map each flight to the AMADEUS structure so the Frontend (Flights.js) doesn't break.

    const mappedFlights = aviationData.map((flight, index) => {
      // Mocking times if missing
      const depTime = flight.departure?.scheduled || departureDate + "T10:00:00";
      const arrTime = flight.arrival?.scheduled || departureDate + "T12:00:00";

      // Calculate duration or mock it
      let duration = "PT2H0M"; // default
      try {
        const d = new Date(depTime);
        const a = new Date(arrTime);
        const diffMs = a - d;
        if (diffMs > 0) {
          const hours = Math.floor(diffMs / 3600000);
          const mins = Math.round((diffMs % 3600000) / 60000);
          duration = `PT${hours}H${mins}M`;
        }
      } catch (e) { }

      // MOCK PRICE (Random between 3000 and 15000 INR)
      const mockBase = 3000 + Math.floor(Math.random() * 12000);
      const mockTax = Math.floor(mockBase * 0.18);
      const mockFee = 500;
      const total = mockBase + mockTax + mockFee;

      return {
        id: flight.flight?.iata || `flt_${index}`,
        price: {
          total: total.toString(),
          currency: "INR",
          base: mockBase.toString(),
          taxes: mockTax.toString(),
          fees: mockFee.toString()
        },
        itineraries: [
          {
            duration: duration,
            segments: [
              {
                departure: {
                  iataCode: flight.departure?.iata || originLocationCode,
                  at: depTime
                },
                arrival: {
                  iataCode: flight.arrival?.iata || destinationLocationCode,
                  at: arrTime
                },
                carrierCode: flight.airline?.iata || "XX",
                number: flight.flight?.number || "999",
                aircraft: {
                  code: "320" // Mock aircraft
                },
                operating: {
                  carrierCode: flight.airline?.iata || "XX"
                }
              }
            ]
          }
        ],
        travelerPricings: [
          {
            fareDetailsBySegment: [
              {
                includedCheckedBags: {
                  quantity: 1
                }
              }
            ]
          }
        ]
      };
    });

    // Aviationstack free tier can return mixed results (landed, cancelled, etc.)
    // We filter slightly to ensure we have vaguely valid data
    const validFlights = mappedFlights.filter(f => f.itineraries[0].segments[0].departure.iataCode);

    if (validFlights.length === 0) {
      // Fallback Mock if API returns nothing (common in free tier for specific routes)
      console.log("⚠️ No live flights found, returning mock data for demo.");
      const mockFlight = {
        id: "mock_1",
        price: { total: "5500", currency: "INR", base: "4500", taxes: "800", fees: "200" },
        itineraries: [
          {
            duration: "PT2H30M",
            segments: [
              {
                departure: { iataCode: originLocationCode, at: `${departureDate}T06:00:00` },
                arrival: { iataCode: destinationLocationCode, at: `${departureDate}T08:30:00` },
                carrierCode: "6E",
                number: "101",
                aircraft: { code: "320" }
              }
            ]
          }
        ],
        travelerPricings: [{ fareDetailsBySegment: [{ includedCheckedBags: { quantity: 15 } }] }]
      };
      return res.json({ data: [mockFlight] });
    }

    res.json({ data: validFlights });

  } catch (err) {
    console.error("❌ Aviationstack API Error:", err.message);
    res.status(500).json({ error: "Failed to fetch flight offers." });
  }
});

/* ============================================================
   🛫 BOOK FLIGHT (SAVE TO MONGODB)
============================================================ */
router.post("/book-flight", async (req, res) => {
  try {
    console.log("🛫 Booking request received:", req.body);
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(201).json({ message: "Flight booked successfully!" });
  } catch (err) {
    console.error("❌ Booking error:", err);
    res.status(500).json({ error: "Failed to book flight" });
  }
});

/* ============================================================
   🧾 GET ALL BOOKINGS
============================================================ */
router.get("/bookings", async (req, res) => {
  try {
    const allBookings = await Booking.find();
    res.json(allBookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

export default router;