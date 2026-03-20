// modules/ai-api.js

// 1. Paste your NEW API key exactly between these quotes.
const API_KEY = "YOUR_API_KEY_HERE"; 

// 2. Do not change this URL line. It must look exactly like this.
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

export async function askGemini(prompt) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        
        const data = await response.json();

        // 3. THE FIX: Check if Google sent back an error!
        if (data.error) {
            console.error("Google API Rejected the Request:", data.error.message);
            return `**Google API Error:** ${data.error.message} \n\n*(Did you copy the API key correctly?)*`;
        }

        // If no error, return the AI's answer
        return data.candidates[0].content.parts[0].text;

    } catch (error) {
        console.error("System Crash:", error);
        return "Critical Error: Could not parse the AI data. Check the console.";
    }
}



