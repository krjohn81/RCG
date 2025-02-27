const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Generate AI Cat Image
async function generateCatImage() {
    const response = await axios.post(
        "https://api.openai.com/v1/images/generations",
        {
            model: "dall-e-3",
            prompt: "A cute, unique cat portrait, highly detailed",
            size: "512x512",
        },
        { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } }
    );
    return response.data.data[0].url;
}

// Generate AI Cat Biography
async function generateCatBio() {
    const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
            model: "gpt-4",
            messages: [{ role: "system", content: "Write a fun cat biography." }],
        },
        { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } }
    );
    return response.data.choices[0].message.content;
}

// API Route to Generate Cat
app.get("/generate-cat", async (req, res) => {
    try {
        const image = await generateCatImage();
        const bio = await generateCatBio();
        res.json({ image, bio });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error generating cat" });
    }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
