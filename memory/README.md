# 🏰 Mind Mansion: The Memory Palace Game

Mind Mansion is an interactive, browser-based educational game designed for children (ages 6–12). It teaches the **Method of Loci** (also known as the Memory Palace technique), one of the oldest and most effective mnemonic systems in the world.

## 🌟 The "Place, Paint, Play" Loop

The game follows a scientifically-backed three-phase learning cycle:

1.  **Phase 1: Place**
    Players are presented with a sequential path of 10 numbered "Loci" (hotspots) in a room. They must drag 10 random items from their inventory and decide where each one "lives."
    
2.  **Phase 2: Paint (The Association Engine)**
    Placing an item triggers a "Refinement Pop-up." To encode the memory, players must choose a sensory modifier to make the item memorable:
    *   **Size:** Make it as big as a house!
    *   **Action:** Make it dance a silly jig!
    *   **Sound/Smell:** Make it smell like stinky socks!

3.  **Phase 3: Play (Recall Quest)**
    The items disappear. The player must visit each Loci in order (1–10) and identify which item was stored there.

## 🧠 The "Secret Sauce" for Clear Memory

Mind Mansion doesn't just play a game; it teaches the **three pillars of expert mnemonics**:
*   **Vividness:** Using bright colors and strange details to make mental images "pop."
*   **Spatial Anchoring:** Leveraging the brain's natural ability to remember physical locations.
*   **The Bizarre Factor:** Understanding that our brains ignore "normal" things and prioritize the weird and unusual.

## 🦉 Pedagogy & Scaffolding

*   **The Memory Owl:** A whimsical mentor character that provides instructions and encouragement.
*   **Metacognitive Scaffolding (Progressive Hinting):** If a player gets an item wrong, the game provides layered support. It first reminds them of their association, and if they struggle again, the Owl provides active visualization strategies (e.g., *"Close your eyes and see it 10 feet tall!"*).
*   **The Superpower Report:** At the end of each session, players receive a detailed "Brain Strength" analysis, showing their recall accuracy across different categories: **Living, Nature, Objects, and Abstract concepts.**
*   **Mental Strength & Leveling:** A progression system that saves to `localStorage`. Players earn points to increase their **User Level**, unlocking more challenging words as they grow.
*   **Spaced Repetition (SR):** The game's engine automatically tracks "Struggling Items" and ensures they appear more frequently in future sessions to solidify learning.

## 🛠 Technical Stack

*   **HTML5/CSS3:** Vanilla implementation with persistent `localStorage` support.
- **JavaScript (ES6):** State machine managing the "Place, Paint, Play" loop and a custom SR selection engine.
- **Responsive Design:** Mobile-first, optimized for classroom tablets.

## 📂 Project Structure

```text
/apps/memory/
├── index.html          # Main entry & Onboarding Tutorial
├── css/
│   └── style.css       # Whimsical styling & pulse animations
├── js/
│   ├── data.js         # 100+ item library, SR logic, & Persistence
│   ├── game.js         # Core game loop & UI management
│   └── schema.json     # JSON schema for library expansion
└── README.md           # Documentation
```


## 🚀 How to Run

1.  Clone the repository.
2.  Open `index.html` in any modern web browser.
3.  No build process or dependencies required (pure client-side).

## 📈 Extension & Customization

The code is designed to be highly modular:
*   **Adding Items:** Simply append new objects to the `itemLibrary` array in `js/data.js`.
*   **Custom Rooms:** The Loci positions are defined in `js/game.js` as normalized percentages, making it easy to swap the background image and adjust coordinates.

---
*Created by Saurabh Minni as part of the Apps collection.*
