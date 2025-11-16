document.addEventListener('DOMContentLoaded', () => {
    const tipsData = [
        ...studySmartTips,
        ...friendshipSharingTips,
        ...feelingsSelfCareTips,
        ...homeResponsibilityTips,
        ...digitalSafetyTips
    ];
    const tipTitleElement = document.getElementById('tip-title');
    const tipExplanationElement = document.getElementById('tip-explanation');
    const explanationContainer = document.getElementById('tip-explanation-container');
    const toggleExplanationBtn = document.getElementById('toggle-explanation-btn');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const listenTipBtn = document.getElementById('listen-tip-btn');
    const listenExplanationBtn = document.getElementById('listen-explanation-btn');
    const stopTtsBtn = document.getElementById('stop-tts-btn');
    const stopExplanationTtsBtn = document.getElementById('stop-explation-tts-btn');
    const categoryButtonsContainer = document.getElementById('category-buttons');

    let currentTipIndex = 0;
    let currentCategory = 'Study Smart';

    function getTipsByCategory(category) {
        return tipsData.filter(tip => tip.category === category);
    }

    function displayTip() {
        const tips = getTipsByCategory(currentCategory);
        const tip = tips[currentTipIndex];
        tipTitleElement.textContent = tip.tip_title;
        tipExplanationElement.textContent = tip.explanation;
        explanationContainer.style.display = 'none';
        toggleExplanationBtn.textContent = 'Tell Me More';
        stopTtsBtn.style.display = 'none'; // Hide stop button initially
    }

    function speakText(text, stopBtn, elementToHighlight) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop any ongoing speech

            const originalText = elementToHighlight.textContent; // Store original text content

            // Pre-process text to get words and their original indices
            const wordsWithIndices = [];
            text.replace(/\S+/g, (word, offset) => { // Match non-whitespace sequences
                wordsWithIndices.push({ word: word, index: offset });
                return word;
            });

            // Create spans for each word, preserving original spacing
            let htmlContent = '';
            let currentOriginalIndex = 0;
            for (let i = 0; i < wordsWithIndices.length; i++) {
                const wordObj = wordsWithIndices[i];
                // Add any leading spaces
                if (wordObj.index > currentOriginalIndex) {
                    htmlContent += text.substring(currentOriginalIndex, wordObj.index);
                }
                htmlContent += `<span>${wordObj.word}</span>`;
                currentOriginalIndex = wordObj.index + wordObj.word.length;
            }
            // Add any trailing spaces
            if (currentOriginalIndex < text.length) {
                htmlContent += text.substring(currentOriginalIndex);
            }
            elementToHighlight.innerHTML = htmlContent;
            const spans = Array.from(elementToHighlight.querySelectorAll('span'));

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-IN';

            utterance.onboundary = (event) => {
                if (event.charIndex === undefined) return;

                // Find the span that corresponds to the current charIndex
                let currentWordSpanIndex = -1;
                for (let i = 0; i < wordsWithIndices.length; i++) {
                    const wordObj = wordsWithIndices[i];
                    if (event.charIndex >= wordObj.index && event.charIndex < wordObj.index + wordObj.word.length) {
                        currentWordSpanIndex = i;
                        break;
                    }
                }

                spans.forEach(span => span.classList.remove('highlight'));
                if (currentWordSpanIndex !== -1) {
                    spans[currentWordSpanIndex].classList.add('highlight');
                }
            };

            utterance.onstart = () => {
                stopBtn.style.display = 'inline-block';
            };

            utterance.onend = () => {
                stopBtn.style.display = 'none';
                elementToHighlight.innerHTML = originalText; // Restore original text
            };

            utterance.onerror = () => {
                stopBtn.style.display = 'none';
                elementToHighlight.innerHTML = originalText; // Restore original text
            };

            window.speechSynthesis.speak(utterance);
        } else {
            console.error("Text-to-Speech not supported in this browser.");
            alert("Sorry, your browser does not support text-to-speech.");
        }
    }

    function createCategoryButtons() {
        const categories = [...new Set(tipsData.map(tip => tip.category))];
        categories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category;
            button.addEventListener('click', () => {
                currentCategory = category;
                currentTipIndex = 0;
                displayTip();
                updateActiveCategoryButton();
            });
            categoryButtonsContainer.appendChild(button);
        });
        updateActiveCategoryButton();
    }

    function updateActiveCategoryButton() {
        const buttons = categoryButtonsContainer.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent === currentCategory) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    toggleExplanationBtn.addEventListener('click', () => {
        if (explanationContainer.style.display === 'none') {
            explanationContainer.style.display = 'block';
            toggleExplanationBtn.textContent = 'Show Less';
        } else {
            explanationContainer.style.display = 'none';
            toggleExplanationBtn.textContent = 'Tell Me More';
        }
    });

    nextBtn.addEventListener('click', () => {
        const tips = getTipsByCategory(currentCategory);
        currentTipIndex = (currentTipIndex + 1) % tips.length;
        displayTip();
    });

    prevBtn.addEventListener('click', () => {
        const tips = getTipsByCategory(currentCategory);
        currentTipIndex = (currentTipIndex - 1 + tips.length) % tips.length;
        displayTip();
    });

    listenTipBtn.addEventListener('click', () => {
        speakText(tipTitleElement.textContent, stopTtsBtn, tipTitleElement);
    });

    listenExplanationBtn.addEventListener('click', () => {
        speakText(tipExplanationElement.textContent, stopExplanationTtsBtn, tipExplanationElement);
    });

    stopTtsBtn.addEventListener('click', () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            stopTtsBtn.style.display = 'none'; // Hide stop button immediately
        }
    });

    stopExplanationTtsBtn.addEventListener('click', () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            stopExplanationTtsBtn.style.display = 'none'; // Hide stop button immediately
        }
    });

    // Initial setup
    createCategoryButtons();
    displayTip();
});
