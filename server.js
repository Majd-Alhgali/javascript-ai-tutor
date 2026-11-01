import 'dotenv/config';
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { readFile } from 'node:fs/promises';
import {
    getProgress,
    updateCurrentLesson,
    completeLesson
} from './src/progress-manager.js';
import {
    getProfile,
    updateGoals,
    addStrength,
    addWeakness,
    updatePreferences
} from './src/profile-manager.js';

import {
    getHistory,
    recordActivity
} from './src/history-manager.js';

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

// Get Student Progress
app.get('/api/progress', async (req, res) => {
    try {
        const progress = await getProgress();

        res.json(progress);

    } catch (error) {
        console.error('Progress Error:', error.message);

        res.status(500).json({
            error: 'Failed to retrieve student progress.'
        });
    }
});

// Get Student Profile
app.get('/api/profile', async (req, res) => {
    try {
        const profile = await getProfile();

        res.json(profile);

    } catch (error) {
        console.error('Profile Error:', error.message);

        res.status(500).json({
            error: 'Failed to retrieve student profile.'
        });
    }
});

// Update Student Learning Goals
app.put('/api/profile/goals', async (req, res) => {
    try {
        const { goals } = req.body;

        if (
            !Array.isArray(goals) ||
            !goals.every(goal =>
                typeof goal === 'string' && goal.trim().length > 0
            )
        ) {
            return res.status(400).json({
                error: 'Goals must be an array of non-empty strings.'
            });
        }

        const profile = await updateGoals(
            goals.map(goal => goal.trim())
        );

        res.json({
            success: true,
            profile
        });

    } catch (error) {
        console.error('Profile Update Error:', error.message);

        res.status(500).json({
            error: 'Failed to update learning goals.'
        });
    }
});

// Add Student Strength
app.post('/api/profile/strengths', async (req, res) => {
    try {
        const { strength } = req.body;

        if (
            typeof strength !== 'string' ||
            !strength.trim()
        ) {
            return res.status(400).json({
                error: 'Strength must be a non-empty string.'
            });
        }

        const profile = await addStrength(strength.trim());

        res.json({
            success: true,
            profile
        });

    } catch (error) {
        console.error('Strength Update Error:', error.message);

        res.status(500).json({
            error: 'Failed to update student strengths.'
        });
    }
});

// Add Student Weakness
app.post('/api/profile/weaknesses', async (req, res) => {
    try {
        const { weakness } = req.body;

        if (
            typeof weakness !== 'string' ||
            !weakness.trim()
        ) {
            return res.status(400).json({
                error: 'Weakness must be a non-empty string.'
            });
        }

        const profile = await addWeakness(weakness.trim());

        res.json({
            success: true,
            profile
        });

    } catch (error) {
        console.error('Weakness Update Error:', error.message);

        res.status(500).json({
            error: 'Failed to update student weaknesses.'
        });
    }
});

// Update Student Learning Preferences
app.put('/api/profile/preferences', async (req, res) => {
    try {
        const { preferences } = req.body;

        if (
            !preferences ||
            typeof preferences !== 'object' ||
            Array.isArray(preferences)
        ) {
            return res.status(400).json({
                error: 'Preferences must be a valid object.'
            });
        }

        const profile = await updatePreferences(preferences);

        res.json({
            success: true,
            profile
        });

    } catch (error) {
        console.error('Preferences Update Error:', error.message);

        res.status(500).json({
            error: 'Failed to update learning preferences.'
        });
    }
});

// Get Learning History
app.get('/api/history', async (req, res) => {
    try {
        const history = await getHistory();

        res.json(history);

    } catch (error) {
        console.error('History Error:', error.message);

        res.status(500).json({
            error: 'Failed to retrieve learning history.'
        });
    }
});

// Update Student Progress
app.post('/api/progress/lesson', async (req, res) => {
    try {
        const { unit, lesson, action } = req.body;

        if (
            !Number.isInteger(unit) || unit < 0 ||
            !Number.isInteger(lesson) || lesson < 0
        ) {
            return res.status(400).json({
                error: 'Unit and lesson must be non-negative integers.'
            });
        }

        let progress;

        if (action === 'complete') {
            progress = await completeLesson(unit, lesson);

    await recordActivity({
        type: 'lesson_completed',
        unit,
        lesson,
        details: {
            message: 'Lesson completed successfully.'
        }
    });
        } else if (action === 'update') {
            progress = await updateCurrentLesson(unit, lesson);
        } else {
            return res.status(400).json({
                error: 'Action must be "complete" or "update".'
            });
        }

        res.json({
            success: true,
            progress
        });

    } catch (error) {
        console.error('Progress Update Error:', error.message);

        res.status(500).json({
            error: 'Failed to update student progress.'
        });
    }
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