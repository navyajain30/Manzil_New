
const axios = require('axios');

console.log("Testing Flight Search API...");

async function testFlights() {
    try {
        const url = "http://localhost:5000/api/flights?originLocationCode=DEL&destinationLocationCode=BOM&departureDate=2025-12-25&adults=1";
        console.log("Fetching:", url);
        const response = await axios.get(url);

        console.log("Status:", response.status);
        if (response.data && response.data.data) {
            console.log("Success! Flights found:", response.data.data.length);
            console.log("First Flight Sample:", JSON.stringify(response.data.data[0], null, 2));
        } else {
            console.error("Error Response:", JSON.stringify(response.data, null, 2));
        }

    } catch (error) {
        if (error.response) {
            console.error("Server Error:", error.response.status, error.response.data);
        } else {
            console.error("Network Error:", error.message);
        }
    }
}

testFlights();
