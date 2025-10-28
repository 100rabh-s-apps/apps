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
const modelSelect = document.getElementById('model-select');
const customModelInput = document.getElementById('custom-model-input');
const customModelContainer = document.getElementById('custom-model-container');
const taskTypeSelect = document.getElementById('task-type-select');
const taskTypeContainer = document.getElementById('task-type-container');
const gameUiContainer = document.getElementById('game-ui-container');

// Set initial state based on current selections
if (taskTypeContainer) {
    if (modelSelect.value && modelSelect.value !== 'custom') {
        // If a model is already selected (like the default recommended model) and it's not 'custom', hide task type
        taskTypeContainer.classList.add('d-none');
    } else {
        // If custom model is selected or no specific model, show task type
        taskTypeContainer.classList.remove('d-none');
    }
}

if (customModelContainer) {
    if (modelSelect.value === 'custom') {
        // If 'custom' is selected, show the custom model input
        customModelContainer.classList.remove('d-none');
    } else {
        // Otherwise, hide the custom model input
        customModelContainer.classList.add('d-none');
    }
}

// Add event listener to model select to show/hide task type and custom model input based on selection
modelSelect.addEventListener('change', function() {
    if (this.value === 'custom') {
        // If 'custom' is selected, show both custom model input and task type selector
        if (customModelContainer) {
            customModelContainer.classList.remove('d-none');
        }
        if (taskTypeContainer) {
            taskTypeContainer.classList.remove('d-none');
        }
    } else {
        // If a predefined model is selected, hide custom model input and hide task type selector
        if (customModelContainer) {
            customModelContainer.classList.add('d-none');
        }
        if (taskTypeContainer) {
            taskTypeContainer.classList.add('d-none');
        }
    }
});

// Add event listener to custom model input to update task type visibility
customModelInput.addEventListener('input', function() {
    if (this.value.trim() !== '') {
        // If custom model is being entered, ensure task type selector is visible
        if (taskTypeContainer) {
            taskTypeContainer.classList.remove('d-none');
        }
    }
});

const STORY_KEY = 'storymaker_story_content';
const INPUT_KEY = 'storymaker_user_input';
const loadingOverlay = document.getElementById('loading-overlay');
const generatingOverlay = document.getElementById('generating-overlay');
const generatingStatus = document.getElementById('generating-status');

