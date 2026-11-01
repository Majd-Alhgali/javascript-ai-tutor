import { readFile, writeFile } from 'node:fs/promises';

const profileFile = new URL(
    '../data/student-profile.json',
    import.meta.url
);

// Read student profile
export async function getProfile() {
    try {
        const data = await readFile(profileFile, 'utf8');
        return JSON.parse(data);

    } catch (error) {
        throw new Error(`Failed to read student profile: ${error.message}`);
    }
}

// Save student profile
async function saveProfile(profile) {
    try {
        await writeFile(
            profileFile,
            JSON.stringify(profile, null, 4),
            'utf8'
        );

    } catch (error) {
        throw new Error(`Failed to save student profile: ${error.message}`);
    }
}

// Update learning goals
export async function updateGoals(goals) {
    if (!Array.isArray(goals)) {
        throw new TypeError('Goals must be an array.');
    }

    const profile = await getProfile();

    profile.learningGoals = [...new Set(goals)];

    await saveProfile(profile);

    return profile;
}

// Add a strength
export async function addStrength(strength) {
    const profile = await getProfile();

    if (!profile.strengths.includes(strength)) {
        profile.strengths.push(strength);
    }

    await saveProfile(profile);

    return profile;
}

// Add a weakness
export async function addWeakness(weakness) {
    const profile = await getProfile();

    if (!profile.weaknesses.includes(weakness)) {
        profile.weaknesses.push(weakness);
    }

    await saveProfile(profile);

    return profile;
}

// Update learning preferences
export async function updatePreferences(preferences) {
    const profile = await getProfile();

    profile.preferences = {
        ...profile.preferences,
        ...preferences
    };

    await saveProfile(profile);

    return profile;
}