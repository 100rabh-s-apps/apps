
Word Finder – HTML5 Game Specification
1. High-Level Overview
Create an HTML5 word search game called “Word Finder” targeted at children aged 6–12.

* The game shows a matrix (grid) of English letters.
* Several valid words are embedded in the grid.
* A list of all target words for the current level is shown on screen.
* The player can swipe or drag across contiguous letters (in any direction) to select words.
* If the selected letter path forms one of the target words, that word is marked as found.
* The game must be mobile friendly and also work on desktop (mouse + touch).

Use HTML5, CSS3, and vanilla JavaScript only (no external frameworks or libraries).

2. Target Platforms and Constraints

* Platforms

Mobile browsers (Android Chrome, iOS Safari)
Desktop browsers (Chrome, Firefox, Edge, Safari)


* Orientation

Must work in portrait and landscape.
Layout must be responsive and readable on narrow screens (min width ≈ 320px).


* Performance

All logic runs client-side in the browser.
No back-end services or external APIs required.


* Dependencies

No frameworks (e.g., no React, Vue, jQuery).
Use only vanilla JavaScript, HTML5, CSS3.


* Assets

Use simple shapes and colors (no need for external image assets).
If icons are needed (e.g., sound, settings), use simple CSS or inline SVG.




3. Game Concept and Rules
3.1 Core Gameplay

1. The player is presented with:

A letter grid (e.g., 8x8, 10x10 depending on level).
A word list showing all words hidden in the grid.


2. The player finds words by:

Pressing/touching a letter tile and dragging/swiping through adjacent tiles to form a continuous path.
Releasing the pointer/touch to commit the selection.


3. If the selected path of letters matches one of the target words (forwards or backwards):

Highlight the word in the grid (e.g., colored background).
Mark the word as found in the word list (e.g., strikethrough or color change).
Increase the score, if scoring is implemented.


4. The level is completed when all words in the list are found.
5. Optional: track time taken and/or number of hints used.

3.2 Word Path Rules

* Letters must be contiguous:

Adjacent horizontally, vertically, or diagonally.
That means 8 possible directions from any tile.


* The selection path:

Must not “jump” over tiles.
Cannot reuse the same tile twice in a single word.


* Valid direction patterns:

Straight lines (left-right, right-left, up-down, down-up, diagonals).
For simplicity: do not allow bent paths (i.e., no turning corners mid-word).


* The game should accept words forwards and backwards (e.g., “CAT” and “TAC” both valid if present).


4. Game Structure and Flow
4.1 Screens / Views
Implement at least the following screens:

1. 
Splash / Home Screen

Game title: “Word Finder”.
Buttons:

Play (goes to Level Select or directly to first level).
Settings (optional).
Instructions / How to Play.




2. 
Level Select Screen

Show a grid or list of levels:

Level 1, Level 2, Level 3, etc.


Indicate:

Locked/unlocked status.
Completion (e.g., star, checkmark).


For MVP, 10 levels is sufficient.
Optionally group levels by difficulty: Easy / Medium / Hard.


3. 
Game Screen (Main Play Area)

Top section:

Current level name or number.
Score or stars (optional).
Timer (optional; can be on or off; just prepare placeholder).
Pause button.


Middle section:

Letter grid (interactive).


Bottom section:

Word list (words to find).
Possibly a hint button.




4. 
Pause / Settings Overlay

Buttons:

Resume
Restart level
Exit to Level Select


Settings toggles:

Sound on/off
Music on/off (if implemented)
High contrast mode (accessibility)




5. 
Level Complete Screen

Show message like “Level Complete!”.
Display:

Time taken (if timer used).
Words found / total.
Score or stars (if scoring used).


Buttons:

Replay level
Next level
Back to Level Select






5. UI Layout and Design
5.1 General Style

* Look and feel: Bright, kid-friendly, clean, not cluttered.
* Colors:

Use high contrast between letters and background.
Avoid overly harsh schemes; soft backgrounds with vivid highlight colors.


* Typography:

Use a clear, sans-serif font.
Minimum font size: 14–16px on mobile; larger for key elements (like letter tiles and words).


* Provide a high-contrast mode option:

Dark text on light background with clear tile highlight colors.



5.2 Layout Behavior (Responsive Design)

