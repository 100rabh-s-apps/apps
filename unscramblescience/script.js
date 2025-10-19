document.addEventListener('DOMContentLoaded', () => {
    const startContainer = document.getElementById('start-container');
    const gameContainer = document.getElementById('game-container');
    const scrambledLettersContainer = document.getElementById('scrambled-letters');
    const dropZone = document.getElementById('drop-zone');
    const feedback = document.getElementById('feedback');
    const checkBtn = document.getElementById('check-btn');
    const nextBtn = document.getElementById('next-btn');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const hintText = document.getElementById('hint-text');
    const scoreDisplay = document.getElementById('score');
    let currentTerm = {};
    let draggedTile = null;
    let score = 0;

    function chooseNewTerm() {
        const randomIndex = Math.floor(Math.random() * scientificTerms.length);
        return scientificTerms[randomIndex];
    }

    function scrambleTerm(term) {
        return term.split('').sort(() => Math.random() - 0.5).join('');
    }

    function initializeGame() {
        currentTerm = chooseNewTerm();
        const scrambled = scrambleTerm(currentTerm.term);

        scrambledLettersContainer.innerHTML = '';
        dropZone.innerHTML = '';
        feedback.textContent = '';
        hintText.textContent = `Hint: ${currentTerm.hint}`;

        scrambled.split('').forEach(letter => {
            const tile = document.createElement('div');
            tile.textContent = letter;
            tile.classList.add('letter-tile');
            tile.setAttribute('draggable', 'true');
            scrambledLettersContainer.appendChild(tile);
        });

        addDragAndDropListeners();
    }

    function addDragAndDropListeners() {
        const tiles = document.querySelectorAll('.letter-tile');

        tiles.forEach(tile => {
            tile.addEventListener('dragstart', handleDragStart);
            tile.addEventListener('dragend', handleDragEnd);
            tile.addEventListener('touchstart', handleTouchStart);
            tile.addEventListener('touchmove', handleTouchMove);
            tile.addEventListener('touchend', handleTouchEnd);
        });

        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('drop', handleDrop);
        scrambledLettersContainer.addEventListener('dragover', handleDragOver);
        scrambledLettersContainer.addEventListener('drop', handleDrop);
    }

    function handleDragStart(e) {
        draggedTile = e.target;
        setTimeout(() => {
            e.target.classList.add('dragging');
        }, 0);
    }

    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleDrop(e) {
        e.preventDefault();
        const dropContainer = e.target.closest('.letter-container, .drop-zone');
        if (dropContainer && draggedTile) {
            dropContainer.appendChild(draggedTile);
        }
    }

    function handleTouchStart(e) {
        e.preventDefault();
        draggedTile = e.target;
        setTimeout(() => {
            e.target.classList.add('dragging');
        }, 0);
    }

    function handleTouchMove(e) {
        e.preventDefault();
        if (draggedTile) {
            const touch = e.touches[0];
            draggedTile.style.position = 'fixed';
            draggedTile.style.left = `${touch.clientX - (draggedTile.offsetWidth / 2)}px`;
            draggedTile.style.top = `${touch.clientY - (draggedTile.offsetHeight / 2)}px`;
        }
    }

    function handleTouchEnd(e) {
        if (draggedTile) {
            draggedTile.style.visibility = 'hidden';
            const touch = e.changedTouches[0];
            const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
            draggedTile.style.visibility = 'visible';

            const dropContainer = dropTarget.closest('.letter-container, .drop-zone');
            if (dropContainer) {
                dropContainer.appendChild(draggedTile);
            }
            draggedTile.style.position = '';
            draggedTile.style.left = '';
            draggedTile.style.top = '';
            draggedTile.classList.remove('dragging');
            draggedTile = null;
        }
    }

    function checkAnswer() {
        const droppedLetters = [...dropZone.children].map(tile => tile.textContent).join('');
        if (droppedLetters === currentTerm.term) {
            feedback.textContent = 'Correct! Well done!';
            feedback.style.color = 'green';
            score++;
            scoreDisplay.textContent = score;
        } else {
            feedback.textContent = 'Not quite, try again!';
            feedback.style.color = 'red';
        }
    }

    function startGame() {
        startContainer.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        initializeGame();
    }

    function showAnswerAndMoveNext() {
        if (feedback.textContent !== 'Correct! Well done!') {
            feedback.textContent = `The correct answer was: ${currentTerm.term}`;
            feedback.style.color = 'blue';
            setTimeout(initializeGame, 2000);
        } else {
            initializeGame();
        }
    }

    function resetGame() {
        score = 0;
        scoreDisplay.textContent = score;
        startGame();
    }

    checkBtn.addEventListener('click', checkAnswer);
    nextBtn.addEventListener('click', showAnswerAndMoveNext);
    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetGame);
});