let generator = null;
let currentModel = null;  // Store the currently loaded model name
let currentTask = null;   // Store the task type for the current model

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
    
    let selectedModel = modelSelect.value;
    // Use custom model if 'custom' is selected in dropdown and custom model is provided
    if (selectedModel === 'custom' && customModelInput.value.trim() !== '') {
        selectedModel = customModelInput.value.trim();
    } else if (selectedModel === 'custom' && customModelInput.value.trim() === '') {
        // If 'custom' is selected but no custom model is entered, show error
        errorMessage.textContent = 'Please enter a custom model name.';
        errorMessage.classList.remove('d-none');
        console.error('Custom model selected but no model name provided');
        loadingOverlay.classList.add('d-none');
        loadModelBtn.classList.remove('d-none');
        status.textContent = 'No model name provided.';
        return;
    }
    
    // If no model is selected (neither from dropdown nor custom input), show error
    if (!selectedModel || selectedModel === 'custom') {
        errorMessage.textContent = 'Please select a model or enter a custom model name.';
        errorMessage.classList.remove('d-none');
        console.error('No model selected');
        loadingOverlay.classList.add('d-none');
        loadModelBtn.classList.remove('d-none');
        status.textContent = 'No model selected.';
        return;
    }
    
    status.textContent = `Loading model: ${selectedModel}...`;
    
    try {
        // Check if the selected model is not suitable for our text continuation task
        if (selectedModel.toLowerCase().includes('vit-gpt2')) {
            errorMessage.textContent = 'ViT-GPT2 model is designed for image captioning, not text continuation. Please select a different model.';
            errorMessage.classList.remove('d-none');
            console.error('Invalid model selected for text continuation task');
            loadingOverlay.classList.add('d-none');
            loadModelBtn.classList.remove('d-none');
            status.textContent = 'Please select a different model.';
            return; // Exit early without loading the model
        }
        
        // Use custom task type if using a custom model, otherwise use auto-detection
        let task;
        if (customModelInput.value.trim() !== '') {
            task = taskTypeSelect.value;
        } else {
            // Auto-detect task based on model name for models selected from dropdown
            if (selectedModel.toLowerCase().includes('gpt2')) {
                task = 'text-generation';
            } else if (selectedModel.toLowerCase().includes('distilbart')) {
                task = 'summarization';
            } else if (selectedModel.toLowerCase().includes('phi')) {
                task = 'text-generation'; // Phi models typically use text-generation
            } else if (selectedModel.toLowerCase().includes('bart')) {
                task = 'summarization'; // BART models are often used for summarization
            } else if (selectedModel.toLowerCase().includes('t5') && selectedModel.toLowerCase().includes('flan')) {
                task = 'text2text-generation'; // Flan-T5 models
            } else if (selectedModel.toLowerCase().includes('t5') && !selectedModel.toLowerCase().includes('flan')) {
                task = 'text2text-generation'; // Standard T5 models
            } else if (selectedModel.toLowerCase().includes('lamini') && !selectedModel.toLowerCase().includes('gpt')) {
                task = 'text2text-generation'; // Lamini T5-based models
            } else if (selectedModel.toLowerCase().includes('text-davinci')) {
                task = 'text-generation'; // Text Davinci models are for text generation
            } else if (selectedModel.toLowerCase().includes('llama2.c-stories')) {
                task = 'text-generation'; // Llama2.c stories models are for text generation
            } else if (selectedModel.toLowerCase().includes('llama')) {
                task = 'text-generation'; // Llama models are for text generation
            } else if (selectedModel.toLowerCase().includes('qwen') || selectedModel.toLowerCase().includes('tinyllama')) {
                task = 'text-generation'; // Chat models are for text generation
            } else if (selectedModel.toLowerCase().includes('lamini') && selectedModel.toLowerCase().includes('gpt')) {
                task = 'text-generation'; // Lamini GPT models are for text generation
            } else {
                // If the model name doesn't match any pattern, use the selected task type from dropdown
                task = taskTypeSelect.value;
            }
        }
        
        generator = await pipeline(task, selectedModel, {
            progress_callback: (progress) => {
                const percentage = progress.progress ? Math.round(progress.progress) : 0;
                status.textContent = `Loading model: ${selectedModel}... (${percentage}%)`;
            }
        });
        status.textContent = `Model ${selectedModel} loaded. Ready to play!`;
        userInput.disabled = false;
        submitBtn.disabled = false;
        loadingOverlay.classList.add('d-none');
        gameUiContainer.classList.remove('d-none');
        currentModel = selectedModel;  // Store the loaded model
        currentTask = task;            // Store the task type
        
        // Hide the model selection UI by hiding the entire model selection container
        const modelSelectionDiv = document.getElementById('model-selection-container');
        if (modelSelectionDiv) {
            modelSelectionDiv.classList.add('d-none');
        }
        
        // Collapse the accordions after model is loaded by simulating clicks
        const howToPlayCollapse = document.getElementById('howToPlayCollapse');
        const aboutCollapse = document.getElementById('aboutCollapse');
        const howToPlayButton = document.querySelector('[data-bs-target="#howToPlayCollapse"]');
        const aboutButton = document.querySelector('[data-bs-target="#aboutCollapse"]');
        
        // If the "How to Play" accordion is open, close it
        if (howToPlayCollapse && howToPlayCollapse.classList.contains('show')) {
            if (howToPlayButton) {
                howToPlayButton.click(); // This will collapse it using Bootstrap's built-in functionality
            }
        }
        
        // If the "About" accordion is open (it's initially shown by default), close it
        if (aboutCollapse && aboutCollapse.classList.contains('show')) {
            if (aboutButton) {
                aboutButton.click(); // This will collapse it using Bootstrap's built-in functionality
            }
        }
    } catch (error) {
        errorMessage.textContent = 'Failed to load model. Please try refreshing the page. If the problem persists, your browser might not support the model.';
        errorMessage.classList.remove('d-none');
        console.error(error);
        userInput.disabled = true;
        submitBtn.disabled = false; // Keep submit enabled for potential retry
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
        const fullPrompt = `**GUIDELINES:**
- Always maintain a consistent narrative style and tone
- Build upon previous story elements and character developments
- Keep each generation between 3-5 sentences to maintain pacing
- End each generation with an open-ended situation that invites user input
- Incorporate user suggestions naturally into the ongoing narrative
- Vary between action, dialogue, description, and character development
- Create opportunities for meaningful user choices that impact the story

**STORY STRUCTURE:**
- Begin with an intriguing fantasy setting and initial conflict
- Develop characters with depth and motivations
- Include fantasy elements like magic, mythical creatures, or unique worlds
- Build toward meaningful climaxes and resolutions

**RESPONSE FORMAT:**
After each user input, generate 3-5 sentences that advance the story, then end with a clear prompt for the user's next input.

**EXAMPLE INTERACTION PATTERN:**
[Your generation] → [User input] → [Your next generation] → [User input] → etc.

Let's begin our collaborative fantasy novel. I'll start with the opening: ${prompt}`;
        try {
            // Get the currently selected model to adjust parameters accordingly
            const selectedModel = modelSelect.value;
            
            let result;
            // Use the current model and task for parameter selection
            if (currentModel.toLowerCase().includes('gpt2')) {
                // GPT-2 and DistilGPT-2 use different parameters
                result = await generator(fullPrompt, {
                    max_new_tokens: 100,
                    temperature: 0.9,
                    repetition_penalty: 1.2,
                });
            } else if (currentModel.toLowerCase().includes('distilbart')) {
                // DistilBART is for summarization, so we'll use it differently
                result = await generator(fullPrompt, {
                    max_new_tokens: 100,
                    no_repeat_ngram_size: 2,
                });
            } else if (currentModel.toLowerCase().includes('phi')) {
                // Phi-3 models work well with instruct-style prompts
                result = await generator(fullPrompt, {
                    max_new_tokens: 100,
                    temperature: 0.8,
                    do_sample: true,
                });
            } else if (currentModel.toLowerCase().includes('bart')) {
                // BART models for summarization
                result = await generator(fullPrompt, {
                    max_new_tokens: 100,
                    no_repeat_ngram_size: 2,
                });
            } else if (currentModel.toLowerCase().includes('lamini') && !currentModel.toLowerCase().includes('gpt')) {
                // Lamini models (T5-based) with appropriate parameters
                result = await generator(fullPrompt, {
                    max_new_tokens: 100,
                    no_repeat_ngram_size: 2,
                    early_stopping: true,
                });
            } else if (currentModel.toLowerCase().includes('flan')) {
                // Flan-T5 models with instruction-following parameters
                result = await generator(fullPrompt, {
                    max_new_tokens: 100,
                    no_repeat_ngram_size: 2,
                    early_stopping: true,
                });
            } else if (currentModel.toLowerCase().includes('text-davinci')) {
                // Text Davinci models - for advanced text generation
                result = await generator(fullPrompt, {
                    max_new_tokens: 100,
                    temperature: 0.85,
                    do_sample: true,
                });
            } else if (currentModel.toLowerCase().includes('llama2.c-stories')) {
                // Llama2.c stories models - specifically trained for story generation
                result = await generator(fullPrompt, {
                    max_new_tokens: 100,
                    temperature: 0.85,
                    do_sample: true,
                    pad_token_id: 50256, // Common pad token id for GPT-style models
                });
            } else if (currentModel.toLowerCase().includes('llama') || currentModel.toLowerCase().includes('tinyllama')) {
                // Llama models for text generation
                result = await generator(fullPrompt, {
                    max_new_tokens: 100,
                    temperature: 0.8,
                    do_sample: true,
                });
            } else if (currentModel.toLowerCase().includes('qwen')) {
                // Qwen models for chat/text generation
                result = await generator(fullPrompt, {
                    max_new_tokens: 100,
                    temperature: 0.8,
                    do_sample: true,
                });
            } else if (currentModel.toLowerCase().includes('lamini') && currentModel.toLowerCase().includes('gpt')) {
                // Lamini GPT models
                result = await generator(fullPrompt, {
                    max_new_tokens: 100,
                    temperature: 0.85,
                    do_sample: true,
                });
            } else {
                // Default parameters based on the current task
                if (currentTask === 'text-generation') {
                    result = await generator(fullPrompt, {
                        max_new_tokens: 100,
                        temperature: 0.8,
                        do_sample: true,
                    });
                } else if (currentTask === 'summarization') {
                    result = await generator(fullPrompt, {
                        max_new_tokens: 100,
                        no_repeat_ngram_size: 2,
                    });
                } else {
                    // Default parameters for T5 models and others
                    result = await generator(fullPrompt, {
                        max_new_tokens: 100,
                        no_repeat_ngram_size: 2,
                        early_stopping: true,
                    });
                }
            }
            
            // Extract generated text based on model type and result format
            let generatedText = '';
            if (Array.isArray(result)) {
                generatedText = result[0].generated_text || result[0].summary_text || result[0];
            } else if (typeof result === 'string') {
                generatedText = result;
            } else if (result && typeof result === 'object') {
                // Try different possible result formats
                generatedText = result.generated_text || result.summary_text || JSON.stringify(result);
            } else {
                // Fallback in case the result format is unexpected
                generatedText = String(result);
            }
            
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
    }, 100); // Increased delay to ensure UI updates are visible
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