* On mobile portrait:

Top: Level info, score/timer, pause.
Middle: Letter grid (centered, as large as possible while remaining fully visible).
Bottom: Scrollable word list.


* On tablet/desktop:

Left: Letter grid.
Right: Word list and level info.
Or top/bottom layout similar to mobile but with more space.



Use CSS Flexbox or CSS Grid for responsiveness.
5.3 Letter Grid

* Use a square layout for tiles:

Tiles should remain square (equal width and height) as screen size changes.


* Each tile:

Shows a single uppercase letter (A–Z).
Has visual states:

Default: Neutral background, dark letter.
Hovered / Dragged over: Slightly highlighted.
Selected (during swipe): Strong highlight (e.g., bright border and background).
Found: Distinct permanent state (e.g., filled color or underline).




* When the player is actively swiping:

Tiles along the path should update visually in real time.



5.4 Word List Display

* Display all target words for the current level.
* Each word shows:

Text of the word.
Visual status:

Not found: Normal text.
Found: Strikethrough or greyed out, plus a small check icon.




* The list must be scrollable if there are many words.
* Words should be in uppercase or Title Case and large enough to read easily.


6. Input and Interaction
6.1 Supported Input Methods

* Touch (mobile, tablet):

touchstart → begin selection.
touchmove → extend selection.
touchend / touchcancel → end selection and check word.


* Mouse (desktop):

mousedown → begin selection.
mousemove → extend selection (if mouse is down).
mouseup → end selection and check word.



6.2 Gesture / Swipe Handling

1. Start Selection

When the player touches/clicks a tile:

Mark that tile as the first letter of the current path.
Start tracking the path (array of tile coordinates).




2. Continue Selection

As the player moves over neighboring tiles while holding:

Determine which tile is under the pointer.
Only add a tile to the path if:

It is adjacent to the last tile in the path (including diagonals).
It has not already been used in the current path.


Update the visual highlighting for the path.




3. End Selection

On touchend / mouseup:

Collect the letters from the selected path in order.
Form a string for:

Forward direction.
Reverse direction.


Check if either string is in the list of remaining target words.
If match:

Mark the word as found.
Permanently mark those tiles with the “found” style.
Play success sound (if sound enabled).


If no match:

Provide brief negative feedback (e.g., shake animation or red flash).
Revert tiles to default state.






4. Edge Cases

If the player moves outside the grid area, ignore until they re-enter.
If multiple touches occur, only handle the first touch; ignore others.




7. Level Design and Difficulty
7.1 Level Structure
Each level consists of:

* A grid size (e.g., 8x8, 10x10, etc.).
* A list of target words.
* The grid layout, defining where each letter goes.

For this implementation:

* Use a static JSON configuration stored locally (no server).
* The game reads this configuration on load.

7.2 Example Level Difficulty Rules (Guidelines)

* Easy (Levels 1–3):

Grid size: 6x6 or 8x8.
Words: 5–8 words.
Word lengths: 3–5 letters.
Simple vocabulary: cat, dog, tree, sun, ball, etc.


* Medium (Levels 4–7):

Grid size: 8x8 or 10x10.
Words: 8–12 words.
Word lengths: 4–7 letters.


* Hard (Levels 8–10):

Grid size: 10x10 or 12x12.
Words: 10–15 words.
Word lengths: 5–9 letters.



You may hardcode a small set of age-appropriate word lists.
7.3 Grid Generation
For simplicity in this spec, you may:

* Either:

Predefine complete grids in JSON (letter-by-letter), with word positions already embedded.


* Or:

Implement a basic generator that:

Places each word in the grid in a random allowed direction.
Fills remaining empty cells with random letters A–Z.





Either approach is acceptable. If implementing generator, ensure:

* Words do not conflict in a way that corrupts existing words.
* All target words are guaranteed to be present in the grid.


8. Data Structures and Files
8.1 Files

* index.html – main HTML.
* style.css – all styling.
* script.js – all JavaScript logic.
* levels.json – level configuration (embedded or separate; if separate, load via fetch).

