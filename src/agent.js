import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import { readFile } from 'node:fs/promises';

// Configuration
const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

// Validate API Key
if (!apiKey) {
    console.error('Error: GEMINI_API_KEY is missing.');
    process.exit(1);
}

// Initialize Gemini
const ai = new GoogleGenAI({
    apiKey: apiKey
});

// Load AI Tutor Instructions
async function loadInstructions() {
    try {
        const instructions = await readFile(
            new URL('../instructions/master-prompt.md', import.meta.url),
            'utf8'
        );

        return instructions;

    } catch (error) {
        throw new Error(`Failed to load instructions: ${error.message}`);
    }
}

// Main Function
async function main() {
    try {
        console.log('Loading AI Tutor Instructions...');

        const systemInstructions = await loadInstructions();

        console.log('Instructions loaded successfully.');
        console.log('Connecting to Gemini...\n');

        const response = await ai.models.generateContent({
            model: model,

            config: {
                systemInstruction: systemInstructions
            },

            contents: 'عرّف بنفسك للطالب، واشرح له كيف ستقوم بتعليمه JavaScript وفق القواعد التعليمية المحددة لك.'
        });

        console.log('AI Tutor Response:\n');
        console.log(response.text);

        console.log('\n----------------------------');
        console.log('Model used:', model);
        console.log('Instructions applied: YES');
        console.log('Connection successful!');

    } catch (error) {
        console.error('\nAI Tutor Error:');
        console.error(error.message);

        process.exitCode = 1;
    }
}

main();