/**
 * Mind Mansion Item Library
 * Schema:
 * {
 *   id: number,
 *   name: string,
 *   category: 'Living' | 'Object' | 'Nature' | 'Abstract',
 *   difficulty_tier: number (1-10)
 * }
 */

const itemLibrary = [
    { id: 1, name: "Platypus", category: "Living", difficulty_tier: 3 },
    { id: 2, name: "Saturn", category: "Nature", difficulty_tier: 2 },
    { id: 3, name: "Accordion", category: "Object", difficulty_tier: 4 },
    { id: 4, name: "Gargantuan", category: "Abstract", difficulty_tier: 7 },
    { id: 5, name: "Resilience", category: "Abstract", difficulty_tier: 8 },
    { id: 6, name: "Cactus", category: "Nature", difficulty_tier: 1 },
    { id: 7, name: "Trombone", category: "Object", difficulty_tier: 4 },
    { id: 8, name: "Octopus", category: "Living", difficulty_tier: 2 },
    { id: 9, name: "Aurora", category: "Nature", difficulty_tier: 5 },
    { id: 10, name: "Labyrinth", category: "Object", difficulty_tier: 6 },
    { id: 11, name: "Kangaroo", category: "Living", difficulty_tier: 2 },
    { id: 12, name: "Microscope", category: "Object", difficulty_tier: 5 },
    { id: 13, name: "Volcano", category: "Nature", difficulty_tier: 3 },
    { id: 14, name: "Euphoria", category: "Abstract", difficulty_tier: 9 },
    { id: 15, name: "Compassion", category: "Abstract", difficulty_tier: 8 },
    { id: 16, name: "Sloth", category: "Living", difficulty_tier: 2 },
    { id: 17, name: "Submarine", category: "Object", difficulty_tier: 4 },
    { id: 18, name: "Sequoia", category: "Nature", difficulty_tier: 6 },
    { id: 19, name: "Melancholy", category: "Abstract", difficulty_tier: 9 },
    { id: 20, name: "Telescope", category: "Object", difficulty_tier: 3 },
    { id: 21, name: "Chameleon", category: "Living", difficulty_tier: 4 },
    { id: 22, name: "Glacier", category: "Nature", difficulty_tier: 4 },
    { id: 23, name: "Metronome", category: "Object", difficulty_tier: 5 },
    { id: 24, name: "Ambition", category: "Abstract", difficulty_tier: 7 },
    { id: 25, name: "Integrity", category: "Abstract", difficulty_tier: 8 },
    { id: 26, name: "Narwhal", category: "Living", difficulty_tier: 5 },
    { id: 27, name: "Crystal", category: "Nature", difficulty_tier: 3 },
    { id: 28, name: "Typewriter", category: "Object", difficulty_tier: 5 },
    { id: 29, name: "Solitude", category: "Abstract", difficulty_tier: 7 },
    { id: 30, name: "Bonsai", category: "Nature", difficulty_tier: 4 },
    { id: 31, name: "Axolotl", category: "Living", difficulty_tier: 6 },
    { id: 32, name: "Prism", category: "Object", difficulty_tier: 4 },
    { id: 33, name: "Thunderstorm", category: "Nature", difficulty_tier: 2 },
    { id: 34, name: "Serendipity", category: "Abstract", difficulty_tier: 10 },
    { id: 35, name: "Keyboard", category: "Object", difficulty_tier: 1 },
    { id: 36, name: "Elephant", category: "Living", difficulty_tier: 1 },
    { id: 37, name: "Waterfall", category: "Nature", difficulty_tier: 2 },
    { id: 38, name: "Spaceship", category: "Object", difficulty_tier: 3 },
    { id: 39, name: "Freedom", category: "Abstract", difficulty_tier: 6 },
    { id: 40, name: "Penguin", category: "Living", difficulty_tier: 2 },
    { id: 41, name: "Diamond", category: "Nature", difficulty_tier: 3 },
    { id: 42, name: "Helicopter", category: "Object", difficulty_tier: 3 },
    { id: 43, name: "Courage", category: "Abstract", difficulty_tier: 7 },
    { id: 44, name: "Gorilla", category: "Living", difficulty_tier: 3 },
    { id: 45, name: "Lighthouse", category: "Object", difficulty_tier: 4 },
    { id: 46, name: "Rainforest", category: "Nature", difficulty_tier: 5 },
    { id: 47, name: "Harmony", category: "Abstract", difficulty_tier: 8 },
    { id: 48, name: "Firefly", category: "Living", difficulty_tier: 2 },
    { id: 49, name: "Compass", category: "Object", difficulty_tier: 2 },
    { id: 50, name: "Eclipse", category: "Nature", difficulty_tier: 4 },
    { id: 51, name: "Albatross", category: "Living", difficulty_tier: 4 },
    { id: 52, name: "Baguette", category: "Object", difficulty_tier: 1 },
    { id: 53, name: "Candelabra", category: "Object", difficulty_tier: 5 },
    { id: 54, name: "Dandelion", category: "Nature", difficulty_tier: 2 },
    { id: 55, name: "Evergreen", category: "Nature", difficulty_tier: 3 },
    { id: 56, name: "Falcon", category: "Living", difficulty_tier: 3 },
    { id: 57, name: "Gondola", category: "Object", difficulty_tier: 4 },
    { id: 58, name: "Honeysuckle", category: "Nature", difficulty_tier: 5 },
    { id: 59, name: "Igloo", category: "Object", difficulty_tier: 2 },
    { id: 60, name: "Jellyfish", category: "Living", difficulty_tier: 2 },
    { id: 61, name: "Kaleidoscope", category: "Object", difficulty_tier: 6 },
    { id: 62, name: "Lemur", category: "Living", difficulty_tier: 3 },
    { id: 63, name: "Marmalade", category: "Object", difficulty_tier: 4 },
    { id: 64, name: "Nightshade", category: "Nature", difficulty_tier: 6 },
    { id: 65, name: "Oasis", category: "Nature", difficulty_tier: 5 },
    { id: 66, name: "Pyramid", category: "Object", difficulty_tier: 4 },
    { id: 67, name: "Quicksand", category: "Nature", difficulty_tier: 5 },
    { id: 68, name: "Rattlesnake", category: "Living", difficulty_tier: 4 },
    { id: 69, name: "Snowflake", category: "Nature", difficulty_tier: 1 },
    { id: 70, name: "Tarantula", category: "Living", difficulty_tier: 5 },
    { id: 71, name: "Umbrella", category: "Object", difficulty_tier: 1 },
    { id: 72, name: "Velociraptor", category: "Living", difficulty_tier: 7 },
    { id: 73, name: "Windmill", category: "Object", difficulty_tier: 3 },
    { id: 74, name: "Xylophone", category: "Object", difficulty_tier: 4 },
    { id: 75, name: "Yeti", category: "Living", difficulty_tier: 6 },
    { id: 76, name: "Zeppelin", category: "Object", difficulty_tier: 5 },
    { id: 77, name: "Anemone", category: "Nature", difficulty_tier: 6 },
    { id: 78, name: "Blueberry", category: "Nature", difficulty_tier: 1 },
    { id: 79, name: "Chandelier", category: "Object", difficulty_tier: 6 },
    { id: 80, name: "Dragonfly", category: "Living", difficulty_tier: 3 },
    { id: 81, name: "Eucalyptus", category: "Nature", difficulty_tier: 5 },
    { id: 82, name: "Flamingo", category: "Living", difficulty_tier: 3 },
    { id: 83, name: "Geyser", category: "Nature", difficulty_tier: 6 },
    { id: 84, name: "Hammock", category: "Object", difficulty_tier: 2 },
    { id: 85, name: "Inkwell", category: "Object", difficulty_tier: 5 },
    { id: 86, name: "Jackalope", category: "Living", difficulty_tier: 7 },
    { id: 87, name: "Kiwi", category: "Living", difficulty_tier: 2 },
    { id: 88, name: "Labyrinth", category: "Object", difficulty_tier: 6 },
    { id: 89, name: "Moonlight", category: "Nature", difficulty_tier: 2 },
    { id: 90, name: "Nebula", category: "Nature", difficulty_tier: 8 },
    { id: 91, name: "Orchid", category: "Nature", difficulty_tier: 4 },
    { id: 92, name: "Pendulum", category: "Object", difficulty_tier: 5 },
    { id: 93, name: "Quill", category: "Object", difficulty_tier: 4 },
    { id: 94, name: "Rhinoceros", category: "Living", difficulty_tier: 4 },
    { id: 95, name: "Sunflower", category: "Nature", difficulty_tier: 1 },
    { id: 96, name: "Tsunami", category: "Nature", difficulty_tier: 7 },
    { id: 97, name: "Uranus", category: "Nature", difficulty_tier: 5 },
    { id: 98, name: "Viking", category: "Living", difficulty_tier: 5 },
    { id: 99, name: "Waffle", category: "Object", difficulty_tier: 1 },
    { id: 100, name: "Yacht", category: "Object", difficulty_tier: 5 }
];

