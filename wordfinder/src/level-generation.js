// src/level-generation.js
import { wordList } from '../wordlist.js';
import { MAX_LEVELS } from './game-state.js';

export function generateLevel(levelNum) {
    const numWords = Math.min(5 + levelNum, 20);
    const minWordLength = 3;
    const maxWordLength = Math.min(4 + Math.floor(levelNum / 2), 10);

    const eligibleWords = wordList.filter(w => w.length >= minWordLength && w.length <= maxWordLength);
    const selectedWords = [];
    const wordsToSelect = Math.min(numWords, eligibleWords.length);
    while (selectedWords.length < wordsToSelect && eligibleWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * eligibleWords.length);
        selectedWords.push(eligibleWords.splice(randomIndex, 1)[0].toUpperCase());
    }

    if (selectedWords.length === 0) {
        return {
            id: levelNum, name: `Level ${levelNum} (Fallback)`, gridSize: 5,
            words: ["CAT", "DOG"],
            grid: ["C A T X X", "X D O G X", "X X X X X", "X X X X X", "X X X X X"].map(row => row.split(' '))
        };
    }

    const longestWord = selectedWords.reduce((a, b) => a.length > b.length ? a : b, '');
    const baseGridSize = Math.max(longestWord.length + 2, Math.ceil(Math.sqrt(selectedWords.join('').length * 1.5)));
    const gridSize = Math.max(baseGridSize, 5);
    
    selectedWords.sort((a, b) => b.length - a.length);

    let grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
    const placedWords = [];

    const directions = [
        { dr: 0, dc: 1 }, { dr: 1, dc: 0 }, { dr: 1, dc: 1 }, { dr: 1, dc: -1},
    ];

    for (const word of selectedWords) {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 200) {
            const dir = directions[Math.floor(Math.random() * directions.length)];
            const r = Math.floor(Math.random() * gridSize);
            const c = Math.floor(Math.random() * gridSize);

            if (placeWord(grid, word, r, c, dir)) {
                placed = true;
                placedWords.push(word);
            }
            attempts++;
        }
    }

    return {
        id: levelNum, name: `Level ${levelNum}`, gridSize: gridSize,
        words: placedWords, grid: fillGrid(grid, placedWords)
    };
}

function fillGrid(grid, words) {
    const gridSize = grid.length;
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const wordSet = new Set(words.map(w => w.toUpperCase()));
    words.forEach(w => wordSet.add(w.split('').reverse().join('')));

    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            if (grid[r][c] === null) {
                const shuffledAlphabet = alphabet.split('').sort(() => 0.5 - Math.random());
                let placed = false;
                for (const letter of shuffledAlphabet) {
                    if (isSafeToPlace(grid, letter, r, c, wordSet)) {
                        grid[r][c] = letter;
                        placed = true;
                        break;
                    }
                }
                if (!placed) {
                    grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
                }
            }
        }
    }
    return grid.map(row => row.join(' '));
}

function isSafeToPlace(grid, letter, r, c, wordSet) {
    const gridSize = grid.length;
    grid[r][c] = letter; // Temporarily place the letter

    const directions = [
        { dr: 0, dc: 1 }, // Horizontal
        { dr: 1, dc: 0 }, // Vertical
        { dr: 1, dc: 1 }, // Diagonal down-right
        { dr: 1, dc: -1}, // Diagonal down-left
    ];

    for (const dir of directions) {
        let line = '';
        for (let i = -gridSize + 1; i < gridSize; i++) {
            const nr = r + i * dir.dr;
            const nc = c + i * dir.dc;
            if (nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize && grid[nr][nc]) {
                line += grid[nr][nc];
            }
        }

        for (let i = 0; i < line.length; i++) {
            for (let j = i + 1; j <= line.length; j++) {
                const sub = line.substring(i, j);
                if (wordSet.has(sub)) {
                    grid[r][c] = null; // Backtrack
                    return false;
                }
            }
        }
    }

    grid[r][c] = null; // Backtrack
    return true;
}

function placeWord(grid, word, r, c, dir) {
    const gridSize = grid.length;
    const wordLen = word.length;

    if (r + (wordLen - 1) * dir.dr >= gridSize || r + (wordLen - 1) * dir.dr < 0 ||
        c + (wordLen - 1) * dir.dc >= gridSize || c + (wordLen - 1) * dir.dc < 0) {
        return false;
    }

    for (let i = 0; i < wordLen; i++) {
        const nr = r + i * dir.dr;
        const nc = c + i * dir.dc;
        if (grid[nr][nc] && grid[nr][nc] !== word[i]) {
            return false;
        }
    }

    for (let i = 0; i < wordLen; i++) {
        const nr = r + i * dir.dr;
        const nc = c + i * dir.dc;
        grid[nr][nc] = word[i];
    }
    return true;
}
