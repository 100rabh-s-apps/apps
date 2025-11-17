// src/game-state.js
export let currentLevel = null;
export let foundWords = [];
export let score = 0;
export let isDrawing = false;
export let selection = [];
export let timerInterval = null;
export let currentDirection = null; // New state variable

export const MAX_LEVELS = 10;

export function setCurrentLevel(level) {
    currentLevel = level;
}

export function setFoundWords(words) {
    foundWords = words;
}

export function setScore(newScore) {
    score = newScore;
}

export function setIsDrawing(drawing) {
    isDrawing = drawing;
}

export function setSelection(newSelection) {
    selection = newSelection;
}

export function setTimerInterval(interval) {
    timerInterval = interval;
}

export function setCurrentDirection(direction) { // New setter
    currentDirection = direction;
}
