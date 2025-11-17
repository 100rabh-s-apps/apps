// src/event-listeners.js
import {
    playButton, instructionsButton, backToSplashButton, letterGrid,
    pauseButton, resumeButton, restartButton, exitLevelButton,
    nextLevelButton, replayLevelButton, backToLevelsButton,
    soundToggle, contrastToggle, hintButton,
    splashScreen, levelSelectScreen, instructionsScreen, pauseOverlay
} from './dom-elements.js';
import { showScreen, startLevel, giveHint } from './game-logic.js';
import { handleStart, handleMove, handleEnd } from './input-handlers.js';
import { initAudio, setSoundEnabled, soundEnabled } from './audio-manager.js';
import { currentLevel, MAX_LEVELS } from './game-state.js';

export function addEventListeners() {
    playButton.addEventListener('click', () => showScreen(levelSelectScreen));
    instructionsButton.addEventListener('click', () => showScreen(instructionsScreen));
    backToSplashButton.addEventListener('click', () => showScreen(splashScreen));

    letterGrid.addEventListener('mousedown', handleStart);
    letterGrid.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);

    letterGrid.addEventListener('touchstart', handleStart);
    letterGrid.addEventListener('touchmove', handleMove);
    letterGrid.addEventListener('touchend', handleEnd);

    pauseButton.addEventListener('click', () => pauseOverlay.classList.add('active'));
    resumeButton.addEventListener('click', () => pauseOverlay.classList.remove('active'));
    restartButton.addEventListener('click', () => {
        pauseOverlay.classList.remove('active');
        startLevel(currentLevel.id);
    });
    exitLevelButton.addEventListener('click', () => {
        pauseOverlay.classList.remove('active');
        showScreen(levelSelectScreen);
    });

    nextLevelButton.addEventListener('click', () => {
        const nextLevelId = currentLevel.id + 1;
        if (nextLevelId <= MAX_LEVELS) {
            startLevel(nextLevelId);
        } else {
            showScreen(levelSelectScreen);
        }
    });
    replayLevelButton.addEventListener('click', () => startLevel(currentLevel.id));
    backToLevelsButton.addEventListener('click', () => showScreen(levelSelectScreen));

    soundToggle.addEventListener('change', () => {
        setSoundEnabled(soundToggle.checked);
        localStorage.setItem('wordFinder_soundEnabled', soundEnabled);
        if (soundEnabled) {
            initAudio();
        }
    });
    contrastToggle.addEventListener('change', () => {
        const isHighContrast = contrastToggle.checked;
        document.body.classList.toggle('high-contrast', isHighContrast);
        localStorage.setItem('wordFinder_highContrast', isHighContrast);
    });

    hintButton.addEventListener('click', giveHint);
}
