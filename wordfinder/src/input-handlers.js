// src/input-handlers.js
import { isDrawing, selection, setIsDrawing, setSelection, currentDirection, setCurrentDirection } from './game-state.js';
import { checkWord } from './game-logic.js';

export let currentPath = [];

export function getTileFromEvent(e) {
    const target = e.type.startsWith('touch') ? document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY) : e.target;
    return target.closest('.grid-tile');
}

export function handleStart(e) {
    e.preventDefault();
    setIsDrawing(true);
    setCurrentDirection(null); // Reset direction on new selection
    const tile = getTileFromEvent(e);
    if (tile) {
        setSelection([tile]);
        tile.classList.add('selected');
    }
}

export function handleMove(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const tile = getTileFromEvent(e);
    if (tile && !selection.includes(tile)) {
        const lastTile = selection[selection.length - 1];
        
        if (selection.length === 1) {
            // Second tile selected, determine direction
            const dir = getDirection(lastTile, tile);
            if (dir) {
                setCurrentDirection(dir);
                setSelection([...selection, tile]);
                tile.classList.add('selected');
            }
        } else if (currentDirection) {
            // Subsequent tiles must follow the established direction
            if (isValidNextTile(lastTile, tile, currentDirection)) {
                setSelection([...selection, tile]);
                tile.classList.add('selected');
            }
        }
    }
}

export function handleEnd(e) {
    if (!isDrawing) return;
    e.preventDefault();
    setIsDrawing(false);
    setCurrentDirection(null); // Clear direction after selection ends
    checkWord(selection);
    selection.forEach(t => t.classList.remove('selected'));
    setSelection([]);
}

function getDirection(tile1, tile2) {
    const row1 = parseInt(tile1.dataset.row);
    const col1 = parseInt(tile1.dataset.col);
    const row2 = parseInt(tile2.dataset.row);
    const col2 = parseInt(tile2.dataset.col);

    const dr = row2 - row1;
    const dc = col2 - col1;

    // Check for valid initial direction (adjacent and straight)
    if (Math.abs(dr) <= 1 && Math.abs(dc) <= 1 && (dr !== 0 || dc !== 0)) {
        // Normalize direction to -1, 0, or 1
        return { dr: dr === 0 ? 0 : dr / Math.abs(dr), dc: dc === 0 ? 0 : dc / Math.abs(dc) };
    }
    return null;
}

function isValidNextTile(lastTile, newTile, direction) {
    const row1 = parseInt(lastTile.dataset.row);
    const col1 = parseInt(lastTile.dataset.col);
    const row2 = parseInt(newTile.dataset.row);
    const col2 = parseInt(newTile.dataset.col);

    const expectedRow = row1 + direction.dr;
    const expectedCol = col1 + direction.dc;

    return row2 === expectedRow && col2 === expectedCol;
}