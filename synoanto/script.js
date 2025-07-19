document.addEventListener('DOMContentLoaded', () => {
    const mainWordDisplay = document.getElementById('mainWord');
    const mainWordArea = document.querySelector('.main-word-area');
    const wordChoicesContainer = document.getElementById('wordChoices');
    const synonymZone = document.getElementById('synonymZone');
    const antonymZone = document.getElementById('antonymZone');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    const startButton = document.getElementById('startButton');
    const resetButton = document.getElementById('resetButton');
    const gameOverModal = document.getElementById('gameOverModal');
    const finalScoreDisplay = document.getElementById('finalScore');
    const closeModalButton = document.getElementById('closeModalButton');

    const correctSound = document.getElementById('correctSound');
    const incorrectSound = document.getElementById('incorrectSound');

    let score = 0;
    let timeLeft = 60;
    let timerInterval;
    let currentMainWordData = null;
    let gameActive = false;
    let currentRoundWords = { synonym: false, antonym: false }; // Track if found, not if null

    // Touch event specific variables
    let isDraggingTouch = false;
    let currentDraggedElementTouch = null;
    let touchOffsetX = 0;
    let touchOffsetY = 0;

    // Word list (truncated for example, but assume your 1000+ words are here)
    const wordList = [
        ['Happy', 'Joyful', 'Sad'],
        ['Big', 'Large', 'Small'],
        ['Fast', 'Quick', 'Slow'],
        ['Clean', 'Tidy', 'Dirty'],
        ['Begin', 'Start', 'End'],
        ['Good', 'Nice', 'Bad'],
        ['Hot', 'Warm', 'Cold'],
        ['Loud', 'Noisy', 'Quiet'],
        ['Near', 'Close', 'Far'],
        ['Old', 'Ancient', 'New'],
        ['Rich', 'Wealthy', 'Poor'],
        ['Strong', 'Powerful', 'Weak'],
        ['True', 'Correct', 'False'],
        ['Up', 'Above', 'Down'],
        ['Young', 'Youthful', 'Old'],
        ['Pretty', 'Beautiful', 'Ugly'],
        ['Brave', 'Courageous', 'Scared'],
        ['Hard', 'Difficult', 'Easy'],
        ['Kind', 'Gentle', 'Mean'],
        ['Smart', 'Clever', 'Dumb'],
        ['Quiet', 'Silent', 'Loud'],
        ['Soft', 'Gentle', 'Hard'],
        ['Dark', 'Dim', 'Bright'],
        ['Full', 'Complete', 'Empty'],
        ['Empty', 'Vacant', 'Full'],
        ['Open', 'Unclosed', 'Closed'],
        ['Close', 'Shut', 'Open'],
        ['Heavy', 'Weighty', 'Light'],
        ['Light', 'Bright', 'Dark'],
        ['Long', 'Extended', 'Short'],
        ['Short', 'Brief', 'Long'],
        ['Thin', 'Slender', 'Thick'],
        ['Thick', 'Dense', 'Thin'],
        ['Wet', 'Damp', 'Dry'],
        ['Dry', 'Arid', 'Wet'],
        ['Happy', 'Glad', 'Miserable'],
        ['Sad', 'Unhappy', 'Cheerful'],
        ['Angry', 'Mad', 'Calm'],
        ['Brave', 'Bold', 'Cowardly'],
        ['Calm', 'Peaceful', 'Agitated'],
        ['Clever', 'Intelligent', 'Stupid'],
        ['Cold', 'Chilly', 'Hot'],
        ['Cruel', 'Mean', 'Kind'],
        ['Difficult', 'Hard', 'Simple'],
        ['Easy', 'Simple', 'Difficult'],
        ['Excited', 'Thrilled', 'Bored'],
        ['Famous', 'Well-known', 'Unknown'],
        ['Fat', 'Plump', 'Thin'],
        ['Funny', 'Amusing', 'Serious'],
        ['Generous', 'Giving', 'Stingy'],
        ['Gentle', 'Soft', 'Rough'],
        ['Graceful', 'Elegant', 'Clumsy'],
        ['Great', 'Excellent', 'Terrible'],
        ['Healthy', 'Well', 'Sick'],
        ['Honest', 'Truthful', 'Dishonest'],
        ['Humble', 'Modest', 'Arrogant'],
        ['Important', 'Significant', 'Trivial'],
        ['Interesting', 'Engaging', 'Boring'],
        ['Kind', 'Compassionate', 'Cruel'],
        ['Lazy', 'Idle', 'Diligent'],
        ['Lively', 'Energetic', 'Dull'],
        ['Lovely', 'Beautiful', 'Ugly'],
        ['Loyal', 'Faithful', 'Disloyal'],
        ['Mature', 'Adult', 'Immature'],
        ['Messy', 'Untidy', 'Neat'],
        ['Modern', 'New', 'Old-fashioned'],
        ['Nervous', 'Anxious', 'Calm'],
        ['Optimistic', 'Hopeful', 'Pessimistic'],
        ['Patient', 'Tolerant', 'Impatient'],
        ['Polite', 'Courteous', 'Rude'],
        ['Poor', 'Needy', 'Rich'],
        ['Powerful', 'Strong', 'Weak'],
        ['Proud', 'Dignified', 'Ashamed'],
        ['Punctual', 'On time', 'Late'],
        ['Quick', 'Rapid', 'Slow'],
        ['Quiet', 'Peaceful', 'Noisy'],
        ['Responsible', 'Accountable', 'Irresponsible'],
        ['Rough', 'Uneven', 'Smooth'],
        ['Safe', 'Secure', 'Dangerous'],
        ['Scared', 'Afraid', 'Brave'],
        ['Serious', 'Solemn', 'Funny'],
        ['Shy', 'Reserved', 'Confident'],
        ['Simple', 'Easy', 'Complex'],
        ['Smart', 'Bright', 'Dull'],
        ['Smooth', 'Even', 'Rough'],
        ['Soft', 'Tender', 'Hard'],
        ['Strong', 'Mighty', 'Weak'],
        ['Sweet', 'Sugary', 'Sour'],
        ['Tall', 'High', 'Short'],
        ['Tame', 'Domesticated', 'Wild'],
        ['Tiny', 'Minute', 'Huge'],
        ['Tired', 'Sleepy', 'Energetic'],
        ['Tough', 'Strong', 'Tender'],
        ['Ugly', 'Unattractive', 'Beautiful'],
        ['Wise', 'Intelligent', 'Foolish'],
        ['Weak', 'Frail', 'Strong'],
        ['Wealthy', 'Rich', 'Poor'],
        ['Wet', 'Damp', 'Dry'],
        ['Wild', 'Untamed', 'Tame'],
        ['Wrong', 'Incorrect', 'Right'],
        ['Always', 'Forever', 'Never'],
        ['Arrive', 'Come', 'Depart'],
        ['Bottom', 'Base', 'Top'],
        ['Buy', 'Purchase', 'Sell'],
        ['Catch', 'Seize', 'Miss'],
        ['Day', 'Daytime', 'Night'],
        ['Early', 'Soon', 'Late'],
        ['East', 'Orient', 'West'],
        ['Exit', 'Depart', 'Enter'],
        ['Fall', 'Drop', 'Rise'],
        ['Few', 'Sparse', 'Many'],
        ['First', 'Initial', 'Last'],
        ['Give', 'Donate', 'Receive'],
        ['Go', 'Move', 'Stay'],
        ['Here', 'Present', 'There'],
        ['In', 'Inside', 'Out'],
        ['Join', 'Connect', 'Separate'],
        ['Laugh', 'Chuckle', 'Cry'],
        ['Less', 'Fewer', 'More'],
        ['Love', 'Adore', 'Hate'],
        ['Male', 'Boy', 'Female'],
        ['Many', 'Numerous', 'Few'],
        ['Morning', 'Dawn', 'Evening'],
        ['Never', 'Not ever', 'Always'],
        ['North', 'Arctic', 'South'],
        ['Off', 'Away', 'On'],
        ['Out', 'Outside', 'In'],
        ['Over', 'Above', 'Under'],
        ['Push', 'Shove', 'Pull'],
        ['Receive', 'Get', 'Give'],
        ['Right', 'Correct', 'Wrong'],
        ['Sell', 'Vend', 'Buy'],
        ['Send', 'Dispatch', 'Receive'],
        ['Speak', 'Talk', 'Listen'],
        ['Start', 'Begin', 'Finish'],
        ['Stop', 'Cease', 'Go'],
        ['Take', 'Seize', 'Give'],
        ['Teach', 'Instruct', 'Learn'],
        ['Top', 'Apex', 'Bottom'],
        ['Under', 'Below', 'Over'],
        ['Wake', 'Awaken', 'Sleep'],
        ['Walk', 'Stroll', 'Run'],
        ['Want', 'Desire', 'Reject'],
        ['West', 'Occident', 'East'],
        ['Win', 'Succeed', 'Lose'],
        ['With', 'Alongside', 'Without'],
        ['Yes', 'Affirmative', 'No'],
        ['Zero', 'Naught', 'Infinity'],
        ['Able', 'Capable', 'Unable'],
        ['Accept', 'Receive', 'Reject'],
        ['Active', 'Energetic', 'Lazy'],
        ['Afraid', 'Scared', 'Brave'],
        ['Allow', 'Permit', 'Forbid'],
        ['Answer', 'Reply', 'Question'],
        ['Appear', 'Show', 'Disappear'],
        ['Ask', 'Inquire', 'Answer'],
        ['Attack', 'Assault', 'Defend'],
        ['Awake', 'Conscious', 'Asleep'],
        ['Borrow', 'Take', 'Lend'],
        ['Build', 'Construct', 'Destroy'],
        ['Buy', 'Purchase', 'Sell'],
        ['Calm', 'Peaceful', 'Stormy'],
        ['Careful', 'Cautious', 'Careless'],
        ['Cheerful', 'Happy', 'Gloomy'],
        ['Comfort', 'Ease', 'Discomfort'],
        ['Common', 'Usual', 'Uncommon'],
        ['Connect', 'Join', 'Disconnect'],
        ['Correct', 'Accurate', 'Incorrect'],
        ['Create', 'Invent', 'Destroy'],
        ['Danger', 'Hazard', 'Safety'],
        ['Deep', 'Profound', 'Shallow'],
        ['Defeat', 'Conquer', 'Surrender'],
        ['Depend', 'Rely', 'Distrust'],
        ['Different', 'Distinct', 'Similar'],
        ['Difficult', 'Hard', 'Easy'],
        ['Divide', 'Separate', 'Unite'],
        ['Down', 'Below', 'Up'],
        ['Dusk', 'Twilight', 'Dawn'],
        ['Early', 'Premature', 'Late'],
        ['Educated', 'Learned', 'Uneducated'],
        ['Empty', 'Vacant', 'Full'],
        ['Enjoy', 'Delight', 'Dislike'],
        ['Equal', 'Same', 'Unequal'],
        ['Even', 'Flat', 'Uneven'],
        ['Excuse', 'Pardon', 'Blame'],
        ['Expensive', 'Costly', 'Cheap'],
        ['Fact', 'Reality', 'Fiction'],
        ['Fail', 'Flop', 'Succeed'],
        ['Fair', 'Just', 'Unfair'],
        ['Famous', 'Renowned', 'Obscure'],
        ['Far', 'Distant', 'Near'],
        ['Female', 'Woman', 'Male'],
        ['Finish', 'Complete', 'Start'],
        ['Float', 'Drift', 'Sink'],
        ['Follow', 'Pursue', 'Lead'],
        ['Foolish', 'Silly', 'Wise'],
        ['Forget', 'Neglect', 'Remember'],
        ['Fresh', 'New', 'Stale'],
        ['Friend', 'Companion', 'Enemy'],
        ['Future', 'Tomorrow', 'Past'],
        ['Gain', 'Acquire', 'Lose'],
        ['Giant', 'Huge', 'Tiny'],
        ['Glad', 'Happy', 'Sad'],
        ['Gloomy', 'Dark', 'Bright'],
        ['Grant', 'Allow', 'Deny'],
        ['Guest', 'Visitor', 'Host'],
        ['Guilty', 'Culpable', 'Innocent'],
        ['Happy', 'Joyful', 'Miserable'],
        ['Hate', 'Dislike', 'Love'],
        ['High', 'Tall', 'Low'],
        ['Hope', 'Optimism', 'Despair'],
        ['Hot', 'Warm', 'Cold'],
        ['Humid', 'Damp', 'Dry'],
        ['Hungry', 'Famished', 'Full'],
        ['Ignore', 'Disregard', 'Notice'],
        ['Ill', 'Sick', 'Healthy'],
        ['Include', 'Contain', 'Exclude'],
        ['Increase', 'Grow', 'Decrease'],
        ['Inferior', 'Lesser', 'Superior'],
        ['Innocent', 'Guiltless', 'Guilty'],
        ['Inside', 'Within', 'Outside'],
        ['Interest', 'Curiosity', 'Boredom'],
        ['Join', 'Connect', 'Separate'],
        ['Joy', 'Delight', 'Sorrow'],
        ['Junior', 'Younger', 'Senior'],
        ['Justice', 'Fairness', 'Injustice'],
        ['Keen', 'Eager', 'Apathetic'],
        ['Kind', 'Gentle', 'Cruel'],
        ['Knowledge', 'Wisdom', 'Ignorance'],
        ['Lack', 'Absence', 'Abundance'],
        ['Land', 'Ground', 'Sea'],
        ['Large', 'Big', 'Small'],
        ['Late', 'Delayed', 'Early'],
        ['Lead', 'Guide', 'Follow'],
        ['Lend', 'Loan', 'Borrow'],
        ['Less', 'Fewer', 'More'],
        ['Light', 'Bright', 'Dark'],
        ['Likely', 'Probable', 'Unlikely'],
        ['Little', 'Small', 'Big'],
        ['Live', 'Exist', 'Die'],
        ['Long', 'Lengthy', 'Short'],
        ['Loose', 'Free', 'Tight'],
        ['Love', 'Affection', 'Hate'],
        ['Low', 'Short', 'High'],
        ['Lucky', 'Fortunate', 'Unlucky'],
        ['Major', 'Important', 'Minor'],
        ['Male', 'Boy', 'Female'],
        ['Many', 'Numerous', 'Few'],
        ['Morning', 'Dawn', 'Evening'],
        ['Never', 'At no time', 'Always'],
        ['New', 'Recent', 'Old'],
        ['Night', 'Darkness', 'Day'],
        ['Noisy', 'Loud', 'Quiet'],
        ['Normal', 'Regular', 'Abnormal'],
        ['North', 'Up', 'South'],
        ['Notice', 'Observe', 'Ignore'],
        ['Obey', 'Comply', 'Disobey'],
        ['Often', 'Frequently', 'Seldom'],
        ['Old', 'Aged', 'Young'],
        ['Open', 'Unclosed', 'Closed'],
        ['Opposite', 'Contrary', 'Same'],
        ['Optimist', 'Positive person', 'Pessimist'],
        ['Out', 'Outside', 'In'],
        ['Over', 'Above', 'Under'],
        ['Past', 'Former', 'Future'],
        ['Patient', 'Tolerant', 'Impatient'],
        ['Peace', 'Calm', 'War'],
        ['Permanent', 'Lasting', 'Temporary'],
        ['Plenty', 'Enough', 'Scarcity'],
        ['Poor', 'Needy', 'Rich'],
        ['Positive', 'Good', 'Negative'],
        ['Possible', 'Feasible', 'Impossible'],
        ['Powerful', 'Strong', 'Weak'],
        ['Praise', 'Applaud', 'Criticize'],
        ['Present', 'Gift', 'Absent'],
        ['Private', 'Personal', 'Public'],
        ['Protect', 'Guard', 'Harm'],
        ['Proud', 'Arrogant', 'Humble'],
        ['Pull', 'Drag', 'Push'],
        ['Pure', 'Clean', 'Impure'],
        ['Push', 'Shove', 'Pull'],
        ['Quiet', 'Silent', 'Noisy'],
        ['Rapid', 'Fast', 'Slow'],
        ['Real', 'Actual', 'Fake'],
        ['Receive', 'Get', 'Give'],
        ['Reject', 'Refuse', 'Accept'],
        ['Remember', 'Recall', 'Forget'],
        ['Reply', 'Answer', 'Ask'],
        ['Rich', 'Wealthy', 'Poor'],
        ['Right', 'Correct', 'Left'],
        ['Rough', 'Uneven', 'Smooth'],
        ['Rural', 'Country', 'Urban'],
        ['Sad', 'Unhappy', 'Happy'],
        ['Safe', 'Secure', 'Dangerous'],
        ['Same', 'Identical', 'Different'],
        ['Scared', 'Afraid', 'Brave'],
        ['Scarcity', 'Lack', 'Abundance'],
        ['Sell', 'Trade', 'Buy'],
        ['Senior', 'Older', 'Junior'],
        ['Separate', 'Divide', 'Join'],
        ['Shallow', 'Superficial', 'Deep'],
        ['Sharp', 'Keen', 'Dull'],
        ['Short', 'Brief', 'Long'],
        ['Shy', 'Timid', 'Confident'],
        ['Sick', 'Ill', 'Healthy'],
        ['Silent', 'Quiet', 'Loud'],
        ['Simple', 'Easy', 'Complex'],
        ['Sink', 'Submerge', 'Float'],
        ['Slow', 'Gradual', 'Fast'],
        ['Small', 'Tiny', 'Large'],
        ['Smooth', 'Even', 'Rough'],
        ['Soft', 'Tender', 'Hard'],
        ['Sorrow', 'Sadness', 'Joy'],
        ['Sour', 'Tart', 'Sweet'],
        ['South', 'Down', 'North'],
        ['Start', 'Begin', 'End'],
        ['Stay', 'Remain', 'Go'],
        ['Straight', 'Direct', 'Crooked'],
        ['Strong', 'Powerful', 'Weak'],
        ['Succeed', 'Win', 'Fail'],
        ['Success', 'Victory', 'Failure'],
        ['Summer', 'Warm season', 'Winter'],
        ['Superior', 'Better', 'Inferior'],
        ['Sweet', 'Sugary', 'Sour'],
        ['Take', 'Seize', 'Give'],
        ['Tall', 'High', 'Short'],
        ['Tame', 'Domesticated', 'Wild'],
        ['Temporary', 'Brief', 'Permanent'],
        ['Thick', 'Dense', 'Thin'],
        ['Thin', 'Slim', 'Thick'],
        ['Tight', 'Firm', 'Loose'],
        ['Tiny', 'Minute', 'Huge'],
        ['Top', 'Summit', 'Bottom'],
        ['Tough', 'Strong', 'Tender'],
        ['True', 'Correct', 'False'],
        ['Trust', 'Believe', 'Distrust'],
        ['Ugly', 'Unattractive', 'Beautiful'],
        ['Under', 'Beneath', 'Over'],
        ['Unite', 'Join', 'Separate'],
        ['Up', 'Above', 'Down'],
        ['Urban', 'City', 'Rural'],
        ['Useful', 'Helpful', 'Useless'],
        ['Useless', 'Worthless', 'Useful'],
        ['Vacant', 'Empty', 'Occupied'],
        ['Valid', 'True', 'Invalid'],
        ['Victory', 'Win', 'Defeat'],
        ['Visible', 'Seen', 'Invisible'],
        ['Voluntary', 'Optional', 'Compulsory'],
        ['Wake', 'Awaken', 'Sleep'],
        ['Walk', 'Stroll', 'Run'],
        ['Want', 'Desire', 'Reject'],
        ['Warm', 'Mild', 'Cool'],
        ['Weak', 'Feeble', 'Strong'],
        ['Wealth', 'Riches', 'Poverty'],
        ['West', 'Occident', 'East'],
        ['Wet', 'Damp', 'Dry'],
        ['Whisper', 'Mutter', 'Shout'],
        ['White', 'Pale', 'Black'],
        ['Wild', 'Untamed', 'Tame'],
        ['Win', 'Succeed', 'Lose'],
        ['Winter', 'Cold season', 'Summer'],
        ['Wise', 'Intelligent', 'Foolish'],
        ['Within', 'Inside', 'Outside'],
        ['Without', 'Lacking', 'With'],
        ['Wonder', 'Awe', 'Disinterest'],
        ['Work', 'Labor', 'Rest'],
        ['Worse', 'Inferior', 'Better'],
        ['Worst', 'Poorest', 'Best'],
        ['Wrong', 'Incorrect', 'Right'],
        ['Yes', 'Affirmative', 'No'],
        ['Young', 'Youthful', 'Old'],
        ['Zeal', 'Enthusiasm', 'Apathy'],
        ['Zenith', 'Peak', 'Nadir'],
        // ... (Your full 1000+ words here)
    ];

    let usedWords = [];

    function getRandomWordPair() {
        if (usedWords.length === wordList.length) {
            usedWords = [];
            console.log("All words used, resetting word pool.");
        }
        let availableWords = wordList.filter(wordPair => !usedWords.includes(wordPair[0]));

        if (availableWords.length === 0) {
            console.warn("No available words to pick from. Reusing a random word from the full list as a fallback.");
            return wordList[Math.floor(Math.random() * wordList.length)];
        }

        const randomIndex = Math.floor(Math.random() * availableWords.length);
        const wordPair = availableWords[randomIndex];
        usedWords.push(wordPair[0]);
        return wordPair;
    }

    function updateScore(points) {
        score += points;
        scoreDisplay.textContent = score;
    }

    function provideFeedback(isCorrect) {
        if (isCorrect) {
            mainWordArea.classList.add('correct-feedback');
            correctSound.play();
        } else {
            mainWordArea.classList.add('incorrect-feedback');
            incorrectSound.play();
        }
        setTimeout(() => {
            mainWordArea.classList.remove('correct-feedback', 'incorrect-feedback');
        }, 500);
    }

    function generateGameRound() {
        if (!gameActive) return;

        wordChoicesContainer.innerHTML = '';
        currentRoundWords = { synonym: false, antonym: false };
        currentMainWordData = getRandomWordPair();

        if (!currentMainWordData) {
            console.error("Failed to get a word pair. Ending game.");
            endGame();
            return;
        }
        mainWordDisplay.textContent = currentMainWordData[0];

        const choices = [
            { word: currentMainWordData[1], type: 'synonym' },
            { word: currentMainWordData[2], type: 'antonym' }
        ];

        const distractors = [];
        let numDistractors = 2;
        let attempts = 0;
        const maxAttempts = 50;

        while (distractors.length < numDistractors && attempts < maxAttempts) {
            const randomDistractorPair = wordList[Math.floor(Math.random() * wordList.length)];
            const distractorWord = Math.random() < 0.5 ? randomDistractorPair[1] : randomDistractorPair[2];

            if (distractorWord !== currentMainWordData[0] &&
                distractorWord !== currentMainWordData[1] &&
                distractorWord !== currentMainWordData[2] &&
                !distractors.includes(distractorWord)) {
                distractors.push(distractorWord);
            }
            attempts++;
        }

        distractors.forEach(d => choices.push({ word: d, type: 'none' }));

        choices.sort(() => Math.random() - 0.5);

        choices.forEach((choice, index) => {
            const wordCard = document.createElement('div');
            wordCard.classList.add('word-card');
            wordCard.textContent = choice.word;
            wordCard.setAttribute('draggable', 'true');
            wordCard.dataset.type = choice.type;
            wordCard.id = `draggable-${Date.now()}-${index}`; // More robust unique ID
            wordChoicesContainer.appendChild(wordCard);
        });

        addDragListeners();
    }

    function addDragListeners() {
        const wordCards = document.querySelectorAll('.word-card');
        wordCards.forEach(card => {
            // Desktop drag events
            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.textContent);
                e.dataTransfer.setData('data-type', e.target.dataset.type);
                e.dataTransfer.setData('element-id', e.target.id);
                e.target.classList.add('dragging');
            });

            card.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
            });

            // Mobile touch events
            card.addEventListener('touchstart', (e) => {
                if (!gameActive) return;
                e.preventDefault(); // Prevent scrolling and default touch behavior
                isDraggingTouch = true;
                currentDraggedElementTouch = e.target;

                const touch = e.touches[0];
                const rect = currentDraggedElementTouch.getBoundingClientRect();
                touchOffsetX = touch.clientX - rect.left;
                touchOffsetY = touch.clientY - rect.top;

                // Position the element for dragging
                currentDraggedElementTouch.style.position = 'absolute';
                currentDraggedElementTouch.style.zIndex = '1000';
                currentDraggedElementTouch.style.left = (touch.clientX - touchOffsetX) + 'px';
                currentDraggedElementTouch.style.top = (touch.clientY - touchOffsetY) + 'px';
                currentDraggedElementTouch.classList.add('dragging');

                // Store data for touch drop logic
                currentDraggedElementTouch.dataset.draggedText = e.target.textContent;
                currentDraggedElementTouch.dataset.draggedType = e.target.dataset.type;
                currentDraggedElementTouch.dataset.draggedId = e.target.id;
            });
        });

        // Global touchmove and touchend listeners for dragging outside the card
        document.body.addEventListener('touchmove', (e) => {
            if (!isDraggingTouch || !currentDraggedElementTouch) return;
            e.preventDefault(); // Prevent scrolling while dragging

            const touch = e.touches[0];
            currentDraggedElementTouch.style.left = (touch.clientX - touchOffsetX) + 'px';
            currentDraggedElementTouch.style.top = (touch.clientY - touchOffsetY) + 'px';

            // Visual feedback for drop zones during touch drag
            const dropZones = document.querySelectorAll('.drop-zone');
            let foundDropZone = false;
            dropZones.forEach(zone => {
                const zoneRect = zone.getBoundingClientRect();
                // Check if the center of the dragged element is over the zone
                const elementCenterX = touch.clientX;
                const elementCenterY = touch.clientY;

                if (elementCenterX >= zoneRect.left && elementCenterX <= zoneRect.right &&
                    elementCenterY >= zoneRect.top && elementCenterY <= zoneRect.bottom) {
                    zone.classList.add('hovered');
                    foundDropZone = true;
                } else {
                    zone.classList.remove('hovered');
                }
            });
        });

        document.body.addEventListener('touchend', (e) => {
            if (!isDraggingTouch || !currentDraggedElementTouch) return;
            e.preventDefault(); // Prevent default touch behavior

            isDraggingTouch = false;
            currentDraggedElementTouch.classList.remove('dragging');
            currentDraggedElementTouch.style.position = ''; // Reset position
            currentDraggedElementTouch.style.zIndex = '';    // Reset z-index
            currentDraggedElementTouch.style.left = '';      // Reset left
            currentDraggedElementTouch.style.top = '';       // Reset top

            const dropZones = document.querySelectorAll('.drop-zone');
            let droppedIntoZone = false;
            const touch = e.changedTouches[0]; // The touch that was lifted

            dropZones.forEach(zone => {
                const zoneRect = zone.getBoundingClientRect();
                zone.classList.remove('hovered'); // Remove hover state

                // Check if the touch end point is within the drop zone
                if (touch.clientX >= zoneRect.left && touch.clientX <= zoneRect.right &&
                    touch.clientY >= zoneRect.top && touch.clientY <= zoneRect.bottom) {
                    droppedIntoZone = true;

                    // Simulate drop event logic
                    const draggedWordText = currentDraggedElementTouch.dataset.draggedText;
                    const draggedType = currentDraggedElementTouch.dataset.draggedType;
                    const droppedZoneId = zone.id;

                    const isCorrectSynonymMatch = (draggedWordText === currentMainWordData[1] && droppedZoneId === 'synonymZone');
                    const isCorrectAntonymMatch = (draggedWordText === currentMainWordData[2] && droppedZoneId === 'antonymZone');
                    const isRelevantWord = (draggedWordText === currentMainWordData[1] || draggedWordText === currentMainWordData[2]);

                    if (isCorrectSynonymMatch) {
                        currentRoundWords.synonym = true;
                        updateScore(10);
                        provideFeedback(true);
                        currentDraggedElementTouch.remove();
                    } else if (isCorrectAntonymMatch) {
                        currentRoundWords.antonym = true;
                        updateScore(10);
                        provideFeedback(true);
                        currentDraggedElementTouch.remove();
                    } else if (isRelevantWord) {
                        // Synonym/Antonym dropped in wrong zone, do not remove.
                        updateScore(-5);
                        provideFeedback(false);
                        // The element's position was reset above, so it will visually snap back.
                    } else {
                        // Distractor or unrelated word dropped, remove it.
                        updateScore(-5);
                        provideFeedback(false);
                        currentDraggedElementTouch.remove();
                    }

                    if (currentRoundWords.synonym && currentRoundWords.antonym) {
                        setTimeout(generateGameRound, 700);
                    }
                }
            });

            // If dropped outside any valid zone, and it was a relevant word, it snaps back.
            // If it was a distractor and dropped outside, it should also disappear.
            // This is handled by the `currentDraggedElementTouch.remove()` above if it's a distractor.
            // If it's a relevant word dropped outside, it just snaps back to its original place
            // because its position styles are reset and it was never removed.
            currentDraggedElementTouch = null; // Clear the dragged element reference
        });
    }

    function addDropListeners() {
        // Desktop drop events (these remain as they are for mouse users)
        const dropZones = document.querySelectorAll('.drop-zone');
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('hovered');
            });

            zone.addEventListener('dragleave', (e) => {
                zone.classList.remove('hovered');
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('hovered');

                if (!gameActive || !currentMainWordData) return;

                const draggedWordText = e.dataTransfer.getData('text/plain');
                const draggedType = e.dataTransfer.getData('data-type');
                const draggedElementId = e.dataTransfer.getData('element-id');
                const droppedZoneId = zone.id;

                const draggedElement = document.getElementById(draggedElementId);

                // Determine if it's the correct synonym or antonym for the current main word
                const isCorrectSynonymMatch = (draggedWordText === currentMainWordData[1] && droppedZoneId === 'synonymZone');
                const isCorrectAntonymMatch = (draggedWordText === currentMainWordData[2] && droppedZoneId === 'antonymZone');

                // Check if the dragged word is the actual synonym or antonym for the current main word
                const isRelevantWord = (draggedWordText === currentMainWordData[1] || draggedWordText === currentMainWordData[2]);

                if (isCorrectSynonymMatch) {
                    currentRoundWords.synonym = true;
                    updateScore(10);
                    provideFeedback(true);
                    if (draggedElement) draggedElement.remove(); // Remove correct word
                } else if (isCorrectAntonymMatch) {
                    currentRoundWords.antonym = true;
                    updateScore(10);
                    provideFeedback(true);
                    if (draggedElement) draggedElement.remove(); // Remove correct word
                } else {
                    // Its the wrong answer.
                    updateScore(-5);
                    provideFeedback(false);
                }

                // Only proceed to the next round if both the correct synonym AND antonym have been found and dropped.
                if (currentRoundWords.synonym && currentRoundWords.antonym) {
                    setTimeout(generateGameRound, 700);
                }
            });
        });
    }

    function startGame() {
        score = 0;
        timeLeft = 60;
        scoreDisplay.textContent = score;
        timerDisplay.textContent = timeLeft;
        usedWords = [];
        gameActive = true;
        startButton.style.display = 'none';
        resetButton.style.display = 'none';
        gameOverModal.style.display = 'none'; // Ensure modal is hidden on start

        generateGameRound();

        if (timerInterval) {
            clearInterval(timerInterval);
        }
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
    }

    function endGame() {
        gameActive = false;
        clearInterval(timerInterval);
        finalScoreDisplay.textContent = score;
        gameOverModal.style.display = 'flex';
        resetButton.style.display = 'block';
    }

    // Initial setup when the page loads
    startButton.style.display = 'block';
    resetButton.style.display = 'none';
    gameOverModal.style.display = 'none';
    mainWordDisplay.textContent = "Click 'Start Game'";
    wordChoicesContainer.innerHTML = ''; // Ensure choices area is empty

    startButton.addEventListener('click', startGame);
    resetButton.addEventListener('click', startGame);
    closeModalButton.addEventListener('click', () => {
        gameOverModal.style.display = 'none';
    });

    // Initialize both desktop drag/drop and mobile touch handlers
    addDropListeners(); // This sets up desktop drop zones
    addDragListeners(); // This sets up desktop drag and mobile touch start
    // Mobile touchmove and touchend are attached to document.body directly within addDragListeners for global tracking
});
