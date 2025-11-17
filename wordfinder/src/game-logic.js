// src/game-logic.js
import {
    splashScreen, levelSelectScreen, gameScreen, levelCompleteScreen, instructionsScreen,
    levelNameEl, timerEl, letterGrid, wordListEl, finalTimeEl, finalWordsFoundEl, scoreEl, finalScoreEl, levelList
} from './dom-elements.js';
import { currentLevel, foundWords, score, setFoundWords, setScore, setCurrentLevel, setTimerInterval, timerInterval } from './game-state.js';
import { generateLevel } from './level-generation.js';
import { playSound } from './audio-manager.js';
import { MAX_LEVELS } from './game-state.js';


export function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

export function startLevel(levelId) {
    setCurrentLevel(generateLevel(levelId));
    if (!currentLevel) return;

    setFoundWords([]);
    setScore(0);
    levelNameEl.textContent = currentLevel.name;
    scoreEl.textContent = `Score: 0`;

    renderGrid(currentLevel.grid);
    renderWordList();
    startTimer();

    showScreen(gameScreen);
}

export function renderLevelSelect() {
    levelList.innerHTML = '';
    for (let i = 1; i <= MAX_LEVELS; i++) {
        const levelButton = document.createElement('button');
        levelButton.textContent = `Level ${i}`;
        levelButton.onclick = () => startLevel(i);
        levelButton.setAttribute('aria-label', `Level ${i}`);
        levelList.appendChild(levelButton);
    }
}

export function renderGrid(gridData) {
    letterGrid.innerHTML = '';
    const gridArray = gridData.map(row => row.split(' '));
    const gridSize = gridArray.length;
    letterGrid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            const tile = document.createElement('div');
            const letter = gridArray[r][c] || '';
            
            tile.classList.add('grid-tile');
            tile.textContent = letter;
            tile.dataset.row = r;
            tile.dataset.col = c;
            tile.setAttribute('aria-label', `Row ${r + 1}, Column ${c + 1}, Letter ${letter}`);
            letterGrid.appendChild(tile);
        }
    }
}

export function renderWordList() {
    wordListEl.innerHTML = '';
    currentLevel.words.forEach(word => {
        const li = document.createElement('li');
        li.textContent = word;
        li.id = `word-${word}`;
        wordListEl.appendChild(li);
    });
}

export function startTimer() {
    let seconds = 0;
    timerEl.textContent = '00:00';
    setTimerInterval(setInterval(() => {
        seconds++;
        const min = String(Math.floor(seconds / 60)).padStart(2, '0');
        const sec = String(seconds % 60).padStart(2, '0');
        timerEl.textContent = `${min}:${sec}`;
    }, 1000));
}

export function checkWord(selection) {
    const selectedWord = selection.map(t => t.textContent).join('');
    const reversedWord = selectedWord.split('').reverse().join('');

    const wordToFind = currentLevel.words.find(w => !foundWords.includes(w) && (w === selectedWord || w === reversedWord));

    if (wordToFind) {
        playSound('success');
        foundWords.push(wordToFind);
        setScore(score + wordToFind.length * 10);
        scoreEl.textContent = `Score: ${score}`;
        selection.forEach(t => t.classList.add('found'));
        document.getElementById(`word-${wordToFind}`).classList.add('found');

        if (foundWords.length === currentLevel.words.length) {
            levelComplete();
        }
    } else if (selection.length > 0) {
        playSound('error');
        selection.forEach(t => t.classList.add('shake'));
        setTimeout(() => {
            selection.forEach(t => t.classList.remove('shake'));
        }, 300);
    }
}

export function levelComplete() {
    clearInterval(timerInterval);
    finalTimeEl.textContent = timerEl.textContent;
    finalScoreEl.textContent = score;
    finalWordsFoundEl.textContent = `${foundWords.length} / ${currentLevel.words.length}`;
    showScreen(levelCompleteScreen);
}

export function giveHint() {
    const unfoundWords = currentLevel.words.filter(word => !foundWords.includes(word));
    if (unfoundWords.length > 0) {
        const hintWord = unfoundWords[Math.floor(Math.random() * unfoundWords.length)];
        const gridArray = currentLevel.grid.map(row => row.split(' '));
        for (let r = 0; r < gridArray.length; r++) {
            for (let c = 0; c < gridArray[r].length; c++) {
                if (gridArray[r][c] === hintWord[0]) {
                    const tile = letterGrid.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                    if (tile) {
                        tile.classList.add('hint-highlight');
                        setTimeout(() => {
                            tile.classList.remove('hint-highlight');
                        }, 1000);
                        setScore(Math.max(0, score - 50));
                        scoreEl.textContent = `Score: ${score}`;
                        return;
                    }
                }
            }
        }
    }
}
