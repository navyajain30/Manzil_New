
import fetch from "node-fetch";

console.log("Testing Backend Proxy...");

async function testProxy() {
    try {
        const response = await fetch("http://localhost:5000/api/gemini/proxy", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [{ role: "user", content: "Hello" }]
            })
        });

        const data = await response.json();
        console.log("Status:", response.status);
        if (response.ok) {
            console.log("Success! Reply:", data.choices?.[0]?.message?.content);
        } else {
            console.error("Error:", JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error("Network Error:", error);
    }
}

testProxy();