8.2 Suggested levels.json Structure
Use a structure like:
jsonDownloadCopy code{
  "levels": [
    {
      "id": 1,
      "name": "Level 1 - Easy",
      "gridSize": 8,
      "words": ["CAT", "DOG", "TREE", "SUN", "BALL"],
      "grid": [
        "C A T X X X X X",
        "X X X X X X X X",
        "D O G X X X X X",
        "X X X T R E E X",
        "X X X X X X X X",
        "S U N X X X X X",
        "B A L L X X X X",
        "X X X X X X X X"
      ]
    }
  ]
}
Notes:

* grid can be represented as:

Array of strings with space-separated letters, or
Array of arrays of single-character strings.


* If you implement a generator, grid can be optional; generate it at runtime.


9. Game Logic Details
9.1 Word Matching

* From the completed path, generate:

selectedWordForward – letters from first tile to last.
selectedWordBackward – reversed.


* Convert both to uppercase.
* Check against the list of remaining words for the level.
* When a match is found:

Mark that word as found (store found words in a set/array).
Update UI to indicate the found state.
Save progress (if implementing persistence).



9.2 Level Progression

* On level completion:

Unlock the next level.
Store completion status in localStorage so it persists between sessions.


* localStorage keys (example):

wordFinder_progress:
jsonDownloadCopy code{
  "unlockedLevel": 3,
  "completedLevels": [1, 2]
}




9.3 Score and Timer (Optional but Recommended)

* Timer:

Start timer when level loads or when first move is made.
Display as MM:SS.


* Score:

Simple scoring:

+10 points per word found.
Bonus based on speed (optional).




* Store best times and/or scores per level in localStorage.


10. Audio and Feedback
10.1 Audio

* Simple sound effects:

Word found: short positive sound.
Invalid selection: short “error” sound.


* Add a sound on/off toggle in settings.
* Audio must be optional; game should function without sound.

10.2 Visual Feedback

* On correct word:

Tiles of the word briefly glow or animate.


* On incorrect selection:

Shake animation on the selected path.
Or briefly flash the tiles red, then reset.



Keep animations subtle and not too distracting.

11. Accessibility Requirements

* Keyboard navigation (for desktop):

Minimum requirement: allow selection with mouse; keyboard support is a bonus. If implemented:

Arrow keys to move a cursor over tiles.
Space/Enter to start and end selection.




* Colorblind-friendly:

Do not rely solely on color differences.
Use additional patterns or icons (e.g., underline or border for found words).


* High contrast mode:

Toggle in settings; store user preference in localStorage.


* Screen Reader:

Add appropriate aria-labels for:

Buttons (Play, Settings, Back, etc.).
Grid tiles (e.g., “Row 3 Column 2 letter A”).


The game is primarily visual, but make key controls labeled.




12. Code Quality and Organization

* Separate concerns:

HTML for structure.
CSS for layout/style.
JS for logic.


* Use clear, descriptive names for functions and variables.
* Comment key logic sections:

Grid initialization.
Input handling / swipe detection.
Word checking logic.
Level loading and saving progress.




13. Error Handling and Edge Cases

* If levels.json fails to load:

Show a user-friendly error message.


* If an invalid level ID is requested:

Fallback to level 1 or show an error.


* Prevent the game from crashing on unexpected input; fail gracefully.


14. Testing and Acceptance Criteria
The implementation is considered correct if:

1. 
Basic Gameplay

Player can load the game, select a level, see a grid and word list.
Player can swipe/drag across adjacent letters to form a path.
Correct words are recognized and marked as found.
Incorrect selections do not mark any word and reset properly.


2. 
Platform Compatibility

Works in at least one modern desktop browser.
Works in at least one modern mobile browser (touch input properly handled).


3. 
Responsiveness

Layout adapts to small mobile screens.
No elements overflow or become unusable on narrow viewports.


4. 
Persistence

Progress (at least unlocked levels) persists using localStorage.


5. 
Accessibility Basics

High contrast mode works.
Buttons and main elements have readable text and labels.




15. Summary of Key Implementation Requirements

* HTML5/CSS3/vanilla JS only.
* Letter grid that supports contiguous swipe/drag input (touch + mouse).
* Word list with visual indication of found words.
* Multiple levels, each with defined word sets and grid.
* Mobile-friendly responsive UI.
* Basic visual and audio feedback.
* Local storage for saving progress and settings.


Use this specification as the complete guide to implement the “Word Finder” HTML5 game.