/**
 * Spaced Repetition & Persistence Logic
 */
let userStats = {
    masteredItems: [],
    strugglingItems: [], // Items missed in recent sessions
    mentalStrength: 0,
    userLevel: 1
};

function loadStats() {
    const saved = localStorage.getItem('mindMansionStats');
    if (saved) {
        userStats = JSON.parse(saved);
    }
}

function saveStats() {
    localStorage.setItem('mindMansionStats', JSON.stringify(userStats));
}

/**
 * Item Selection Engine with Spaced Repetition
 */
function selectItemsForSession(count = 10) {
    loadStats();
    
    // 1. Start with struggling items (prioritize learning)
    let selected = [];
    const struggling = itemLibrary.filter(i => userStats.strugglingItems.includes(i.id));
    selected = struggling.slice(0, Math.floor(count / 2)); // Take up to 50% struggling items

    // 2. Fill the rest with new items based on user level
    const remainingCount = count - selected.length;
    const available = itemLibrary.filter(item => 
        !selected.some(s => s.id === item.id) &&
        item.difficulty_tier <= userStats.userLevel + 1
    );

    const shuffled = [...available].sort(() => 0.5 - Math.random());
    selected = [...selected, ...shuffled.slice(0, remainingCount)];

    // 3. Ensure we have exactly 'count' items (fallback)
    if (selected.length < count) {
        const fallback = itemLibrary.filter(i => !selected.some(s => s.id === i.id));
        selected = [...selected, ...fallback.slice(0, count - selected.length)];
    }

    return selected.sort(() => 0.5 - Math.random());
}

function recordPerformance(itemId, wasCorrect) {
    if (wasCorrect) {
        // Remove from struggling if it was there
        userStats.strugglingItems = userStats.strugglingItems.filter(id => id !== itemId);
        
        if (!userStats.masteredItems.includes(itemId)) {
            userStats.masteredItems.push(itemId);
            userStats.mentalStrength += 10;
        } else {
            userStats.mentalStrength += 2; // Still gain a little for review
        }
    } else {
        // Add to struggling if not already there
        if (!userStats.strugglingItems.includes(itemId)) {
            userStats.strugglingItems.push(itemId);
        }
        userStats.mentalStrength = Math.max(0, userStats.mentalStrength - 5);
    }

    // Auto-Level Up logic
    if (userStats.mentalStrength >= userStats.userLevel * 100) {
        userStats.userLevel++;
    }

    saveStats();
}
