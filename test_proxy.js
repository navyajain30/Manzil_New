
const axios = require('axios');

console.log("Testing Backend Proxy with Axios...");

async function testProxy() {
    try {
        const response = await axios.post("http://localhost:5000/api/gemini/proxy", {
            model: "llama3-8b-8192",
            messages: [{ role: "user", content: "Hello" }]
        }, {
            headers: { "Content-Type": "application/json" }
        });

        console.log("Status:", response.status);
        console.log("Success! Reply:", response.data.choices?.[0]?.message?.content);

    } catch (error) {
        if (error.response) {
            console.error("Server Error:", error.response.status, error.response.data);
        } else {
            console.error("Network Error:", error.message);
        }
    }
}

testProxy();
