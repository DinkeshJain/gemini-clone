import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";
require('dotenv').config();
// Access the API key from the environment variable
const API_KEY = process.env.API_KEY;
console.log("API_KEY:", API_KEY); // Log the API key (only for debugging; consider removing this in production)
if (!API_KEY) {
    throw new Error("API_KEY is missing. Please set it in the environment variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

async function run(prompt) {
    const chatSession = model.startChat({
        generationConfig,
        history: [], // You can include previous chat history here
    });

    try {
        const result = await chatSession.sendMessage(prompt);
        const response = result.response;

        // Log the raw response text
        const responseText = await response.text();
        console.log("Raw response:", responseText);

        // Check if response is OK (add additional checks if needed)
        if (!response.ok) {
            throw new Error(`API Error: ${responseText}`);
        }

        // Try parsing the response as JSON
        try {
            const jsonResponse = JSON.parse(responseText);
            console.log("Parsed response:", jsonResponse);
            return jsonResponse; // Return the parsed JSON response
        } catch (jsonError) {
            console.error("Failed to parse JSON:", jsonError);
            throw new Error("Invalid response format: " + responseText);
        }
    } catch (error) {
        console.error("Error during API call:", error);
        throw error; // Rethrow error for further handling
    }
}

export default run;
