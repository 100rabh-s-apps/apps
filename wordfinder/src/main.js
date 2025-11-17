// src/main.js
import { renderLevelSelect, showScreen } from './game-logic.js';
import { addEventListeners } from './event-listeners.js';
import { initAudio } from './audio-manager.js';
import {
    splashScreen, playButton, instructionsButton, backToSplashButton,
    pauseButton, resumeButton, restartButton, exitLevelButton,
    nextLevelButton, replayLevelButton, backToLevelsButton,
    soundToggle, contrastToggle, hintButton, initDOMElements
} from './dom-elements.js';

document.addEventListener('DOMContentLoaded', () => {
    initDOMElements();
    addEventListeners();
    renderLevelSelect();
    showScreen(splashScreen);

    playButton.setAttribute('aria-label', 'Play Game');
    instructionsButton.setAttribute('aria-label', 'How to Play');
    backToSplashButton.setAttribute('aria-label', 'Back to Home Screen');
    pauseButton.setAttribute('aria-label', 'Pause Game');
    resumeButton.setAttribute('aria-label', 'Resume Game');
    restartButton.setAttribute('aria-label', 'Restart Level');
    exitLevelButton.setAttribute('aria-label', 'Exit to Level Selection');
    nextLevelButton.setAttribute('aria-label', 'Go to Next Level');
    replayLevelButton.setAttribute('aria-label', 'Replay Current Level');
    backToLevelsButton.setAttribute('aria-label', 'Back to Level Selection');
    soundToggle.setAttribute('aria-label', 'Toggle Sound');
    contrastToggle.setAttribute('aria-label', 'Toggle High Contrast Mode');
    hintButton.setAttribute('aria-label', 'Get a Hint');

    document.body.addEventListener('click', initAudio, { once: true });
    document.body.addEventListener('touchstart', initAudio, { once: true });
});
