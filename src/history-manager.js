import { readFile, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';

const historyFile = new URL(
    '../data/learning-history.json',
    import.meta.url
);

// Read learning history
export async function getHistory() {
    try {
        const data = await readFile(historyFile, 'utf8');
        return JSON.parse(data);

    } catch (error) {
        throw new Error(`Failed to read learning history: ${error.message}`);
    }
}

// Save learning history
async function saveHistory(history) {
    try {
        await writeFile(
            historyFile,
            JSON.stringify(history, null, 4),
            'utf8'
        );

    } catch (error) {
        throw new Error(`Failed to save learning history: ${error.message}`);
    }
}

// Record a new learning activity
export async function recordActivity({
    type,
    unit,
    lesson,
    details = {}
}) {
    if (!type || typeof type !== 'string') {
        throw new TypeError('Activity type must be a non-empty string.');
    }

    if (!Number.isInteger(unit) || unit < 0) {
        throw new TypeError('Unit must be a non-negative integer.');
    }

    if (!Number.isInteger(lesson) || lesson < 0) {
        throw new TypeError('Lesson must be a non-negative integer.');
    }

    const history = await getHistory();

    const activity = {
        id: randomUUID(),
        type,
        unit,
        lesson,
        details,
        timestamp: new Date().toISOString()
    };

    history.activities.push(activity);

    await saveHistory(history);

    return activity;
}

// Get activities for a specific lesson
export async function getLessonHistory(unit, lesson) {
    const history = await getHistory();

    return history.activities.filter(
        activity => activity.unit === unit &&
                    activity.lesson === lesson
    );
}