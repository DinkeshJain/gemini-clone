import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

// Access the API key from the environment variable
const API_KEY = process.env.API_KEY;

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
        history: [
            // You can include previous chat history here
        ],
    });

    const result = await chatSession.sendMessage(prompt);
    const response = result.response;
    console.log(await response.text());
    return response.text();
}

export default run;
