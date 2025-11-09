// Plant Quiz Game - JavaScript Logic
document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const welcomeScreen = document.getElementById('welcome-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultsScreen = document.getElementById('results-screen');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const questionContainer = document.getElementById('question-container');
    const currentQ = document.getElementById('current-q');
    const scoreDisplay = document.getElementById('score');
    const progressFill = document.getElementById('progress-fill');
    const finalScore = document.getElementById('final-score');
    const achievementMessage = document.getElementById('achievement-message');
    const explanationContainer = document.getElementById('explanation-container');
    
    // Game state
    let currentQuestionIndex = 0;
    let score = 0;
    let shuffledQuestions = [];
    
    // Question bank
    const questions = [
        {
            type: 'multiple-choice',
            question: 'What do plants need to grow?',
            options: ['Water', 'Sunlight', 'Soil', 'All of the above'],
            correct: 3,
            explanation: 'Plants need water, sunlight, and soil to grow.'

        },
        {
            type: 'multiple-choice',
            question: 'Which part of the plant makes food?',
            options: ['Roots', 'Leaves', 'Flower', 'Stem'],
            correct: 1,
            explanation: 'The leaves of a plant make food through a process called photosynthesis.'

        },
        {
            type: 'true-false',
            question: 'Plants can grow without water.',
            correct: false,
            options: ['True', 'False'],
            explanation: 'Plants need water to survive and grow!'
        },
        {
            type: 'multiple-choice',
            question: 'What is the first stage of a plant\'s life cycle?',
            options: ['Flower', 'Sprout', 'Seed', 'Full Plant'],
            correct: 2,
            explanation: 'A plant\'s life cycle starts with a seed.'

        },
        {
            type: 'multiple-choice',
            question: 'Which of these is NOT a part of a plant?',
            options: ['Roots', 'Stem', 'Leaf', 'Wing'],
            correct: 3,
            explanation: 'Wings are not a part of a plant.'

        },


        {
            type: 'multiple-choice',
            question: 'What is the process by which plants convert light energy into chemical energy?',
            options: ['Respiration', 'Transpiration', 'Photosynthesis', 'Germination'],
            correct: 2,
            explanation: 'Photosynthesis is how plants make their own food using sunlight.'
        },
        {
            type: 'true-false',
            question: 'All plants produce flowers.',
            correct: false,
            options: ['True', 'False'],
            explanation: 'Many plants, like ferns and mosses, do not produce flowers.'
        },
        {
            type: 'multiple-choice',
            question: 'Which gas do plants absorb from the atmosphere?',
            options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
            correct: 2,
            explanation: 'Plants absorb carbon dioxide for photosynthesis and release oxygen.'
        },


        {
            type: 'multiple-choice',
            question: 'What is the primary function of roots?',
            options: ['Photosynthesis', 'Water absorption', 'Flower production', 'Seed dispersal'],
            correct: 1,
            explanation: 'Roots absorb water and nutrients from the soil.'
        },
        {
            type: 'true-false',
            question: 'Cacti are plants that thrive in wet environments.',
            correct: false,
            options: ['True', 'False'],
            explanation: 'Cacti are adapted to dry, desert environments.'
        },
        {
            type: 'multiple-choice',
            question: 'Which of these is a fruit, botanically speaking?',
            options: ['Tomato', 'Potato', 'Carrot', 'Lettuce'],
            correct: 0,
            explanation: 'Botanically, a tomato is a fruit because it develops from the flower\'s ovary and contains seeds.'
        },
        {
            type: 'multiple-choice',
            question: 'What color are most leaves?',
            options: ['Red', 'Blue', 'Green', 'Yellow'],
            correct: 2,
            explanation: 'Most leaves are green because of chlorophyll.'
        },
        {
            type: 'true-false',
            question: 'Trees are plants.',
            correct: true,
            options: ['True', 'False'],
            explanation: 'Trees are a type of plant.'
        },
        {
            type: 'multiple-choice',
            question: 'Which part of a plant grows underground?',
            options: ['Flower', 'Stem', 'Root', 'Leaf'],
            correct: 2,
            explanation: 'Roots grow underground to absorb water and nutrients.'
        },
        {
            type: 'true-false',
            question: 'Plants need light to grow.',
            correct: true,
            options: ['True', 'False'],
            explanation: 'Plants use sunlight to make their food.'
        },
        {
            type: 'multiple-choice',
            question: 'What do bees help plants do?',
            options: ['Sleep', 'Pollinate', 'Eat', 'Run'],
            correct: 1,
            explanation: 'Bees help plants make new seeds by carrying pollen.'
        },

        {
            type: 'multiple-choice',
            question: 'What comes out of a seed when it starts to grow?',
            options: ['Fruit', 'Sprout', 'Rock', 'Cloud'],
            correct: 1,
            explanation: 'A sprout is the first small shoot that comes out of a seed.'
        },
        {
            type: 'multiple-choice',
            question: 'What part of the plant absorbs sunlight?',
            options: ['Roots', 'Stem', 'Leaves', 'Flower'],
            correct: 2,
            explanation: 'Leaves are like solar panels for plants.'
        },
        {
            type: 'true-false',
            question: 'A cactus needs a lot of water.',
            correct: false,
            options: ['True', 'False'],
            explanation: 'Cacti live in dry places and need very little water.'
        },
        {
            type: 'multiple-choice',
            question: 'What do we call a baby plant?',
            options: ['Seed', 'Sprout', 'Tree', 'Bush'],
            correct: 1,
            explanation: 'A sprout is a baby plant just starting to grow.'
        },
        {
            type: 'true-false',
            question: 'All plants are green.',
            correct: false,
            options: ['True', 'False'],
            explanation: 'Some plants have red, purple, or yellow leaves and flowers.'
        },
        {
            type: 'multiple-choice',
            question: 'Which of these is a vegetable?',
            options: ['Apple', 'Carrot', 'Orange', 'Banana'],
            correct: 1,
            explanation: 'Carrots are root vegetables.'
        },
        {
            type: 'true-false',
            question: 'Flowers help plants make seeds.',
            correct: true,
            options: ['True', 'False'],
            explanation: 'Flowers are important for plant reproduction.'
        },
        {
            type: 'multiple-choice',
            question: 'What is the hard, woody part of a tree called?',
            options: ['Leaf', 'Root', 'Trunk', 'Branch'],
            correct: 2,
            explanation: 'The trunk is the main stem of a tree.'
        },
        {
            type: 'true-false',
            question: 'Plants can move from one place to another on their own.',
            correct: false,
            options: ['True', 'False'],
            explanation: 'Plants stay in one place, but their parts can move towards light or water.'
        },
        {
            type: 'multiple-choice',
            question: 'What do plants give us to breathe?',
            options: ['Carbon Dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'],
            correct: 1,
            explanation: 'Plants release oxygen, which we need to breathe.'
        },
        {
            type: 'true-false',
            question: 'A seed needs light to start growing.',
            correct: false,
            options: ['True', 'False'],
            explanation: 'Seeds usually start growing in the dark soil.'
        },
        {
            type: 'multiple-choice',
            question: 'Which of these is a type of grain?',
            options: ['Strawberry', 'Wheat', 'Potato', 'Broccoli'],
            correct: 1,
            explanation: 'Wheat is a common grain used to make bread.'
        },
        {
            type: 'true-false',
            question: 'All fruits are sweet.',
            correct: false,
            options: ['True', 'False'],
            explanation: 'Some fruits, like lemons, are sour, and some, like tomatoes, are savory.'
        },
        {
            type: 'multiple-choice',
            question: 'What is the main job of a flower?',
            options: ['To look pretty', 'To make food', 'To make seeds', 'To hold the plant up'],
            correct: 2,
            explanation: 'Flowers are where plants make new seeds.'
        },
        {
            type: 'true-false',
            question: 'Mushrooms are plants.',
            correct: false,
            options: ['True', 'False'],
            explanation: 'Mushrooms are fungi, not plants.'
        },
        {
            type: 'multiple-choice',
            question: 'What do we call the process of a seed growing into a plant?',
            options: ['Cooking', 'Sleeping', 'Germination', 'Flying'],
            correct: 2,
            explanation: 'Germination is when a seed sprouts and starts to grow.'
        },
        {
            type: 'true-false',
            question: 'Plants can grow in water without soil.',
            correct: true,
            options: ['True', 'False'],
            explanation: 'Some plants can grow in water, a method called hydroponics.'
        },
        {
            type: 'multiple-choice',
            question: 'Which of these is a type of tree?',
            options: ['Daisy', 'Rose', 'Oak', 'Tulip'],
            correct: 2,
            explanation: 'An oak is a large, strong tree.'
        },
        {
            type: 'true-false',
            question: 'Leaves change color in the spring.',
            correct: false,
            options: ['True', 'False'],
            explanation: 'Leaves usually change color in the autumn (fall).'
        },
        {
            type: 'multiple-choice',
            question: 'What is the sticky powder inside a flower called?',
            options: ['Sugar', 'Pollen', 'Dust', 'Water'],
            correct: 1,
            explanation: 'Pollen helps flowers make seeds.'
        },
        {
            type: 'true-false',
            question: 'Plants need darkness to grow.',
            correct: false,
            options: ['True', 'False'],
            explanation: 'Plants need light to make their food.'
        },
        {
            type: 'multiple-choice',
            question: 'Which animal helps spread plant seeds?',
            options: ['Fish', 'Bird', 'Cat', 'Dog'],
            correct: 1,
            explanation: 'Birds eat fruits and then drop the seeds in new places.'
        },

        {
            type: 'multiple-choice',
            question: 'What is the green stuff in leaves that helps them make food?',
            options: ['Water', 'Chlorophyll', 'Soil', 'Sunlight'],
            correct: 1,
            explanation: 'Chlorophyll is the green pigment that captures sunlight.'
        },
        {
            type: 'true-false',
            question: 'Plants can grow without air.',
            correct: false,
            options: ['True', 'False'],
            explanation: 'Plants need carbon dioxide from the air to make food.'
        },
        {
            type: 'multiple-choice',
            question: 'Which of these is a type of flower?',
            options: ['Pine tree', 'Grass', 'Rose', 'Fern'],
            correct: 2,
            explanation: 'A rose is a beautiful flowering plant.'
        },
        {
            type: 'true-false',
            question: 'Plants get all their food from the soil.',
            correct: false,
            options: ['True', 'False'],
            explanation: 'Plants make their own food using sunlight, water, and air, and get nutrients from the soil.'
        },
        {
            type: 'multiple-choice',
            question: 'What is the part of the plant that holds it up?',
            options: ['Root', 'Leaf', 'Stem', 'Flower'],
            correct: 2,
            explanation: 'The stem supports the plant and helps transport water and nutrients.'
        },
        {
            type: 'true-false',
            question: 'Some plants eat insects.',
            correct: true,
            options: ['True', 'False'],
            explanation: 'Carnivorous plants like the Venus flytrap eat insects.'
        },
        {
            type: 'multiple-choice',
            question: 'What do we call a group of flowers?',
            options: ['Herd', 'Flock', 'Bunch', 'Forest'],
            correct: 2,
            explanation: 'A bunch of flowers is a common term.'
        },
        {
            type: 'true-false',
            question: 'Plants grow faster in the winter.',
            correct: false,
            options: ['True', 'False'],
            explanation: 'Plants usually grow slower or stop growing in winter due to cold and less sunlight.'
        },
        {
            type: 'multiple-choice',
            question: 'What is the process called when plants release water vapor?',
            options: ['Photosynthesis', 'Transpiration', 'Respiration', 'Germination'],
            correct: 1,
            explanation: 'Transpiration is like sweating for plants.'
        },
        {
            type: 'true-false',
            question: 'A plant\'s stem always grows straight up.',
            correct: false,
            options: ['True', 'False'],
            explanation: 'Some stems can grow sideways or even underground.'
        },
        {
            type: 'multiple-choice',
            question: 'Which of these is a root vegetable?',
            options: ['Broccoli', 'Spinach', 'Potato', 'Corn'],
            correct: 2,
            explanation: 'Potatoes grow underground and are roots.'
        },
        {
            type: 'true-false',
            question: 'The stem of a plant carries water to the leaves.',
            correct: true,
            options: ['True', 'False'],
            explanation: 'The stem acts like a straw, carrying water and nutrients.'
        }
    ];


    const MAX_QUESTIONS = 10; // Number of questions per quiz

    // Utility functions
    function showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function startGame() {
        currentQuestionIndex = 0;
        score = 0;
        shuffledQuestions = shuffleArray([...questions]).slice(0, MAX_QUESTIONS); // Select MAX_QUESTIONS random questions
        
        showScreen('quiz-screen');
        scoreDisplay.textContent = score;
        updateProgressBar();
        displayQuestion();
    }

    function displayQuestion() {
        if (currentQuestionIndex >= shuffledQuestions.length) {
            showResults();
            return;
        }

        const question = shuffledQuestions[currentQuestionIndex];
        questionContainer.innerHTML = ''; // Clear previous question
        explanationContainer.innerHTML = ''; // Clear previous explanation

        const questionElement = document.createElement('div');
        questionElement.classList.add('question');

        const questionText = document.createElement('p');
        questionText.textContent = question.question;
        questionElement.appendChild(questionText);

        if (question.image) {
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('image-container');
            const img = document.createElement('img');
            img.src = question.image;
            img.alt = 'Question Image';
            imageContainer.appendChild(img);
            questionElement.appendChild(imageContainer);
        }

        if (question.type === 'multiple-choice' || question.type === 'true-false') {
            const optionsContainer = document.createElement('div');
            optionsContainer.classList.add('options');
            question.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.classList.add('option-btn');
                button.textContent = option;
                button.addEventListener('click', () => handleAnswer(index, question.correct, question.type, button));
                optionsContainer.appendChild(button);
            });
            questionElement.appendChild(optionsContainer);
        } else if (question.type === 'drag-drop') {
            const dragDropContainer = document.createElement('div');
            dragDropContainer.classList.add('drag-container');

            const draggableItemsContainer = document.createElement('div');
            draggableItemsContainer.classList.add('draggable-items');
            shuffleArray(question.elements).forEach(element => {
                const draggableItem = document.createElement('div');
                draggableItem.classList.add('draggable-item');
                draggableItem.setAttribute('draggable', true);
                draggableItem.textContent = element;
                draggableItem.dataset.value = element; // Store original value
                draggableItemsContainer.addEventListener('dragstart', e => {
                    e.dataTransfer.setData('text/plain', e.target.dataset.value);
                    e.target.classList.add('dragging');
                });
                draggableItemsContainer.addEventListener('dragend', e => {
                    e.target.classList.remove('dragging');
                });
                draggableItemsContainer.appendChild(draggableItem);
            });
            dragDropContainer.appendChild(draggableItemsContainer);

            const dropZonesContainer = document.createElement('div');
            dropZonesContainer.classList.add('drop-zones');
            // For drag-drop, we need specific drop zones. Let's assume they are defined in HTML or dynamically created.
            // For simplicity, let's create generic drop zones here.
            // A more robust solution would involve specific IDs for drop zones in HTML or more complex logic.
            // For now, let's create drop zones based on the number of elements to be dropped.
            question.elements.forEach(element => {
                const dropZone = document.createElement('div');
                dropZone.classList.add('drop-zone');
                dropZone.dataset.accept = element; // This drop zone accepts this element
                dropZone.textContent = `Drop ${element} here`; // Placeholder text
                dropZone.addEventListener('dragover', e => {
                    e.preventDefault();
                    dropZone.classList.add('hover');
                });
                dropZone.addEventListener('dragleave', () => {
                    dropZone.classList.remove('hover');
                });
                dropZone.addEventListener('drop', e => {
                    e.preventDefault();
                    dropZone.classList.remove('hover');
                    const data = e.dataTransfer.getData('text/plain');
                    // Simple check: if the dropped item matches the expected item for this zone
                    if (data === dropZone.dataset.accept) {
                        dropZone.textContent = data;
                        dropZone.classList.add('correct');
                        // Disable further drops on this zone and make the dropped item non-draggable
                        const droppedItem = document.querySelector(`.draggable-item[data-value="${data}"]`);
                        if (droppedItem) {
                            droppedItem.setAttribute('draggable', false);
                            droppedItem.style.opacity = '0.5';
                        }
                        // Check if all drops are correct
                        const allDroppedCorrectly = Array.from(dropZonesContainer.children).every(zone => zone.classList.contains('correct'));
                        if (allDroppedCorrectly) {
                            handleAnswer(true, true, question.type); // All correct
                        }
                    } else {
                        dropZone.classList.add('incorrect');
                        handleAnswer(false, true, question.type); // Incorrect drop
                    }
                });
                dropZonesContainer.appendChild(dropZone);
            });
            dragDropContainer.appendChild(dropZonesContainer);
            questionElement.appendChild(dragDropContainer);
        } else if (question.type === 'matching') {
            const matchingContainer = document.createElement('div');
            matchingContainer.classList.add('matching-container');

            const item1Container = document.createElement('div');
            item1Container.classList.add('plant-items');
            const item2Container = document.createElement('div');
            item2Container.classList.add('seed-items');

            const shuffledPairs = shuffleArray([...question.pairs]);
            const shuffledItem1s = shuffleArray(shuffledPairs.map(p => p.item1));
            const shuffledItem2s = shuffleArray(shuffledPairs.map(p => p.item2));

            shuffledItem1s.forEach(item1 => {
                const draggableItem = document.createElement('div');
                draggableItem.classList.add('match-item');
                draggableItem.setAttribute('draggable', true);
                draggableItem.textContent = item1;
                draggableItem.dataset.value = item1;
                draggableItem.addEventListener('dragstart', e => {
                    e.dataTransfer.setData('text/plain', e.target.dataset.value);
                    e.target.classList.add('dragging');
                });
                draggableItem.addEventListener('dragend', e => {
                    e.target.classList.remove('dragging');
                });
                item1Container.appendChild(draggableItem);
            });

            shuffledItem2s.forEach(item2 => {
                const dropZone = document.createElement('div');
                dropZone.classList.add('match-item', 'drop-zone');
                dropZone.dataset.accept = item2; // This drop zone accepts this item2
                dropZone.textContent = `Drop here for ${item2}`; // Placeholder text
                dropZone.addEventListener('dragover', e => {
                    e.preventDefault();
                    dropZone.classList.add('hover');
                });
                dropZone.addEventListener('dragleave', () => {
                    dropZone.classList.remove('hover');
                });
                dropZone.addEventListener('drop', e => {
                    e.preventDefault();
                    dropZone.classList.remove('hover');
                    const data = e.dataTransfer.getData('text/plain'); // This is item1
                    
                    // Find the correct item2 for the dropped item1
                    const correctPair = question.pairs.find(p => p.item1 === data);
                    
                    if (correctPair && correctPair.item2 === dropZone.dataset.accept) {
                        dropZone.textContent = `${data} - ${correctPair.item2}`;
                        dropZone.classList.add('correct');
                        // Disable further drops on this zone and make the dropped item non-draggable
                        const droppedItem = document.querySelector(`.match-item[data-value="${data}"]`);
                        if (droppedItem) {
                            droppedItem.setAttribute('draggable', false);
                            droppedItem.style.opacity = '0.5';
                        }
                        // Check if all drops are correct
                        const allDroppedCorrectly = Array.from(item2Container.children).every(zone => zone.classList.contains('correct'));
                        if (allDroppedCorrectly) {
                            handleAnswer(true, true, question.type); // All correct
                        }
                    } else {
                        dropZone.classList.add('incorrect');
                        handleAnswer(false, true, question.type); // Incorrect drop
                    }
                });
                item2Container.appendChild(dropZone);
            });

            matchingContainer.appendChild(item1Container);
            matchingContainer.appendChild(item2Container);
            questionElement.appendChild(matchingContainer);
        }

        questionContainer.appendChild(questionElement);
        currentQ.textContent = currentQuestionIndex + 1;
        updateProgressBar();
    }

    function handleAnswer(selectedIndex, correctAnswer, type, button = null) {
        let isCorrect = false;

        if (type === 'multiple-choice' || type === 'true-false') {
            let correctIndex = correctAnswer;
            if (type === 'true-false') {
                correctIndex = correctAnswer ? 0 : 1;
            }

            if (selectedIndex === correctIndex) {
                isCorrect = true;
            }
            if (button) {
                if (isCorrect) {
                    button.classList.add('correct');
                } else {
                    button.classList.add('incorrect');
                    // Optionally highlight the correct answer
                    const options = Array.from(button.parentNode.children);
                    options[correctIndex].classList.add('correct');
                }
                // Disable all buttons after an answer is selected
                Array.from(button.parentNode.children).forEach(btn => btn.disabled = true);
            }
        } else if (type === 'drag-drop' || type === 'matching') {
            // For drag-drop and matching, `selectedIndex` is a boolean indicating if all were correct
            isCorrect = selectedIndex;
        }

        if (isCorrect) {
            score++;
            scoreDisplay.textContent = score;
        }

        const question = shuffledQuestions[currentQuestionIndex];
        if (question.explanation) {
            explanationContainer.textContent = question.explanation;
        }

        // Move to the next question after a short delay
        setTimeout(() => {
            currentQuestionIndex++;
            displayQuestion();
        }, 3000); // 3 second delay
    }

    function updateProgressBar() {
        const progress = ((currentQuestionIndex) / shuffledQuestions.length) * 100;
        progressFill.style.width = `${progress}%`;
    }

    function showResults() {
        showScreen('results-screen');
        finalScore.textContent = score;

        let message = '';
        if (score === MAX_QUESTIONS) {
            message = 'You are a Plant Master! 🌱';
        } else if (score >= MAX_QUESTIONS * 0.7) {
            message = 'Great job! You know a lot about plants! 🌿';
        } else if (score >= MAX_QUESTIONS * 0.4) {
            message = 'Good effort! Keep learning about plants! 🌻';
        } else {
            message = 'Time to grow your plant knowledge! 💧';
        }
        achievementMessage.textContent = message;
    }

    function restartGame() {
        showScreen('welcome-screen');
    }

    // Event Listeners
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', restartGame);

});