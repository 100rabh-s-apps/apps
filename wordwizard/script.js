document.addEventListener('DOMContentLoaded', () => {
    const questionTextElement = document.getElementById('question-text');
    const answerAreaElement = document.getElementById('answer-area');
    const submitAnswerButton = document.getElementById('submit-answer');
    const feedbackElement = document.getElementById('feedback');
    const currentLevelSpan = document.getElementById('current-level');
    const gameOverScreen = document.getElementById('game-over');
    const gameArea = document.getElementById('game-area');
    const restartGameButton = document.getElementById('restart-game');

    // Helper function to shuffle letters of a word
    function shuffleWord(word) {
        const a = word.split("");
        let n = a.length;

        for (let i = n - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = a[i];
            a[i] = a[j];
            a[j] = temp;
        }
        return a.join("");
    }

    // Fisher-Yates (Knuth) shuffle algorithm for randomizing arrays
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Significantly expanded question data (example content)
    const allQuestions = {
        wordInContext: [ // Renamed from completeSentence
            { type: 'wordInContext', question: "The cat loves to _____ lazily in the warm sun.", options: ["run", "sleep", "eat", "jump"], correctAnswer: "sleep" },
            { type: 'wordInContext', question: "I use a _____ to write my name.", options: ["book", "pencil", "shoe", "hat"], correctAnswer: "pencil" },
            { type: 'wordInContext', question: "Birds build their _____ in trees.", options: ["houses", "nests", "beds", "caves"], correctAnswer: "nests" },
            { type: 'wordInContext', question: "The _____ is shining brightly today.", options: ["moon", "star", "sun", "cloud"], correctAnswer: "sun" },
            { type: 'wordInContext', question: "My mom cooks delicious _____ for dinner.", options: ["toys", "cars", "food", "games"], correctAnswer: "food" },
            { type: 'wordInContext', question: "We wear a _____ on our head.", options: ["sock", "glove", "hat", "shoe"], correctAnswer: "hat" },
            { type: 'wordInContext', question: "A _____ lives and swims in the ocean.", options: ["bird", "dog", "fish", "cat"], correctAnswer: "fish" },
            { type: 'wordInContext', question: "To go inside, please _____ the door.", options: ["kick", "close", "open", "throw"], correctAnswer: "open" },
            { type: 'wordInContext', question: "I like to _____ books at the library.", options: ["play", "read", "sing", "dance"], correctAnswer: "read" },
            { type: 'wordInContext', question: "The active dog loves to _____ games in the park.", options: ["swim", "fly", "play", "sleep"], correctAnswer: "play" },
            // --- 20 new wordInContext questions ---
            { type: 'wordInContext', question: "The cat likes to chase the _____.", options: ["mouse", "book", "car", "tree"], correctAnswer: "mouse" },
            { type: 'wordInContext', question: "I drink _____ when I am thirsty.", options: ["food", "water", "rocks", "toys"], correctAnswer: "water" },
            { type: 'wordInContext', question: "We see stars only at _____.", options: ["day", "night", "morning", "afternoon"], correctAnswer: "night" },
            { type: 'wordInContext', question: "A car has four _____.", options: ["wings", "wheels", "tails", "hats"], correctAnswer: "wheels" },
            { type: 'wordInContext', question: "My favorite color is _____.", options: ["loud", "soft", "red", "big"], correctAnswer: "red" },
            { type: 'wordInContext', question: "You use your _____ to hear sounds clearly.", options: ["eyes", "nose", "ears", "mouth"], correctAnswer: "ears" },
            { type: 'wordInContext', question: "The sun shines brightly during the _____.", options: ["night", "evening", "morning", "day"], correctAnswer: "day" },
            { type: 'wordInContext', question: "I wear _____ on my feet to keep them warm inside my shoes.", options: ["gloves", "socks", "hats", "shirts"], correctAnswer: "socks" },
            { type: 'wordInContext', question: "A large marine mammal, a _____, lives in the ocean.", options: ["lion", "monkey", "whale", "bird"], correctAnswer: "whale" },
            { type: 'wordInContext', question: "We eat _____ from a bowl with a spoon.", options: ["bread", "soup", "apple", "chicken"], correctAnswer: "soup" },
            { type: 'wordInContext', question: "You use a _____ with two blades to cut paper.", options: ["spoon", "fork", "scissors", "pen"], correctAnswer: "scissors" },
            { type: 'wordInContext', question: "The opposite of hot is _____.", options: ["warm", "cold", "big", "fast"], correctAnswer: "cold" },
            { type: 'wordInContext', question: "A farm animal that gives us milk is a _____.", options: ["dog", "cat", "cow", "horse"], correctAnswer: "cow" },
            { type: 'wordInContext', question: "Birds can _____ high up in the sky.", options: ["run", "swim", "fly", "jump"], correctAnswer: "fly" },
            { type: 'wordInContext', question: "I brush my _____ clean every morning and night.", options: ["shoes", "teeth", "clothes", "car"], correctAnswer: "teeth" },
            { type: 'wordInContext', question: "The _____ rings loudly when it's time for school.", options: ["bell", "pillow", "window", "chair"], correctAnswer: "bell" },
            { type: 'wordInContext', question: "We read _____ that are printed on pages from a book.", options: ["pictures", "words", "sounds", "smells"], correctAnswer: "words" },
            { type: 'wordInContext', question: "A _____ helps sick people get better.", options: ["teacher", "doctor", "baker", "pilot"], correctAnswer: "doctor" },
            { type: 'wordInContext', question: "My favorite fruit is a sweet, yellow _____ that grows on a tree in a bunch.", options: ["apple", "banana", "grape", "orange"], correctAnswer: "banana" },
            { type: 'wordInContext', question: "We sleep in a _____ where we have our bed.", options: ["kitchen", "bathroom", "bedroom", "car"], correctAnswer: "bedroom" },
        ],
        matchDefinition: [
            { type: 'matchDefinition', word: "Happy", definition: "Feeling or showing pleasure or contentment.", options: ["Sad", "Joyful", "Angry", "Tired"], correctAnswer: "Joyful" },
            { type: 'matchDefinition', word: "Fast", definition: "Moving or capable of moving at high speed.", options: ["Slow", "Quick", "Lazy", "Still"], correctAnswer: "Quick" },
            { type: 'matchDefinition', word: "Kind", definition: "Having or showing a friendly, generous, and considerate nature.", options: ["Mean", "Grumpy", "Helpful", "Rude"], correctAnswer: "Helpful" },
            { type: 'matchDefinition', word: "Big", definition: "Of considerable size, extent, or intensity.", options: ["Tiny", "Small", "Large", "Little"], correctAnswer: "Large" },
            { type: 'matchDefinition', word: "Quiet", definition: "Making little or no noise.", options: ["Loud", "Silent", "Noisy", "Talkative"], correctAnswer: "Silent" },
            { type: 'matchDefinition', word: "Cold", definition: "Having a low temperature.", options: ["Warm", "Hot", "Chilly", "Burning"], correctAnswer: "Chilly" },
            { type: 'matchDefinition', word: "Clean", definition: "Free from dirt, marks, or stains.", options: ["Dirty", "Messy", "Spotless", "Grubby"], correctAnswer: "Spotless" },
            { type: 'matchDefinition', word: "New", definition: "Not existing before; made or discovered recently.", options: ["Old", "Ancient", "Modern", "Fresh"], correctAnswer: "Modern" },
            { type: 'matchDefinition', word: "Strong", definition: "Having the power to move heavy weights or perform other physically demanding tasks.", options: ["Weak", "Powerful", "Frail", "Delicate"], correctAnswer: "Powerful" },
            { type: 'matchDefinition', word: "Begin", definition: "Start; perform or undergo the first part of (an action or activity).", options: ["End", "Finish", "Start", "Stop"], correctAnswer: "Start" },
            // --- 20 new matchDefinition questions ---
            { type: 'matchDefinition', word: "Brave", definition: "Ready to face and endure danger or pain; showing courage.", options: ["Fearful", "Courageous", "Shy", "Weak"], correctAnswer: "Courageous" },
            { type: 'matchDefinition', word: "Tiny", definition: "Extremely small.", options: ["Huge", "Enormous", "Miniature", "Large"], correctAnswer: "Miniature" },
            { type: 'matchDefinition', word: "Smart", definition: "Having or showing a quick-witted intelligence.", options: ["Dumb", "Clever", "Silly", "Slow"], correctAnswer: "Clever" },
            { type: 'matchDefinition', word: "Arrive", definition: "Reach a place at the end of a journey or a stage in a journey.", options: ["Depart", "Leave", "Come", "Go"], correctAnswer: "Come" },
            { type: 'matchDefinition', word: "Difficult", definition: "Needing much effort or skill to accomplish, deal with, or understand.", options: ["Easy", "Simple", "Hard", "Effortless"], correctAnswer: "Hard" },
            { type: 'matchDefinition', word: "Enjoy", definition: "Take delight or pleasure in (an activity or occasion).", options: ["Dislike", "Hate", "Like", "Tolerate"], correctAnswer: "Like" },
            { type: 'matchDefinition', word: "Rich", definition: "Having a great deal of money or assets.", options: ["Poor", "Wealthy", "Needy", "Empty"], correctAnswer: "Wealthy" },
            { type: 'matchDefinition', word: "Shy", definition: "Nervous or timid in the company of other people.", options: ["Bold", "Confident", "Timid", "Outgoing"], correctAnswer: "Timid" },
            { type: 'matchDefinition', word: "Gift", definition: "A thing given willingly to someone without payment; a present.", options: ["Loan", "Purchase", "Present", "Debt"], correctAnswer: "Present" },
            { type: 'matchDefinition', word: "Polite", definition: "Having or showing behaviour that is respectful and considerate of other people.", options: ["Rude", "Impolite", "Courteous", "Nasty"], correctAnswer: "Courteous" },
            { type: 'matchDefinition', word: "Bright", definition: "Giving out or reflecting much light; shining.", options: ["Dull", "Dark", "Luminous", "Gloomy"], correctAnswer: "Luminous" },
            { type: 'matchDefinition', word: "Simple", definition: "Easily understood or done; presenting no difficulty.", options: ["Complex", "Difficult", "Easy", "Complicated"], correctAnswer: "Easy" },
            { type: 'matchDefinition', word: "Start", definition: "Begin or be reckoned from a particular point or time.", options: ["End", "Finish", "Commence", "Cease"], correctAnswer: "Commence" },
            { type: 'matchDefinition', word: "True", definition: "In accordance with fact or reality.", options: ["False", "Factual", "Incorrect", "Untruthful"], correctAnswer: "Factual" },
            { type: 'matchDefinition', word: "Afraid", definition: "Feeling fear or anxiety; frightened.", options: ["Brave", "Courageous", "Scared", "Bold"], correctAnswer: "Scared" },
            { type: 'matchDefinition', word: "Walk", definition: "Move at a regular and fairly slow pace by lifting and setting down each foot in turn, never having both feet off the ground at once.", options: ["Run", "Stroll", "Jump", "Fly"], correctAnswer: "Stroll" },
            { type: 'matchDefinition', word: "Finish", definition: "Bring (an activity or task) to an end; complete.", options: ["Start", "Begin", "Complete", "Initiate"], correctAnswer: "Complete" },
            { type: 'matchDefinition', word: "Angry", definition: "Having a strong feeling of annoyance, displeasure, or hostility.", options: ["Calm", "Furious", "Happy", "Peaceful"], correctAnswer: "Furious" },
            { type: 'matchDefinition', word: "Cleanse", definition: "Make (something, especially the skin) thoroughly clean.", options: ["Dirty", "Wash", "Stain", "Mess"], correctAnswer: "Wash" },
            { type: 'matchDefinition', word: "Journey", definition: "An act of travelling from one place to another.", options: ["Stop", "Rest", "Trip", "Stay"], correctAnswer: "Trip" },
        ],
        unscrambleWord: [
            { type: 'unscrambleWord', word: "apple" },
            { type: 'unscrambleWord', word: "house" },
            { type: 'unscrambleWord', word: "table" },
            { type: 'unscrambleWord', word: "chair" },
            { type: 'unscrambleWord', word: "happy" },
            { type: 'unscrambleWord', word: "flower" },
            { type: 'unscrambleWord', word: "pencil" },
            { type: 'unscrambleWord', word: "school" },
            { type: 'unscrambleWord', word: "friend" },
            { type: 'unscrambleWord', word: "music" },
            { type: 'unscrambleWord', word: "orange" },
            { type: 'unscrambleWord', word: "yellow" },
            { type: 'unscrambleWord', word: "green" },
            { type: 'unscrambleWord', word: "purple" },
            { type: 'unscrambleWord', word: "doctor" },
            { type: 'unscrambleWord', word: "teacher" },
            { type: 'unscrambleWord', word: "student" },
            { type: 'unscrambleWord', word: "animal" },
            { type: 'unscrambleWord', word: "banana" },
            { type: 'unscrambleWord', word: "cookies" },
            // --- 20 new unscrambleWord questions ---
            { type: 'unscrambleWord', word: "garden" },
            { type: 'unscrambleWord', word: "computer" },
            { type: 'unscrambleWord', word: "kitchen" },
            { type: 'unscrambleWord', word: "window" },
            { type: 'unscrambleWord', word: "brother" },
            { type: 'unscrambleWord', word: "sister" },
            { type: 'unscrambleWord', word: "holiday" },
            { type: 'unscrambleWord', word: "umbrella" },
            { type: 'unscrambleWord', word: "sandwich" },
            { type: 'unscrambleWord', word: "elephant" },
            { type: 'unscrambleWord', word: "butterfly" },
            { type: 'unscrambleWord', word: "dinosaur" },
            { type: 'unscrambleWord', word: "sunshine" },
            { type: 'unscrambleWord', word: "backpack" },
            { type: 'unscrambleWord', word: "principal" },
            { type: 'unscrambleWord', word: "adventure" },
            { type: 'unscrambleWord', word: "calendar" },
            { type: 'unscrambleWord', word: "mystery" },
            { type: 'unscrambleWord', word: "champion" },
            { type: 'unscrambleWord', word: "laughter" },
        ],
        grammarFix: [
            { type: 'grammarFix', sentence: "Me and him went to the store.", corrected: "He and I went to the store." },
            { type: 'grammarFix', sentence: "The dog wagged its tail.", corrected: "The dog wagged its tail." },
            { type: 'grammarFix', sentence: "She don't like broccoli.", corrected: "She doesn't like broccoli." },
            { type: 'grammarFix', sentence: "They was playing outside.", corrected: "They were playing outside." },
            { type: 'grammarFix', sentence: "He go to school every day.", corrected: "He goes to school every day." },
            { type: 'grammarFix', sentence: "I have ate lunch already.", corrected: "I have eaten lunch already." },
            { type: 'grammarFix', sentence: "The boy like to play.", corrected: "The boy likes to play." },
            { type: 'grammarFix', sentence: "She run fast.", corrected: "She runs fast." },
            { type: 'grammarFix', sentence: "We is going home.", corrected: "We are going home." },
            { type: 'grammarFix', sentence: "They has a new car.", corrected: "They have a new car." },
            // --- 20 new grammarFix questions ---
            { type: 'grammarFix', sentence: "She don't want to go.", corrected: "She doesn't want to go." },
            { type: 'grammarFix', sentence: "Him and me saw a movie.", corrected: "He and I saw a movie." },
            { type: 'grammarFix', sentence: "I seen that film already.", corrected: "I have seen that film already." },
            { type: 'grammarFix', sentence: "The book lays on the table.", corrected: "The book lies on the table." },
            { type: 'grammarFix', sentence: "Can I borrow your pen please?", corrected: "May I borrow your pen, please?" },
            { type: 'grammarFix', sentence: "She is more taller than him.", corrected: "She is taller than him." },
            { type: 'grammarFix', sentence: "I ain't got no money.", corrected: "I don't have any money." },
            { type: 'grammarFix', sentence: "He speak very good English.", corrected: "He speaks very good English." },
            { type: 'grammarFix', sentence: "They was walking home.", corrected: "They were walking home." },
            { type: 'grammarFix', sentence: "My dog its really playful.", corrected: "My dog is really playful." },
            { type: 'grammarFix', sentence: "Give the book to him and I.", corrected: "Give the book to him and me." },
            { type: 'grammarFix', sentence: "Between you and I this is a secret.", corrected: "Between you and me, this is a secret." },
            { type: 'grammarFix', sentence: "I feel badly about that.", corrected: "I feel bad about that." },
            { type: 'grammarFix', sentence: "Everyone have their own opinion.", corrected: "Everyone has their own opinion." },
            { type: 'grammarFix', sentence: "There is two cats on the fence.", corrected: "There are two cats on the fence." },
            { type: 'grammarFix', sentence: "The cat runned after the mouse.", corrected: "The cat ran after the mouse." },
            { type: 'grammarFix', sentence: "He is a real good singer.", corrected: "He is a really good singer." },
            { type: 'grammarFix', sentence: "We went to the store and bought apples oranges and bananas.", corrected: "We went to the store and bought apples, oranges, and bananas." },
            { type: 'grammarFix', sentence: "She has less friends than me.", corrected: "She has fewer friends than I." },
            { type: 'grammarFix', sentence: "Whose coming to the party?", corrected: "Who's coming to the party?" },
        ]
    };
    
    let availableQuestions = []; // Questions for the current game session
    let currentQuestionIndex = 0;
    let score = 0;

    // Function to initialize available questions for a new game
    function initializeGameQuestions() {
        availableQuestions = []; // Ensure it's empty for a new game
        for (const typeKey in allQuestions) {
            if (allQuestions.hasOwnProperty(typeKey)) {
                availableQuestions = availableQuestions.concat(allQuestions[typeKey]);
            }
        }
        shuffleArray(availableQuestions); // Shuffle all questions to randomize order
    }

    function displayQuestion() {
        feedbackElement.classList.add('hidden');
        feedbackElement.textContent = '';
        answerAreaElement.innerHTML = '';
        submitAnswerButton.disabled = false;

        if (currentQuestionIndex >= availableQuestions.length) {
            endGame();
            return;
        }

        const questionData = availableQuestions[currentQuestionIndex];
        currentLevelSpan.textContent = currentQuestionIndex + 1;

        // Add question type icon
        let questionIcon = document.querySelector('#question-card .question-icon');
        if (!questionIcon) {
            questionIcon = document.createElement('img');
            questionIcon.classList.add('question-icon');
            document.getElementById('question-card').prepend(questionIcon); // Add at the beginning of the card
        }

        switch (questionData.type) {
            case 'wordInContext':
                questionIcon.src = 'images/speech_bubble_icon.png';
                questionIcon.alt = 'Word in Context Icon';
                questionTextElement.textContent = questionData.question;
                shuffleArray(questionData.options); // Shuffle options for this type too
                questionData.options.forEach(option => {
                    const button = document.createElement('button');
                    button.classList.add('option-button');
                    button.textContent = option;
                    button.addEventListener('click', () => selectOption(option, questionData.correctAnswer));
                    answerAreaElement.appendChild(button);
                });
                submitAnswerButton.disabled = true; // Disable submit for option-based questions
                break;
            case 'matchDefinition':
                questionIcon.src = 'images/magnifying_glass_icon.png';
                questionIcon.alt = 'Match Definition Icon';
                questionTextElement.textContent = `What is the definition of "${questionData.word}"?`;
                shuffleArray(questionData.options);
                questionData.options.forEach(option => {
                    const button = document.createElement('button');
                    button.classList.add('option-button');
                    button.textContent = option;
                    button.addEventListener('click', () => selectOption(option, questionData.correctAnswer));
                    answerAreaElement.appendChild(button);
                });
                submitAnswerButton.disabled = true; // Disable submit for option-based questions
                break;
            case 'unscrambleWord':
                questionIcon.src = 'images/jumbled_letters_icon.png';
                questionIcon.alt = 'Unscramble Word Icon';
                const scrambledWord = shuffleWord(questionData.word);
                questionTextElement.textContent = `Unscramble the word: "${scrambledWord}"`;
                const unscrambleInput = document.createElement('input');
                unscrambleInput.type = 'text';
                unscrambleInput.id = 'answer-input';
                unscrambleInput.placeholder = 'Type the word here...';
                answerAreaElement.appendChild(unscrambleInput);
                break;
            case 'grammarFix':
                questionIcon.src = 'images/pencil_icon.svg';
                questionIcon.alt = 'Grammar Fix Icon';
                questionTextElement.textContent = `Fix the grammar: "${questionData.sentence}"`;
                const grammarInput = document.createElement('input');
                grammarInput.type = 'text';
                grammarInput.id = 'answer-input';
                grammarInput.placeholder = 'Type the corrected sentence...';
                answerAreaElement.appendChild(grammarInput);
                break;
            default:
                console.error("Unknown question type:", questionData.type);
                currentQuestionIndex++;
                displayQuestion();
                break;
        }
    }

    // This function is specifically for questions where the user clicks an option button
    function selectOption(selectedAnswer, correctAnswer) {
        const isCorrect = selectedAnswer.toLowerCase() === correctAnswer.toLowerCase();
        giveFeedback(isCorrect, correctAnswer);
        if (isCorrect) {
            score++;
        }
        submitAnswerButton.disabled = true; // Keep disabled as it's an option choice

        setTimeout(() => {
            currentQuestionIndex++;
            displayQuestion();
        }, 1500); // Wait 1.5 seconds before next question
    }


    submitAnswerButton.addEventListener('click', () => {
        const questionData = availableQuestions[currentQuestionIndex];
        let isCorrect = false;
        let correctAnswerText = '';

        if (!questionData) {
            console.error("No question data found for current index:", currentQuestionIndex);
            return;
        }

        // Only process for questions that use a text input and the submit button
        if (questionData.type === 'grammarFix') {
            const userAnswer = removePunctuation(document.getElementById('answer-input').value.trim());
            isCorrect = userAnswer.toLowerCase() === removePunctuation(questionData.corrected.toLowerCase());
            correctAnswerText = questionData.corrected;
        } else if (questionData.type === 'unscrambleWord') {
            const userAnswer = document.getElementById('answer-input').value.trim();
            isCorrect = userAnswer.toLowerCase() === questionData.word.toLowerCase();
            correctAnswerText = questionData.word;
        } else {
            // For other types like 'wordInContext', 'matchDefinition', this button should be disabled.
            // This 'else' block serves as a safeguard.
            return;
        }

        giveFeedback(isCorrect, correctAnswerText);
        if (isCorrect) {
            score++;
        }
        submitAnswerButton.disabled = true;

        setTimeout(() => {
            currentQuestionIndex++;
            displayQuestion();
        }, 4000);
    });

    function giveFeedback(isCorrect, correctAnswer) {
        feedbackElement.classList.remove('hidden');
        feedbackElement.innerHTML = ''; // Clear previous content

        const feedbackText = document.createElement('span');
        feedbackText.textContent = isCorrect
            ? "Correct! Great job, Word Wizard!"
            : `Oops! Not quite. The correct answer was "${correctAnswer}".`;

        const feedbackIcon = document.createElement('img');
        feedbackIcon.src = isCorrect ? 'images/checkmark_animated.gif' : 'images/cross_animated.gif';
        feedbackIcon.alt = isCorrect ? 'Correct' : 'Incorrect';

        feedbackElement.appendChild(feedbackText);
        feedbackElement.appendChild(feedbackIcon);
        feedbackElement.className = isCorrect ? 'correct' : 'incorrect';
    }


    function endGame() {
        gameArea.classList.add('hidden');
        gameOverScreen.classList.remove('hidden');
        // Optionally display final score here
    }

    restartGameButton.addEventListener('click', () => {
        currentQuestionIndex = 0;
        score = 0;
        initializeGameQuestions();
        gameOverScreen.classList.add('hidden');
        gameArea.classList.remove('hidden');
        displayQuestion();
    });

    function removePunctuation(text) {
        const regex = /[!"#$%&'()*+,-\./:;<=>?@[\]^_`{|}~]/g; // Matches common punctuation marks
        return text.replace(regex, '');
    }


    // Initial game start
    initializeGameQuestions();
    displayQuestion();
});