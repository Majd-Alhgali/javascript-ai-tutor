import 'dotenv/config';
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { readFile } from 'node:fs/promises';

// Configuration
const app = express();
const PORT = process.env.PORT || 3000;

const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL;

// Validate API Key
if (!apiKey) {
    console.error('Error: GEMINI_API_KEY is missing.');
    process.exit(1);
}

// Initialize Gemini
const ai = new GoogleGenAI({
    apiKey
});

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Load Tutor Instructions
const instructions = await readFile(
    new URL('./instructions/master-prompt.md', import.meta.url),
    'utf8'
);

// Create Gemini Chat
const chat = ai.chats.create({
    model,
    config: {
        systemInstruction: instructions
    }
});

// Health Check Route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        model,
        tutor: 'JavaScript AI Tutor'
    });
});

// Chat Route
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== 'string' || !message.trim()) {
            return res.status(400).json({
                error: 'Message cannot be empty.'
            });
        }

        const response = await chat.sendMessage({
            message: message.trim()
        });

        res.json({
            reply: response.text
        });

    } catch (error) {
        console.error('Gemini Error:', error.message);

        res.status(500).json({
            error: 'Failed to generate a response. Please try again.'
        });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`JavaScript AI Tutor running at http://localhost:${PORT}`);
    console.log(`Gemini Model: ${model}`);
});