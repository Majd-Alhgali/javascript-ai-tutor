import {
    getHistory,
    recordActivity,
    getLessonHistory
} from './src/history-manager.js';

// 1. Read current history
console.log('Initial History:');
console.log(await getHistory());

// 2. Record a completed lesson
console.log('\nRecording Lesson...');
await recordActivity({
    type: 'lesson_completed',
    unit: 0,
    lesson: 1,
    details: {
        title: 'What Is JavaScript?',
        status: 'completed'
    }
});

// 3. Record a quiz
console.log('\nRecording Quiz...');
await recordActivity({
    type: 'quiz_completed',
    unit: 0,
    lesson: 1,
    details: {
        score: 8,
        totalQuestions: 10
    }
});

// 4. Get history for a specific lesson
console.log('\nLesson History:');
console.log(await getLessonHistory(0, 1));

// 5. Read all activities
console.log('\nComplete Learning History:');
console.log(await getHistory());