/**
 * Conversion Quest - Main Game Logic
 * Handles game state, UI interactions, and flow
 */

const Game = (function() {
    'use strict';

    // Game state
    let state = {
        currentScreen: 'start',
        category: null,
        level: 1,
        currentQuestion: null,
        correctCount: 0,
        totalNeeded: 10,
        combo: 0,
        hintUsed: false,
        questionsInLevel: 0
    };

    // DOM Elements
    const elements = {};

    // Category icons
    const categoryIcons = {
        length: '📏',
        weight: '⚖️',
        volume: '🧪'
    };

    // Character expressions
    const expressions = {
        happy: '😊',
        excited: '🤩',
        thinking: '🤔',
        celebrating: '🥳',
        neutral: '🙂',
        encouraging: '💪'
    };

    // Character accessories by level
    const accessories = {
        1: '🎓',
        2: '⭐',
        3: '👑',
        4: '🦸',
        5: '🚀'
    };

    // Encouraging messages
    const messages = {
        start: ["Let's go!", "You got this!", "Ready to learn?"],
        correct: ["Awesome!", "Great job!", "Perfect!", "Keep it up!", "Brilliant!"],
        incorrect: ["Try again!", "You can do it!", "Keep going!", "Learn from mistakes!"],
        combo: ["On fire! 🔥", "Amazing!", "Unstoppable!", "Combo master!"],
        levelComplete: ["Level up!", "Fantastic!", "You did it!"]
    };

    /**
     * Cache DOM elements
     */
    function cacheElements() {
        // Screens
        elements.screens = {
            start: document.getElementById('start-screen'),
            game: document.getElementById('game-screen'),
            levelComplete: document.getElementById('level-complete-screen'),
            badge: document.getElementById('badge-screen'),
            badges: document.getElementById('badges-screen')
        };

        // Start screen
        elements.categoryBtns = document.querySelectorAll('.category-btn');
        elements.totalStars = document.getElementById('total-stars');
        elements.badgesCount = document.getElementById('badges-count');
        elements.viewBadgesBtn = document.getElementById('view-badges-btn');
        elements.resetProgressBtn = document.getElementById('reset-progress-btn');
        elements.totalStarsDisplay = document.getElementById('total-stars-display');
        elements.starsContainer = elements.totalStarsDisplay.querySelector('.stars-container');

        // Audio controls
        elements.muteBtn = document.getElementById('mute-btn');
        elements.musicBtn = document.getElementById('music-btn');
        elements.muteIcon = elements.muteBtn?.querySelector('.mute-icon');

        // Game screen
        elements.backBtn = document.getElementById('back-btn');
        elements.currentLevel = document.getElementById('current-level');
        elements.correctCount = document.getElementById('correct-count');
        elements.comboDisplay = document.getElementById('combo-display');
        elements.comboCount = elements.comboDisplay.querySelector('.combo-count');
        elements.questionText = document.getElementById('question-text');
        elements.hintBtn = document.getElementById('hint-btn');
        elements.hintText = document.getElementById('hint-text');
        elements.answerForm = document.getElementById('answer-form');
        elements.answerInput = document.getElementById('answer-input');
        elements.submitBtn = document.getElementById('submit-btn');
        elements.feedback = document.getElementById('feedback');
        
        // Character elements
        elements.character = document.getElementById('character');
        elements.characterMouth = document.getElementById('character-mouth');
        elements.characterAccessory = document.getElementById('character-accessory');
        elements.characterBubble = document.getElementById('character-bubble');
        elements.bubbleText = document.getElementById('bubble-text');
        elements.questionCategoryIcon = document.getElementById('question-category-icon');

        // Level complete screen
        elements.starsEarnedDisplay = document.getElementById('stars-earned-display');
        elements.levelCompleteMessage = document.getElementById('level-complete-message');
        elements.nextLevelBtn = document.getElementById('next-level-btn');
        elements.retryLevelBtn = document.getElementById('retry-level-btn');

        // Badge screen
        elements.badgeIcon = document.getElementById('badge-icon');
        elements.badgeName = document.getElementById('badge-name');
        elements.badgeDesc = document.getElementById('badge-desc');
        elements.continueBtn = document.getElementById('continue-btn');

        // Badges collection
        elements.badgesBackBtn = document.getElementById('badges-back-btn');
        elements.badgeStatuses = {
            'length-1': document.getElementById('badge-length-1'),
            'length-2': document.getElementById('badge-length-2'),
            'weight-1': document.getElementById('badge-weight-1'),
            'weight-2': document.getElementById('badge-weight-2'),
            'volume-1': document.getElementById('badge-volume-1'),
            'volume-2': document.getElementById('badge-volume-2')
        };

        // Confetti
        elements.confettiCanvas = document.getElementById('confetti-canvas');
    }

    /**
     * Show a specific screen
     */
    function showScreen(screenName) {
        Object.values(elements.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        
        const screen = elements.screens[screenName];
        if (screen) {
            screen.classList.add('active');
            state.currentScreen = screenName;
            
            // Focus management for accessibility
            const firstFocusable = screen.querySelector('button, input, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable && screenName !== 'game') {
                setTimeout(() => firstFocusable.focus(), 100);
            }
        }
    }

    /**
     * Update progress display on start screen
     */
    function updateProgressDisplay() {
        elements.totalStars.textContent = Rewards.getTotalStars();
        elements.badgesCount.textContent = `${Rewards.getBadgeCount()} / ${Rewards.getTotalBadges()} badges collected`;
    }

    /**
     * Update character expression
     */
    function setCharacterExpression(expression) {
        if (!elements.character || !elements.characterMouth) return;
        
        elements.characterMouth.textContent = expressions[expression] || expressions.neutral;
        elements.character.className = 'character ' + expression;
    }

    /**
     * Update character accessory based on level
     */
    function updateCharacterAccessory() {
        if (!elements.characterAccessory) return;
        elements.characterAccessory.textContent = accessories[state.level] || '🎓';
    }

    /**
     * Show character speech bubble
     */
    function showCharacterBubble(text, duration = 2000) {
        if (!elements.characterBubble || !elements.bubbleText) return;
        
        elements.bubbleText.textContent = text;
        elements.characterBubble.classList.add('visible');
        
        if (duration > 0) {
            setTimeout(() => {
                elements.characterBubble.classList.remove('visible');
            }, duration);
        }
    }

    /**
     * Hide character speech bubble
     */
    function hideCharacterBubble() {
        if (elements.characterBubble) {
            elements.characterBubble.classList.remove('visible');
        }
    }

    /**
     * Update question category icon
     */
    function updateCategoryIcon() {
        if (!elements.questionCategoryIcon) return;
        elements.questionCategoryIcon.textContent = categoryIcons[state.category] || '📏';
    }

    /**
     * Play sound and show character reaction for correct answer
     */
    function playCorrectFeedback() {
        SoundManager.playCorrect();
        setCharacterExpression('excited');
        showCharacterBubble(getRandomMessage('correct'), 1500);
        
        // Character animation
        if (elements.character) {
            elements.character.classList.add('happy');
            setTimeout(() => elements.character.classList.remove('happy'), 500);
        }
    }

    /**
     * Play sound and show character reaction for incorrect answer
     */
    function playIncorrectFeedback() {
        SoundManager.playIncorrect();
        setCharacterExpression('encouraging');
        showCharacterBubble(getRandomMessage('incorrect'), 2000);
    }

    /**
     * Get random message from category
     */
    function getRandomMessage(category) {
        const msgs = messages[category] || messages.start;
        return msgs[Math.floor(Math.random() * msgs.length)];
    }

    /**
     * Start a new game with the selected category
     */
    function startGame(category) {
        state.category = category;
        const progress = Rewards.getCategoryProgress(category);
        state.level = progress.level;
        state.correctCount = 0;
        state.combo = 0;
        state.questionsInLevel = 0;

        updateGameUI();
        showScreen('game');
        generateNewQuestion();
        
        // Initialize audio on first user interaction
        SoundManager.init();
        
        // Show encouraging message
        showCharacterBubble(getRandomMessage('start'), 2000);

        // Focus on answer input
        setTimeout(() => elements.answerInput.focus(), 100);
    }

    /**
     * Update game UI elements
     */
    function updateGameUI() {
        elements.currentLevel.textContent = state.level;
        elements.correctCount.textContent = state.correctCount;
        updateComboDisplay();
    }

    /**
     * Update combo display
     */
    function updateComboDisplay() {
        elements.comboCount.textContent = state.combo;
        
        if (state.combo >= 3) {
            elements.comboDisplay.classList.add('visible');
            if (state.combo >= 5) {
                elements.comboDisplay.classList.add('hot');
            }
        } else {
            elements.comboDisplay.classList.remove('visible', 'hot');
        }
    }

    /**
     * Generate a new question
     */
    function generateNewQuestion() {
        state.currentQuestion = Questions.generateQuestion(state.category, state.level);
        state.hintUsed = false;

        elements.questionText.textContent = state.currentQuestion.question;
        elements.hintText.textContent = '';
        elements.hintText.classList.remove('visible');
        elements.hintBtn.disabled = false;
        elements.answerInput.value = '';
        elements.answerInput.className = 'answer-input';
        elements.feedback.textContent = '';
        elements.feedback.className = 'feedback';
        
        // Update visual elements
        updateCategoryIcon();
        updateCharacterAccessory();
        setCharacterExpression('thinking');
        hideCharacterBubble();
        
        elements.answerInput.focus();
    }

    /**
     * Show hint
     */
    function showHint() {
        if (state.currentQuestion && !state.hintUsed) {
            elements.hintText.textContent = state.currentQuestion.hint;
            elements.hintText.classList.add('visible');
            state.hintUsed = true;
            elements.hintBtn.disabled = true;
            SoundManager.playHint();
            showCharacterBubble("💡 Here's a hint...", 2500);
        }
    }

    /**
     * Handle answer submission
     */
    function submitAnswer(userAnswer) {
        if (!state.currentQuestion) return;

        const correct = Questions.isAnswerCorrect(userAnswer, state.currentQuestion.answer);
        state.questionsInLevel++;

        if (correct) {
            handleCorrectAnswer();
        } else {
            handleIncorrectAnswer();
        }

        // Update stats
        Rewards.updateStats(correct, state.combo);

        // Check for level completion
        if (state.correctCount >= state.totalNeeded) {
            setTimeout(() => completeLevel(), 1500);
        } else {
            setTimeout(() => generateNewQuestion(), 1500);
        }
    }

    /**
     * Handle correct answer
     */
    function handleCorrectAnswer() {
        state.correctCount++;
        state.combo++;

        elements.answerInput.classList.add('success');
        elements.feedback.textContent = `🎉 Correct! ${state.correctCount} / ${state.totalNeeded}`;
        elements.feedback.className = 'feedback correct';

        updateGameUI();

        // Play sound and show character reaction
        playCorrectFeedback();

        // Combo feedback
        if (state.combo >= 3) {
            SoundManager.playCombo(state.combo);
            showCharacterBubble(getRandomMessage('combo'), 1500);
            fireConfetti(50);
        }

        // Small confetti for combos
        if (state.combo >= 3) {
            fireConfetti(50);
        }
    }

    /**
     * Handle incorrect answer
     */
    function handleIncorrectAnswer() {
        state.combo = 0;

        elements.answerInput.classList.add('error');
        elements.feedback.textContent = `Not quite. The answer was ${state.currentQuestion.answer}`;
        elements.feedback.className = 'feedback incorrect';

        updateComboDisplay();
        
        // Play sound and show character reaction
        playIncorrectFeedback();
    }

    /**
     * Complete the current level
     */
    function completeLevel() {
        const starsEarned = Rewards.calculateStars(state.correctCount, state.totalNeeded);
        const result = Rewards.updateCategoryProgress(state.category, state.level, starsEarned);

        // Display stars
        let starsDisplay = '';
        for (let i = 0; i < starsEarned; i++) {
            starsDisplay += '⭐';
        }
        elements.starsEarnedDisplay.textContent = starsDisplay;

        // Display message based on performance
        const gradeInfo = Rewards.getGradeLabel(starsEarned);
        elements.levelCompleteMessage.textContent = gradeInfo.description;

        // Play level complete sound and show celebration
        SoundManager.playLevelComplete();
        SoundManager.playStarEarned(starsEarned);
        setCharacterExpression('celebrating');
        showCharacterBubble(getRandomMessage('levelComplete'), 2000);

        // Handle badge unlocks
        if (result.newBadges.length > 0) {
            // Show badge screen first
            showBadgeEarned(result.newBadges[0]);
            return;
        }

        showScreen('levelComplete');
    }

    /**
     * Show badge earned screen
     */
    function showBadgeEarned(badge) {
        elements.badgeIcon.textContent = badge.icon;
        elements.badgeName.textContent = badge.name;
        elements.badgeDesc.textContent = badge.description;

        SoundManager.playBadgeEarned();
        fireConfetti(150);
        setCharacterExpression('celebrating');
        showScreen('badge');
    }

    /**
     * Go to next level
     */
    function nextLevel() {
        if (state.level < Questions.getMaxLevel()) {
            state.level++;
            state.correctCount = 0;
            state.combo = 0;
            state.questionsInLevel = 0;
            
            updateGameUI();
            showScreen('game');
            generateNewQuestion();
        } else {
            // Max level reached, go back to start
            showScreen('start');
            updateProgressDisplay();
        }
    }

    /**
     * Retry current level
     */
    function retryLevel() {
        state.correctCount = 0;
        state.combo = 0;
        state.questionsInLevel = 0;
        
        updateGameUI();
        showScreen('game');
        generateNewQuestion();
    }

    /**
     * Update badges collection display
     */
    function updateBadgesDisplay() {
        const allBadges = Rewards.getAllBadges();
        const unlockedBadges = Rewards.getUnlockedBadges().map(b => b.id);
        
        Object.keys(elements.badgeStatuses).forEach(badgeId => {
            const statusEl = elements.badgeStatuses[badgeId];
            const badgeItem = statusEl.closest('.badge-item');
            
            if (unlockedBadges.includes(badgeId)) {
                statusEl.textContent = 'Unlocked!';
                badgeItem.classList.add('unlocked');
            } else {
                statusEl.textContent = 'Locked';
                badgeItem.classList.remove('unlocked');
            }
        });
    }

    /**
     * Fire confetti effect
     */
    function fireConfetti(particleCount) {
        const canvas = elements.confettiCanvas;
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const colors = ['#6c5ce7', '#00b894', '#fdcb6e', '#e17055', '#74b9ff', '#a29bfe'];
        const particles = [];
        
        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: canvas.width / 2,
                y: canvas.height / 2,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15 - 5,
                size: Math.random() * 10 + 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random - 0.5) * 10,
                gravity: 0.3,
                drag: 0.96
            });
        }
        
        let animationFrame;
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            let activeParticles = 0;
            
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.gravity;
                p.vx *= p.drag;
                p.vy *= p.drag;
                p.rotation += p.rotationSpeed;
                
                if (p.y < canvas.height && p.x > 0 && p.x < canvas.width) {
                    activeParticles++;
                    
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                    ctx.restore();
                }
            });
            
            if (activeParticles > 0) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                cancelAnimationFrame(animationFrame);
            }
        }
        
        animate();
    }

    /**
     * Reset all progress
     */
    function resetProgress() {
        if (confirm('Are you sure you want to reset all your progress? This cannot be undone!')) {
            Rewards.resetProgress();
            updateProgressDisplay();
            showScreen('start');
        }
    }

    /**
     * Set up event listeners
     */
    function setupEventListeners() {
        // Category selection
        elements.categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                SoundManager.playClick();
                const category = btn.dataset.category;
                startGame(category);
            });
        });

        // Audio controls
        if (elements.muteBtn && elements.muteIcon) {
            elements.muteBtn.addEventListener('click', () => {
                const isMuted = SoundManager.toggleMute();
                elements.muteIcon.textContent = isMuted ? '🔇' : '🔊';
                elements.muteBtn.classList.toggle('muted', isMuted);
                SoundManager.playClick();
            });
        }

        if (elements.musicBtn) {
            elements.musicBtn.addEventListener('click', () => {
                if (SoundManager.isMusicEnabled()) {
                    SoundManager.stopMusic();
                    elements.musicBtn.classList.remove('music-enabled');
                } else {
                    SoundManager.startMusic();
                    elements.musicBtn.classList.add('music-enabled');
                }
                SoundManager.playClick();
            });
        }

        // Back button
        elements.backBtn.addEventListener('click', () => {
            SoundManager.playClick();
            showScreen('start');
            updateProgressDisplay();
        });

        // Hint button
        elements.hintBtn.addEventListener('click', () => {
            SoundManager.playClick();
            showHint();
        });

        // Answer form
        elements.answerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const answer = parseFloat(elements.answerInput.value);
            if (!isNaN(answer)) {
                submitAnswer(answer);
            }
        });

        // Level complete buttons
        elements.nextLevelBtn.addEventListener('click', () => {
            SoundManager.playClick();
            nextLevel();
        });
        elements.retryLevelBtn.addEventListener('click', () => {
            SoundManager.playClick();
            retryLevel();
        });

        // Badge continue button
        elements.continueBtn.addEventListener('click', () => {
            SoundManager.playClick();
            showScreen('levelComplete');
        });

        // Badges screen buttons
        elements.viewBadgesBtn.addEventListener('click', () => {
            SoundManager.playClick();
            updateBadgesDisplay();
            showScreen('badges');
        });

        elements.badgesBackBtn.addEventListener('click', () => {
            SoundManager.playClick();
            showScreen('start');
        });

        // Reset progress
        elements.resetProgressBtn.addEventListener('click', () => {
            SoundManager.playClick();
            resetProgress();
        });

        // Handle window resize for confetti
        window.addEventListener('resize', () => {
            elements.confettiCanvas.width = window.innerWidth;
            elements.confettiCanvas.height = window.innerHeight;
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Enter to submit when in game screen
            if (state.currentScreen === 'game' && e.key === 'Enter' && document.activeElement !== elements.answerInput) {
                elements.answerForm.dispatchEvent(new Event('submit'));
            }
            
            // Escape to go back or close tooltip
            if (e.key === 'Escape') {
                if (state.currentScreen === 'game') {
                    elements.backBtn.click();
                } else {
                    // Close tooltip if open
                    elements.totalStarsDisplay.classList.remove('tooltip-active');
                }
            }
        });

        // Toggle tooltip on click (for mobile)
        elements.starsContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            elements.totalStarsDisplay.classList.toggle('tooltip-active');
        });

        // Close tooltip when clicking outside
        document.addEventListener('click', () => {
            elements.totalStarsDisplay.classList.remove('tooltip-active');
        });
    }

    /**
     * Initialize the game
     */
    function init() {
        cacheElements();
        Rewards.init();
        setupEventListeners();
        updateProgressDisplay();
        
        // Initialize character
        setCharacterExpression('neutral');
        updateCharacterAccessory();
        
        showScreen('start');

        console.log('🎮 Conversion Quest loaded! Ready to play!');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public API (mostly for debugging)
    return {
        getState: () => state,
        init
    };

})();
