import {
    getProfile,
    updateGoals,
    addStrength,
    addWeakness,
    updatePreferences
} from './src/profile-manager.js';

// 1. Read current profile
console.log('Initial Profile:');
console.log(await getProfile());

// 2. Update learning goals
console.log('\nUpdating Learning Goals...');
await updateGoals([
    'Learn JavaScript',
    'Understand React Native',
    'Build mobile applications'
]);

// 3. Add strengths
console.log('\nAdding Strengths...');
await addStrength('Good problem-solving skills');

// 4. Add weaknesses
console.log('\nAdding Weaknesses...');
await addWeakness('Needs more practice with JavaScript functions');

// 5. Update preferences
console.log('\nUpdating Preferences...');
await updatePreferences({
    teachingStyle: 'practical'
});

// 6. Read updated profile
console.log('\nUpdated Profile:');
console.log(await getProfile());