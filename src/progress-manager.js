import { readFile, writeFile } from 'node:fs/promises';

const progressFile = new URL('../data/progress.json', import.meta.url);

// Read progress data
export async function getProgress() {
    try {
        const data = await readFile(progressFile, 'utf8');
        return JSON.parse(data);

    } catch (error) {
        throw new Error(`Failed to read progress: ${error.message}`);
    }
}

// Save progress data
async function saveProgress(progress) {
    try {
        await writeFile(
            progressFile,
            JSON.stringify(progress, null, 4),
            'utf8'
        );

    } catch (error) {
        throw new Error(`Failed to save progress: ${error.message}`);
    }
}

// Update current lesson
export async function updateCurrentLesson(unit, lesson) {
    const progress = await getProgress();

    progress.currentUnit = unit;
    progress.currentLesson = lesson;
    progress.lastUpdated = new Date().toISOString();

    await saveProgress(progress);

    return progress;
}

// Complete a lesson
export async function completeLesson(unit, lesson) {
    const progress = await getProgress();

    const alreadyCompleted = progress.completedLessons.some(
        item => item.unit === unit && item.lesson === lesson
    );

    if (!alreadyCompleted) {
        progress.completedLessons.push({
            unit,
            lesson,
            completedAt: new Date().toISOString()
        });
    }

    progress.lastUpdated = new Date().toISOString();

    await saveProgress(progress);

    return progress;
}

// Reset progress
export async function resetProgress() {
    const progress = {
        currentUnit: 0,
        currentLesson: 0,
        completedLessons: [],
        lastUpdated: new Date().toISOString()
    };

    await saveProgress(progress);

    return progress;
}