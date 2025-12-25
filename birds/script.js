const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const startButton = document.getElementById('start-button');
const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options');
const successSound = document.getElementById('success-sound');
const errorSound = document.getElementById('error-sound');

const scoreElement = document.getElementById('score');

let quizData;
let unaskedQuestions;
let currentQuestion;
let score = 0;
let optionButtons = []; // Store references to option buttons

function transitionTo(from, to) {
    from.classList.add('fade-out');
    from.addEventListener('animationend', () => {
        from.classList.add('hidden');
        from.classList.remove('fade-out');

        to.classList.remove('hidden');
        to.classList.add('fade-in');
        to.addEventListener('animationend', () => {
            to.classList.remove('fade-in');
        }, { once: true });
    }, { once: true });
}

async function fetchQuizData() {
    const response = await fetch('quiz.json');
    const data = await response.json();
    quizData = data.quiz;
    return quizData;
}

function showQuestion() {
    const randomIndex = Math.floor(Math.random() * unaskedQuestions.length);
    currentQuestion = unaskedQuestions[randomIndex];
    unaskedQuestions.splice(randomIndex, 1);

    questionElement.textContent = currentQuestion.question;
    optionsContainer.innerHTML = '';
    optionButtons = []; // Reset the button array
    
    let shuffledOptions = [];
    if(currentQuestion.options[3] !== "All of the above"){
       shuffledOptions = [...currentQuestion.options].sort(() => Math.random() - 0.5);
    } else {
        shuffledOptions = currentQuestion.options;
    }
    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option');
        button.addEventListener('click', () => checkAnswer(option, button));
        optionsContainer.appendChild(button);
        optionButtons.push(button); // Store button reference
    });
}

function checkAnswer(selectedOption, clickedButton) {
    // Disable all buttons to prevent multiple clicks
    optionButtons.forEach(button => {
        button.disabled = true;
    });
    
    if (selectedOption === currentQuestion.answer) {
        // Correct answer
        score++;
        scoreElement.textContent = `Score: ${score}`;
        clickedButton.classList.add('correct');
        
        if (successSound.src && successSound.src !== window.location.href) {
            successSound.currentTime = 0; // Reset to beginning
            successSound.play();
            
            // Stop audio after 5 seconds
            setTimeout(() => {
                if (!successSound.paused) {
                    successSound.pause();
                    successSound.currentTime = 0;
                }
            }, 5000);
        } else {
            console.log('Correct! (bird-chirp-success.mp3 not found)');
        }
        
        // Show correct answer for a short time before moving to next question
        setTimeout(() => {
            if (unaskedQuestions.length > 0) {
                showQuestion();
            } else {
                showFinalScore();
            }
        }, 1500);
    } else {
        // Incorrect answer
        clickedButton.classList.add('incorrect');
        
        // Highlight the correct answer
        optionButtons.forEach(button => {
            if (button.textContent === currentQuestion.answer) {
                button.classList.add('correct');
            }
        });
        
        if (errorSound.src && errorSound.src !== window.location.href) {
            errorSound.currentTime = 0; // Reset to beginning
            errorSound.play();
            
            // Stop audio after 5 seconds
            setTimeout(() => {
                if (!errorSound.paused) {
                    errorSound.pause();
                    errorSound.currentTime = 0;
                }
            }, 5000);
        } else {
            console.log('Wrong! (bird-chirp-error.mp3 not found)');
        }
        
        // Show correct answer for a short time before moving to next question
        setTimeout(() => {
            if (unaskedQuestions.length > 0) {
                showQuestion();
            } else {
                showFinalScore();
            }
        }, 2000);
    }
}

function showFinalScore() {
    setTimeout(() => {
        alert(`Quiz finished! Your final score is ${score} out of ${quizData.length}`);
        transitionTo(quizScreen, startScreen);
    }, 500);
}

startButton.addEventListener('click', async () => {
    await fetchQuizData();
    unaskedQuestions = [...quizData];
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    transitionTo(startScreen, quizScreen);
    showQuestion();
});
