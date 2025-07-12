document.addEventListener('DOMContentLoaded', () => {
    const scoreDisplay = document.getElementById('score');
    const monsterImg = document.getElementById('monster');
    const questionDisplay = document.getElementById('question');
    const answerButtons = document.querySelectorAll('.answer-btn');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const problemArea = document.querySelector('.problem-area');

    // NEW: Operation Checkboxes and their container
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

        // 1. Remove all previous animation and state classes from the monster
        monsterImg.classList.remove('monster-mash-anim', 'monster-shake-anim', 'monsterPopIn');

        // 2. Ensure monster is visible before attempting to apply pop-in animation
        monsterImg.classList.remove('hidden');

        // 3. Force reflow to ensure any previous animation state is truly reset
        void monsterImg.offsetWidth;
        // monsterImg.classList.add('monsterPopIn');

        // NEW: Get active operations based on checkbox selection
        const activeOperations = [];
        if (opCheckboxes.add.checked) activeOperations.push(0); // 0: Addition
        if (opCheckboxes.subtract.checked) activeOperations.push(1); // 1: Subtraction
        if (opCheckboxes.multiply.checked) activeOperations.push(2); // 2: Multiplication
        if (opCheckboxes.divide.checked) activeOperations.push(3); // 3: Division

        // Handle case where no operations are selected
        if (activeOperations.length === 0) {
            questionDisplay.textContent = "Please select at least one operation!";
            answerButtons.forEach(button => button.disabled = true);
            monsterImg.classList.add('hidden'); // Hide monster if no ops are selected
            return; // Stop here if no operations selected
        }

        const operationType = activeOperations[getRandomInt(0, activeOperations.length - 1)]; // Select from active ops

        let num1, num2, questionText, result;
        const answers = new Set();

        switch (operationType) {
            case 0: // Addition
                num1 = getRandomInt(1, maxNumber * 2);
                num2 = getRandomInt(1, maxNumber * 2);
                result = num1 + num2;
                questionText = `${num1} + ${num2} = ?`;
                break;
            case 1: // Subtraction
                num1 = getRandomInt(5, maxNumber * 2);
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

        while (answers.size < 4) {
            let fakeAnswer = result + getRandomInt(-10, 10);
            if (fakeAnswer < 0 || fakeAnswer === result) {
                fakeAnswer = result + (getRandomInt(0, 1) === 0 ? 1 : -1) * getRandomInt(1, 5);
                if (fakeAnswer < 0) fakeAnswer = getRandomInt(0, maxNumber * maxNumber);
            }
            answers.add(fakeAnswer);
        }

        const shuffledAnswers = Array.from(answers).sort(() => Math.random() - 0.5);

        questionDisplay.textContent = questionText;
        answerButtons.forEach((button, index) => {
            button.textContent = shuffledAnswers[index];
            button.dataset.value = shuffledAnswers[index];
            button.disabled = false;
            button.classList.remove('correct-feedback', 'incorrect-feedback');
        });

        randomMonsterIndex = getRandomInt(0, monsterImages.length - 1);

        while(randomMonsterIndex === oldMonsterIndex) {
            randomMonsterIndex = getRandomInt(0, monsterImages.length - 1);
        }
        monsterImg.src = monsterImages[randomMonsterIndex];
        problemArea.classList.remove('flash-correct', 'flash-incorrect');
    }

    function checkAnswer(event) {
        if (!gameActive) return;

        const selectedAnswer = parseInt(event.target.dataset.value);
        const clickedButton = event.target;

        answerButtons.forEach(button => button.disabled = true);

        // *** CRITICAL FIX PART 1: Ensure a clean slate for the animation ***
        monsterImg.classList.remove('monsterPopIn', 'monster-shake-anim', 'monster-mash-anim', 'monsterMash');
        void monsterImg.offsetWidth; // Force reflow AFTER removing classes, BEFORE adding new one

        if (selectedAnswer === correctAnswer) {
            score++;
            scoreDisplay.textContent = score;
            // monsterImg.classList.add('monster-mash-anim', 'monsterMash'); // Apply mash animation
            clickedButton.classList.add('correct-feedback');
            problemArea.classList.add('flash-correct');


            const keyframes = [
                { transform: 'translateY(0) scaleY(1)', opacity: '1' }, // 0%
                { transform: 'translateY(20px) scaleY(0.95)', opacity: '1', offset: 0.05 }, // 5%
                { transform: 'translateY(100px) scaleY(0.4)', opacity: '0.7', offset: 0.60 }, // 60%
                { transform: 'translateY(300px) scaleY(0) ', opacity: '0', offset: 1 } // 100%
            ];

            const animationOptions = {
                duration: 2000, // 3 seconds in milliseconds
                fill: 'none', // Equivalent to CSS 'forwards'
                iterationCount: 1, // Play the animation once
            };

            monsterImg.animate(keyframes, animationOptions);

            nextQuestionTimeoutId = setTimeout(() => {
                loadNextRound();
                monsterImg.style.animation = ''; // Reset animation state
                const keyframesOut = [
                    { transform: 'translateY(0) translateX(0) scale(1)', opacity: '1' }, // 0%
                    { transform: 'translateY(0) translateX(-10px) scale(1)', opacity: '1' }, // 0%
                    { transform: 'translateY(0) translateX(10px) scale(1)', opacity: '1' }, // 0%
                    { transform: 'translateY(0) translateX(-10px) scale(1)', opacity: '1' }, // 0%
                    { transform: 'translateY(0) translateX(0) scale(1)', opacity: '1' }, // 0%
                ];

                const animationOptionsOut = {
                    duration: 400, // 0.4 seconds in milliseconds
                    easing: 'ease-in-out',
                    fill: 'none',
                };
                monsterImg.animate(keyframesOut, animationOptionsOut);

            }, 1900); // 3 seconds animation + 0.2s buffer

        } else {
            score = Math.max(0, score - 1);
            scoreDisplay.textContent = score;
            // monsterImg.classList.add('monster-shake-anim'); // Apply shake animation
            clickedButton.classList.add('incorrect-feedback');
            problemArea.classList.add('flash-incorrect');

            answerButtons.forEach(button => {
                if (parseInt(button.dataset.value) === correctAnswer) {
                    button.classList.add('correct-feedback');
                }
            });

            nextQuestionTimeoutId = setTimeout(() => {
                loadNextRound();
            }, 1200); // 0.4s animation + buffer
        }
    }

    function startGame() {
        // NEW: Check if at least one operation is selected before starting
        const anyOpSelected = Object.values(opCheckboxes).some(checkbox => checkbox.checked);
        if (!anyOpSelected) {
            alert("Please select at least one arithmetic operation to play!");
            return; // Don't start the game
        }

        score = 0;
        scoreDisplay.textContent = score;
        gameActive = true;
        startButton.classList.add('hidden');
        restartButton.classList.add('hidden');
        operationSelectionArea.classList.add('hidden'); // NEW: Hide selection during game

        loadNextRound();

        answerButtons.forEach(button => {
            button.addEventListener('click', checkAnswer);
            button.classList.remove('hidden');
        });
    }

    function endGame() {
        gameActive = false;
        if (nextQuestionTimeoutId) {
            clearTimeout(nextQuestionTimeoutId);
            nextQuestionTimeoutId = null;
        }

        questionDisplay.textContent = `Game Over! Your final score: ${score}`;
        answerButtons.forEach(button => {
            button.removeEventListener('click', checkAnswer);
            button.classList.add('hidden');
        });
        monsterImg.classList.add('hidden');
        restartButton.classList.remove('hidden');
        operationSelectionArea.classList.remove('hidden'); // NEW: Show selection after game
    }

    // Event Listeners
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);

    // Initial display state
    questionDisplay.textContent = 'Click "Start Game!" to begin!';
    answerButtons.forEach(button => button.classList.add('hidden'));
    monsterImg.classList.add('hidden'); // Monster starts hidden
});