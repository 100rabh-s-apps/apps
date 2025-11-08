const gameState = {
  states: [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Jammu and Kashmir and Ladakh",
  ],
  identifiedStates: [],
  currentTargetState: null,
  completedCount: 0,
  isGameOver: false,
};

// DOM elements
const map = document.getElementById("india-map");
const currentStateEl = document.getElementById("current-state");
const completedCountEl = document.getElementById("completed-count");
const totalCountEl = document.getElementById("total-count");
const feedbackEl = document.getElementById("feedback");
const restartBtn = document.getElementById("restart-btn");
const stateElements = document.querySelectorAll(".state");
const completionModal = document.getElementById("completion-modal");
const playAgainBtn = document.getElementById("play-again-btn");

// Initialize the game
function initGame() {
  totalCountEl.textContent = gameState.states.length;
  completedCountEl.textContent = gameState.completedCount;
  getRandomState();
  updateGameState();

  // Add event listeners to states
  stateElements.forEach((state) => {
    state.addEventListener("click", handleStateClick);
    state.addEventListener("touchstart", handleStateClick, { passive: false });
  });

  // Add event listeners to buttons
  restartBtn.addEventListener("click", restartGame);
  playAgainBtn.addEventListener("click", restartGame);
}

// Get a random state that hasn't been identified yet
function getRandomState() {
  const remainingStates = gameState.states.filter(
    (state) => !gameState.identifiedStates.includes(state),
  );
  console.log(remainingStates);

  if (remainingStates.length > 0) {
    const randomIndex = Math.floor(Math.random() * remainingStates.length);
    gameState.currentTargetState = remainingStates[randomIndex];
    currentStateEl.textContent = gameState.currentTargetState;
  } else {
    // Game completed
    gameState.isGameOver = true;
    completionModal.style.display = "flex"; // Show the modal
  }
}

// Handle state click/touch
function handleStateClick(e) {
  e.preventDefault(); // Prevent default touch behavior
  if (e.type === "touchstart") {
    e.stopPropagation(); // Prevent event bubbling on touch
  }

  // Ignore if game is over
  if (gameState.isGameOver) return;

  const clickedState = e.target.getAttribute("data-state");

  if (clickedState === gameState.currentTargetState) {
    // Correct answer
    e.target.classList.add("selected-state", "correct");

    if (!gameState.identifiedStates.includes(clickedState)) {
      gameState.identifiedStates.push(clickedState);
      gameState.completedCount++;
      completedCountEl.textContent = gameState.completedCount;
    }

    showFeedback("Correct! Well done!", "success");

    setTimeout(() => {
      e.target.classList.remove("selected-state", "correct");
      if (gameState.completedCount < gameState.states.length) {
        getRandomState();
        feedbackEl.style.display = "none";
      }
    }, 1000);
  } else {
    // Incorrect answer
    e.target.classList.add("selected-state", "incorrect");
    showFeedback("Try again! That's not the correct state.", "failure");

    setTimeout(() => {
      e.target.classList.remove("selected-state", "incorrect");
    }, 1000);
  }
}

// Show feedback message
function showFeedback(message, type) {
  feedbackEl.textContent = message;
  feedbackEl.className = `feedback ${type}`;
  feedbackEl.style.display = "block";

  setTimeout(() => {
    feedbackEl.style.display = "none";
  }, 2000);
}

// Update game state display
function updateGameState() {
  completedCountEl.textContent = gameState.completedCount;
}

// Restart the game
function restartGame() {
  // Reset game state
  gameState.identifiedStates = [];
  gameState.completedCount = 0;
  gameState.currentTargetState = null;
  gameState.isGameOver = false;

  // Reset UI
  completedCountEl.textContent = gameState.completedCount;
  feedbackEl.style.display = "none";
  completionModal.style.display = "none"; // Hide the modal

  // Remove any visual state classes
  stateElements.forEach((state) => {
    state.classList.remove("selected-state", "correct", "incorrect");
  });

  // Start a new game
  getRandomState();
}

// Initialize the game when the page loads
window.onload = initGame;
