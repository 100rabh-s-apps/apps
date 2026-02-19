/**
 * Conversion Quest - Rewards System
 * Handles badges, achievements, and progress tracking
 */

const Rewards = (function() {
    'use strict';

    // Badge definitions
    const badges = {
        'length-1': {
            id: 'length-1',
            name: 'Length Starter',
            description: 'Complete Level 1 in Length conversions',
            icon: '🌟',
            category: 'length',
            requirement: { level: 1 }
        },
        'length-2': {
            id: 'length-2',
            name: 'Length Master',
            description: 'Complete Level 5 in Length conversions',
            icon: '⭐',
            category: 'length',
            requirement: { level: 5 }
        },
        'weight-1': {
            id: 'weight-1',
            name: 'Weight Starter',
            description: 'Complete Level 1 in Weight conversions',
            icon: '🌟',
            category: 'weight',
            requirement: { level: 1 }
        },
        'weight-2': {
            id: 'weight-2',
            name: 'Weight Master',
            description: 'Complete Level 5 in Weight conversions',
            icon: '⭐',
            category: 'weight',
            requirement: { level: 5 }
        },
        'volume-1': {
            id: 'volume-1',
            name: 'Volume Starter',
            description: 'Complete Level 1 in Volume conversions',
            icon: '🌟',
            category: 'volume',
            requirement: { level: 1 }
        },
        'volume-2': {
            id: 'volume-2',
            name: 'Volume Master',
            description: 'Complete Level 5 in Volume conversions',
            icon: '⭐',
            category: 'volume',
            requirement: { level: 5 }
        }
    };

    // Storage key
    const STORAGE_KEY = 'conversionQuestProgress';

    // Default progress state
    const defaultProgress = {
        badges: [],
        categoryProgress: {
            length: { level: 1, stars: 0, highestCompletedLevel: 0 },
            weight: { level: 1, stars: 0, highestCompletedLevel: 0 },
            volume: { level: 1, stars: 0, highestCompletedLevel: 0 }
        },
        totalStars: 0,
        stats: {
            questionsAnswered: 0,
            correctAnswers: 0,
            bestCombo: 0
        }
    };

    // Current progress
    let progress = null;

    /**
     * Load progress from localStorage
     */
    function loadProgress() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                progress = JSON.parse(stored);
                // Merge with defaults to handle new fields
                progress = { ...defaultProgress, ...progress };
                // Ensure categoryProgress has all fields
                ['length', 'weight', 'volume'].forEach(cat => {
                    if (!progress.categoryProgress[cat]) {
                        progress.categoryProgress[cat] = { level: 1, stars: 0, highestCompletedLevel: 0 };
                    }
                    if (progress.categoryProgress[cat].highestCompletedLevel === undefined) {
                        progress.categoryProgress[cat].highestCompletedLevel = 0;
                    }
                });
            } else {
                progress = { ...defaultProgress };
            }
        } catch (e) {
            console.warn('Could not load progress:', e);
            progress = { ...defaultProgress };
        }
        return progress;
    }

    /**
     * Save progress to localStorage
     */
    function saveProgress() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        } catch (e) {
            console.warn('Could not save progress:', e);
        }
    }

    /**
     * Initialize the rewards system
     */
    function init() {
        loadProgress();
        return progress;
    }

    /**
     * Check if a badge is unlocked
     */
    function hasBadge(badgeId) {
        return progress.badges.includes(badgeId);
    }

    /**
     * Unlock a badge (returns badge info if newly unlocked, null otherwise)
     */
    function unlockBadge(badgeId) {
        if (!badges[badgeId]) return null;
        
        if (!progress.badges.includes(badgeId)) {
            progress.badges.push(badgeId);
            saveProgress();
            return badges[badgeId];
        }
        return null;
    }

    /**
     * Get badge by ID
     */
    function getBadge(badgeId) {
        return badges[badgeId];
    }

    /**
     * Get all badges
     */
    function getAllBadges() {
        return badges;
    }

    /**
     * Get unlocked badges
     */
    function getUnlockedBadges() {
        return progress.badges.map(id => badges[id]).filter(b => b);
    }

    /**
     * Get locked badges
     */
    function getLockedBadges() {
        return Object.values(badges).filter(b => !progress.badges.includes(b.id));
    }

    /**
     * Get progress for a category
     */
    function getCategoryProgress(category) {
        return progress.categoryProgress[category] || { level: 1, stars: 0 };
    }

    /**
     * Update category progress
     */
    function updateCategoryProgress(category, level, starsEarned) {
        if (!progress.categoryProgress[category]) {
            progress.categoryProgress[category] = { level: 1, stars: 0, highestCompletedLevel: 0 };
        }

        const catProgress = progress.categoryProgress[category];

        // Update highest completed level
        if (level > catProgress.highestCompletedLevel) {
            catProgress.highestCompletedLevel = level;
        }

        // Update display level (next level to play)
        if (level >= catProgress.highestCompletedLevel) {
            catProgress.level = Math.min(level + 1, 5);
        }

        // Add stars
        catProgress.stars += starsEarned;
        progress.totalStars += starsEarned;

        saveProgress();

        // Check for ALL badge unlocks based on highest completed level
        const newBadges = [];
        const completedLevel = catProgress.highestCompletedLevel;

        // Check Starter badge (complete level 1)
        if (completedLevel >= 1) {
            const starterBadge = unlockBadge(`${category}-1`);
            if (starterBadge) {
                newBadges.push(starterBadge);
            }
        }

        // Check Master badge (complete level 5)
        if (completedLevel >= 5) {
            const masterBadge = unlockBadge(`${category}-2`);
            if (masterBadge) {
                newBadges.push(masterBadge);
            }
        }

        return {
            categoryProgress: catProgress,
            totalStars: progress.totalStars,
            newBadges
        };
    }

    /**
     * Get total stars earned
     */
    function getTotalStars() {
        return progress.totalStars;
    }

    /**
     * Get unlocked badge count
     */
    function getBadgeCount() {
        return progress.badges.length;
    }

    /**
     * Get total possible badges
     */
    function getTotalBadges() {
        return Object.keys(badges).length;
    }

    /**
     * Update stats
     */
    function updateStats(correct, combo) {
        progress.stats.questionsAnswered++;
        if (correct) {
            progress.stats.correctAnswers++;
        }
        if (combo > progress.stats.bestCombo) {
            progress.stats.bestCombo = combo;
        }
        saveProgress();
    }

    /**
     * Get stats
     */
    function getStats() {
        return progress.stats;
    }

    /**
     * Reset all progress
     */
    function resetProgress() {
        progress = { ...defaultProgress };
        saveProgress();
        return progress;
    }

    /**
     * Calculate stars earned based on performance
     * 5 stars = perfect (10/10)
     * 4 stars = excellent (9/10)
     * 3 stars = good (7-8/10)
     * 2 stars = fair (5-6/10)
     * 1 star = keep practicing (below 5)
     */
    function calculateStars(correctCount, totalNeeded) {
        const percentage = correctCount / totalNeeded;
        if (percentage >= 1) return 5;  // 5 stars
        if (percentage >= 0.9) return 4;  // 4 stars
        if (percentage >= 0.7) return 3;  // 3 stars
        if (percentage >= 0.5) return 2;  // 2 stars
        return 1;  // 1 star
    }

    /**
     * Get grade label from star count
     */
    function getGradeLabel(stars) {
        const grades = {
            5: { label: '5 Stars', description: 'Perfect! You\'re a conversion superstar!' },
            4: { label: '4 Stars', description: 'Excellent! Great job!' },
            3: { label: '3 Stars', description: 'Good job! Keep it up!' },
            2: { label: '2 Stars', description: 'Fair! You can do better!' },
            1: { label: '1 Star', description: 'Keep practicing! You\'ll get it next time!' }
        };
        return grades[stars] || grades[1];
    }

    // Public API
    return {
        init,
        hasBadge,
        unlockBadge,
        getBadge,
        getAllBadges,
        getUnlockedBadges,
        getLockedBadges,
        getCategoryProgress,
        updateCategoryProgress,
        getTotalStars,
        getBadgeCount,
        getTotalBadges,
        updateStats,
        getStats,
        resetProgress,
        calculateStars,
        getGradeLabel
    };

})();
