import { pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.6';

const storyArea = document.getElementById('story-area');
const userInput = document.getElementById('user-input');
const submitBtn = document.getElementById('submit-btn');
const copyBtn = document.getElementById('copy-btn');
const resetBtn = document.getElementById('reset-btn');
const editBtn = document.getElementById('edit-btn');
const saveBtn = document.getElementById('save-btn');
const userInputWrapper = document.getElementById('user-input-wrapper');
const submitBtnWrapper = document.getElementById('submit-btn-wrapper');
const status = document.getElementById('status');
const errorMessage = document.getElementById('error-message');

const loadModelBtn = document.getElementById('load-model-btn');
const gameUiContainer = document.getElementById('game-ui-container');

const STORY_KEY = 'storymaker_story_content';
const INPUT_KEY = 'storymaker_user_input';
const loadingOverlay = document.getElementById('loading-overlay');
const generatingOverlay = document.getElementById('generating-overlay');
const generatingStatus = document.getElementById('generating-status');

let generator = null;

// List of sarcastic/funny/ironic messages to show while generating
const generationMessages = [
    "Spinning words into gold... just kidding, still processing.",
    "Teaching the AI to write better than Shakespeare... almost there.",
    "Your story is being crafted by digital elves. Please wait.",
    "The AI is having an existential crisis. Give it a moment.",
    "Counting the words... they're multiplying rapidly!",
    "Generating plot twists that even I didn't see coming.",
    "Consulting the ancient scrolls of storytelling.",
    "The AI is thinking... surprisingly, it's not about food.",
    "Summoning creativity from the void. Almost complete!",
    "Polishing your story with the finest digital polish.",
    "Reticulating splines... whatever that means.",
    "The AI is having a coffee break. Be patient.",
    "Weaving narrative threads with the precision of a digital spider.",
    "Your story is more interesting than cat videos, promise.",
    "AI is doing mental push-ups to generate your story.",
    "Consulting the Oracle of Plot Holes for guidance...",
    "AI is currently in deep thought about your story's meaning.",
    "The AI is taking notes on your plot to use in its own story later.",
    "Warning: May contain traces of digital creativity.",
    "Your story is being proofread by grammar robots."
];

// Initialize messageIndex to a random value once when the script loads
let messageIndex = Math.floor(Math.random() * generationMessages.length);

// Load story and input from localStorage on page load
const savedStory = localStorage.getItem(STORY_KEY);
const savedInput = localStorage.getItem(INPUT_KEY);

if (savedStory) {
    storyArea.value = savedStory;
} else {
    storyArea.value = 'In a world where the sky is made of glass, a young girl named Elara discovers a hidden power within her. ';
}

if (savedInput) {
    userInput.value = savedInput;
}

// Save story and input to localStorage before the page unloads
window.addEventListener('beforeunload', () => {
    localStorage.setItem(STORY_KEY, storyArea.value);
    localStorage.setItem(INPUT_KEY, userInput.value);
});

loadModelBtn.addEventListener('click', () => {
    loadModelBtn.classList.add('d-none');
    loadingOverlay.classList.remove('d-none');
    initializeModel();
});

async function initializeModel() {
    errorMessage.classList.add('d-none');
    errorMessage.textContent = '';
    userInput.disabled = true;
    submitBtn.disabled = true;
    status.textContent = 'Loading model...';
    try {
        generator = await pipeline('text2text-generation', 'Xenova/LaMini-T5-738M', {
            progress_callback: (progress) => {
                const percentage = progress.progress ? Math.round(progress.progress) : 0;
                status.textContent = `Loading model... (${percentage}%)`;
            }
        });
        status.textContent = 'Model loaded. Ready to play!';
        userInput.disabled = false;
        submitBtn.disabled = false;
        loadingOverlay.classList.add('d-none');
        gameUiContainer.classList.remove('d-none');
    } catch (error) {
        errorMessage.textContent = 'Failed to load model. Please try refreshing the page. If the problem persists, your browser might not support the model.';
        errorMessage.classList.remove('d-none');
        console.error(error);
        userInput.disabled = true;
        submitBtn.disabled = true;
        loadingOverlay.classList.add('d-none');
        loadModelBtn.classList.remove('d-none');
        status.textContent = 'Model loading failed.';
    }
}

function generateStory(prompt) {
    errorMessage.classList.add('d-none');
    errorMessage.textContent = '';
    generatingOverlay.classList.remove('d-none'); // Show the generating overlay immediately
    userInput.disabled = true;
    submitBtn.disabled = true;
    
    // Show the current message and advance the index for next time
    generatingStatus.textContent = generationMessages[messageIndex]; // Show the current message immediately
    messageIndex = (messageIndex + 1) % generationMessages.length;
    
    const statusInterval = setInterval(() => {
        generatingStatus.textContent = generationMessages[messageIndex];
        messageIndex = (messageIndex + 1) % generationMessages.length;
    }, 2000); // Change message every 2 seconds
    
    // Use setTimeout to ensure UI is updated before generator call
    setTimeout(async () => {
        const fullPrompt = `You are a fantasy story writer. Continue the following story: ${prompt}`;
        try {
            const result = await generator(fullPrompt, {
                max_new_tokens: 100,
                no_repeat_ngram_size: 2,
                early_stopping: true,
            });
            const generatedText = result[0].generated_text;
            storyArea.value += generatedText;
        } catch (error) {
            errorMessage.textContent = 'Error generating story. Please try again. If the problem persists, the model might be unavailable.';
            errorMessage.classList.remove('d-none');
            console.error(error);
        } finally {
            // Clear the rotating messages and set final status
            clearInterval(statusInterval);
            generatingStatus.textContent = 'Ready to continue!';
            // Briefly show the final message before hiding the overlay
            setTimeout(() => {
                generatingOverlay.classList.add('d-none'); // Hide the generating overlay
                status.textContent = 'Ready to continue!'; // Update the main status as well
                userInput.disabled = false;
                submitBtn.disabled = false;
            }, 500); // Show final message for 500ms before hiding
        }
    }, 100); // Small delay to ensure UI updates
}

submitBtnWrapper.addEventListener('click', () => {
    if (submitBtn.disabled) {
        if (!storyArea.readOnly) {
            errorMessage.textContent = 'Please save your changes before continuing the story.';
            errorMessage.classList.remove('d-none');
        } else {
            errorMessage.textContent = 'Please wait for the current operation to complete.';
            errorMessage.classList.remove('d-none');
        }
        return;
    }
    const userText = userInput.value.trim();
    if (userText) {
        // Correct spelling in user's input before adding to story
        storyArea.value += userText + ' ';
        generateStory(storyArea.value);
        userInput.value = '';
    }
});

userInputWrapper.addEventListener('click', () => {
    if (userInput.disabled) {
        if (!storyArea.readOnly) {
            errorMessage.textContent = 'Please save your changes before continuing the story.';
            errorMessage.classList.remove('d-none');
        } else {
            errorMessage.textContent = 'Please wait for the current operation to complete.';
            errorMessage.classList.remove('d-none');
        }
    }
});

copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(storyArea.value);
        const originalInnerHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="bi bi-clipboard"></i> Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = originalInnerHTML;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy: ', err);
        alert('Failed to copy story to clipboard.');
    }
});

resetBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset the story? This action cannot be undone.')) {
        storyArea.value = 'In a world where the sky is made of glass, a young girl named Elara discovers a hidden power within her. ';
        userInput.value = '';
        localStorage.removeItem(STORY_KEY);
        localStorage.removeItem(INPUT_KEY);
        status.textContent = 'Story reset!';
    }
});

editBtn.addEventListener('click', () => {
    storyArea.readOnly = false;
    editBtn.classList.add('d-none');
    saveBtn.classList.remove('d-none');
    submitBtn.disabled = true;
    userInput.disabled = true;
});

saveBtn.addEventListener('click', () => {
    storyArea.readOnly = true;
    editBtn.classList.remove('d-none');
    saveBtn.classList.add('d-none');
    submitBtn.disabled = false;
    userInput.disabled = false;
});
