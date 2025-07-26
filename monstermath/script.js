document.addEventListener('DOMContentLoaded', () => {
    const scoreDisplay = document.getElementById('score');
    const monsterImg = document.getElementById('monster');
    const monsterArena = document.querySelector('.monster-arena'); // Get reference to monster arena
    const questionDisplay = document.getElementById('question');
    const answerButtons = document.querySelectorAll('.answer-btn');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const problemArea = document.querySelector('.problem-area');
    const mcqOptions = document.getElementById('mcq-options');
    const advancedInputArea = document.getElementById('advanced-input-area');
    const userAnswerInput = document.getElementById('user-answer-input');
    const submitAnswerBtn = document.getElementById('submit-answer-btn');
    const toggleModeButton = document.getElementById('toggle-mode-button');

    const opCheckboxes = {
        add: document.getElementById('op-add'),
        subtract: document.getElementById('op-subtract'),
        multiply: document.getElementById('op-multiply'),
        divide: document.getElementById('op-divide')
    };
    const operationSelectionArea = document.querySelector('.operation-selection');

    // Set symbols for custom checkboxes
    document.querySelector('.checkbox-container input#op-add + .checkmark').textContent = '+';
    document.querySelector('.checkbox-container input#op-subtract + .checkmark').textContent = '-';
    document.querySelector('.checkbox-container input#op-multiply + .checkmark').textContent = 'x';
    document.querySelector('.checkbox-container input#op-divide + .checkmark').textContent = '÷';


    let score = 0;
    let correctAnswer = 0;
    let gameActive = false;
    let nextQuestionTimeoutId = null;
    let oldMonsterIndex = -1;
    let gameMode = 'mcq'; // 'mcq' or 'advanced'

    // IMPORTANT: Replace with YOUR actual monster image paths!
    const monsterImages = [
        'img/monster1.jpg',
        'img/monster2.jpg',
        'img/monster3.jpg',
        'img/monster4.png',
        'img/monster5.jpg',
        // Add more monster images as you create them!
    ];

    const maxNumber = 12; // Max number for operations (e.g., up to 12x12)

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Function to set up the next question and monster
    function loadNextRound() {
        if (nextQuestionTimeoutId) {
            clearTimeout(nextQuestionTimeoutId);
            nextQuestionTimeoutId = null;
        }

        // Ensure monster is not shaking or mashing from previous round before new pop-in
        monsterImg.classList.remove('monster-mash-anim', 'monster-shake-anim', 'monsterPopIn');
        monsterImg.style.animation = ''; // Clear any inline animation styles

        monsterArena.classList.remove('hidden'); // Show the monster arena
        monsterImg.classList.remove('hidden'); // Ensure monster image is visible

        void monsterImg.offsetWidth; // Force reflow for pop-in animation
        monsterImg.classList.add('monsterPopIn'); // Add pop-in animation for new monster

        const activeOperations = [];
        if (opCheckboxes.add.checked) activeOperations.push(0);
        if (opCheckboxes.subtract.checked) activeOperations.push(1);
        if (opCheckboxes.multiply.checked) activeOperations.push(2);
        if (opCheckboxes.divide.checked) activeOperations.push(3);

        if (activeOperations.length === 0) {
            questionDisplay.textContent = "Please select at least one operation!";
            if (gameMode === 'mcq') {
                answerButtons.forEach(button => button.disabled = true);
            } else {
                userAnswerInput.disabled = true;
                submitAnswerBtn.disabled = true;
            }
            monsterArena.classList.add('hidden'); // Hide arena if no ops
            monsterImg.classList.add('hidden'); // Hide monster if no ops are selected
            return;
        }

        const operationType = activeOperations[getRandomInt(0, activeOperations.length - 1)];

        let num1, num2, questionText, result;
        const answers = new Set();

        switch (operationType) {
            case 0: // Addition
                num1 = getRandomInt(1, maxNumber * 3);
                num2 = getRandomInt(1, maxNumber * 3);
                result = num1 + num2;
                questionText = `${num1} + ${num2} = ?`;
                break;
            case 1: // Subtraction
                num1 = getRandomInt(5, maxNumber * 3);
                num2 = getRandomInt(1, num1 - 1);
                result = num1 - num2;
                questionText = `${num1} - ${num2} = ?`;
                break;
            case 2: // Multiplication
                num1 = getRandomInt(1, maxNumber);
                num2 = getRandomInt(1, maxNumber);
                result = num1 * num2;
                questionText = `${num1} x ${num2} = ?`;
                break;
            case 3: // Division
                result = getRandomInt(1, maxNumber);
                num2 = getRandomInt(1, maxNumber);
                num1 = result * num2;
                questionText = `${num1} / ${num2} = ?`;
                break;
        }

        correctAnswer = result;
        answers.add(result);

        // Generate fake answers only for MCQ mode
        if (gameMode === 'mcq') {
            while (answers.size < 4) {
                let fakeAnswer = result + getRandomInt(-10, 10);
                if (fakeAnswer < 0 || fakeAnswer === result) {
                    fakeAnswer = result + (getRandomInt(0, 1) === 0 ? 1 : -1) * getRandomInt(1, 5);
                    if (fakeAnswer < 0) fakeAnswer = getRandomInt(0, maxNumber * maxNumber);
                }
                answers.add(fakeAnswer);
            }
            const shuffledAnswers = Array.from(answers).sort(() => Math.random() - 0.5);
            answerButtons.forEach((button, index) => {
                button.textContent = shuffledAnswers[index];
                button.dataset.value = shuffledAnswers[index];
                button.disabled = false;
                button.classList.remove('correct-feedback', 'incorrect-feedback');
            });
        } else { // Advanced mode
            userAnswerInput.value = ''; // Clear previous input
            userAnswerInput.disabled = false;
            submitAnswerBtn.disabled = false;
            userAnswerInput.focus(); // Focus on the input field
        }


        questionDisplay.textContent = questionText;


        let randomMonsterIndex = getRandomInt(0, monsterImages.length - 1);

        while(randomMonsterIndex === oldMonsterIndex) {
            randomMonsterIndex = getRandomInt(0, monsterImages.length - 1);
        }
        monsterImg.src = monsterImages[randomMonsterIndex];
        oldMonsterIndex = randomMonsterIndex; // Update old monster index
        problemArea.classList.remove('flash-correct', 'flash-incorrect');
    }

    function handleAnswer(selectedAnswer) {
        if (!gameActive) return;

        // Disable input/buttons while processing
        if (gameMode === 'mcq') {
            answerButtons.forEach(button => button.disabled = true);
        } else {
            userAnswerInput.disabled = true;
            submitAnswerBtn.disabled = true;
        }


        monsterImg.classList.remove('monsterPopIn', 'monster-shake-anim', 'monster-mash-anim'); // Ensure clean state
        monsterImg.style.animation = ''; // Clear any ongoing CSS animation directly from JS
        void monsterImg.offsetWidth; // Force reflow


        if (selectedAnswer === correctAnswer) {
            score++;
            scoreDisplay.textContent = score;
            problemArea.classList.add('flash-correct');

            if (gameMode === 'mcq') {
                answerButtons.forEach(button => {
                    if (parseInt(button.dataset.value) === correctAnswer) {
                        button.classList.add('correct-feedback');
                    }
                });
            }


            const keyframes = [
                { transform: 'translateY(0) scaleY(1)', opacity: '1' },
                { transform: 'translateY(20px) scaleY(0.95)', opacity: '1', offset: 0.05 },
                { transform: 'translateY(100px) scaleY(0.4)', opacity: '0.7', offset: 0.60 },
                { transform: 'translateY(300px) scaleY(0) ', opacity: '0', offset: 1 }
            ];

            const animationOptions = {
                duration: 2000,
                fill: 'none',
                iterationCount: 1,
            };

            monsterImg.animate(keyframes, animationOptions);

            nextQuestionTimeoutId = setTimeout(() => {
                loadNextRound();
            }, 1900); // Allow monster to "mash" away before loading next
            // The "pop-in" of the next monster is handled by loadNextRound, not here.

        } else {
            score = Math.max(0, score - 1);
            scoreDisplay.textContent = score;
            problemArea.classList.add('flash-incorrect');
            monsterImg.classList.add('monster-shake-anim'); // Apply shake animation for incorrect

            if (gameMode === 'mcq') {
                answerButtons.forEach(button => {
                    if (parseInt(button.dataset.value) === correctAnswer) {
                        button.classList.add('correct-feedback');
                    }
                });
            } else {
                userAnswerInput.classList.add('incorrect-feedback');
                setTimeout(() => {
                    userAnswerInput.classList.remove('incorrect-feedback');
                }, 400);
            }


            nextQuestionTimeoutId = setTimeout(() => {
                loadNextRound();
            }, 1200);
        }
    }


    function checkAnswerMCQ(event) {
        const selectedAnswer = parseInt(event.target.dataset.value);
        handleAnswer(selectedAnswer);
    }

    function checkAnswerAdvanced() {
        const selectedAnswer = parseInt(userAnswerInput.value);
        if (isNaN(selectedAnswer)) {
            userAnswerInput.classList.add('incorrect-feedback');
            setTimeout(() => {
                userAnswerInput.classList.remove('incorrect-feedback');
            }, 500);
            userAnswerInput.focus();
            return;
        }
        handleAnswer(selectedAnswer);
    }

    function startGame() {
        const anyOpSelected = Object.values(opCheckboxes).some(checkbox => checkbox.checked);
        if (!anyOpSelected) {
            alert("Please select at least one arithmetic operation to play!");
            return;
        }

        score = 0;
        scoreDisplay.textContent = score;
        gameActive = true;
        startButton.classList.add('hidden');
        restartButton.classList.add('hidden');
        operationSelectionArea.classList.add('hidden');
        toggleModeButton.classList.add('hidden');

        if (gameMode === 'mcq') {
            mcqOptions.classList.remove('hidden');
            advancedInputArea.classList.add('hidden');
            answerButtons.forEach(button => {
                button.addEventListener('click', checkAnswerMCQ);
                button.classList.remove('hidden');
            });
        } else { // Advanced mode
            mcqOptions.classList.add('hidden');
            advancedInputArea.classList.remove('hidden');
            submitAnswerBtn.addEventListener('click', checkAnswerAdvanced);
            userAnswerInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    checkAnswerAdvanced();
                }
            });
        }

        loadNextRound();
    }

    function endGame() {
        gameActive = false;
        if (nextQuestionTimeoutId) {
            clearTimeout(nextQuestionTimeoutId);
            nextQuestionTimeoutId = null;
        }

        questionDisplay.textContent = `Game Over! Your final score: ${score}`;

        if (gameMode === 'mcq') {
            answerButtons.forEach(button => {
                button.removeEventListener('click', checkAnswerMCQ);
                button.classList.add('hidden');
            });
            mcqOptions.classList.add('hidden');
        } else {
            submitAnswerBtn.removeEventListener('click', checkAnswerAdvanced);
            userAnswerInput.removeEventListener('keydown', (event) => { /* Placeholder for removing specific handler */ }); // Fixed: Needs a proper way to remove specific keydown listener
            advancedInputArea.classList.add('hidden');
            userAnswerInput.value = '';
        }

        monsterArena.classList.add('hidden'); // Hide monster arena
        monsterImg.classList.add('hidden');
        restartButton.classList.remove('hidden');
        operationSelectionArea.classList.remove('hidden');
        toggleModeButton.classList.remove('hidden');
    }

    function toggleGameMode() {
        if (gameActive) {
            alert("Please finish the current game or restart to change modes.");
            return;
        }

        if (gameMode === 'mcq') {
            gameMode = 'advanced';
            toggleModeButton.textContent = 'Switch to Simple Mode';
        } else {
            gameMode = 'mcq';
            toggleModeButton.textContent = 'Switch to Advanced Mode';
        }
        // Reset game state visuals
        startButton.classList.remove('hidden');
        restartButton.classList.add('hidden');
        questionDisplay.textContent = 'Click "Start Game!" to begin!';
        monsterArena.classList.add('hidden'); // Hide monster arena when toggling modes
        monsterImg.classList.add('hidden');
    }


    // Event Listeners
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', endGame);
    toggleModeButton.addEventListener('click', toggleGameMode);


    // Initial display state
    questionDisplay.textContent = 'Click "Start Game!" to begin!';
    mcqOptions.classList.remove('hidden'); // Default to MCQ
    advancedInputArea.classList.add('hidden');
    answerButtons.forEach(button => button.classList.add('hidden')); // Hide MCQ buttons initially
    monsterArena.classList.add('hidden'); // Monster arena starts hidden
    monsterImg.classList.add('hidden'); // Monster image starts hidden
});