import {
    getProgress,
    updateCurrentLesson,
    completeLesson,
    resetProgress
} from './src/progress-manager.js';

// 1. Read current progress
console.log('Initial Progress:');
console.log(await getProgress());

// 2. Update current lesson
console.log('\nUpdating Current Lesson...');
await updateCurrentLesson(0, 2);

// 3. Complete a lesson
console.log('\nCompleting Lesson...');
await completeLesson(0, 1);

await completeLesson(0, 1);

// 4. Read updated progress
console.log('\nUpdated Progress:');
console.log(await getProgress());