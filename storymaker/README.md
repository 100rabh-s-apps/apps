# StoryMaker Game

## Description
StoryMaker is an interactive web-based game where users collaborate with a Large Language Model (LLM) to create a fantasy story. The game starts with a short storyline, and users can add their own contributions. The LLM then generates the next paragraph, building the narrative together.

## Features
- Collaborative storytelling between user and LLM.
- Utilizes `transformers.js` to run a text-generation model directly in the browser.
- Dynamic UI updates with loading indicators for model initialization and text generation.
- Fantasy-themed story generation.

## How to Run
1.  **Clone the repository (if applicable) or save the files:** Ensure you have `index.html`, `style.css`, and `script.js` in the same directory.
2.  **Serve the files locally:** Open your terminal in the project directory and run a simple HTTP server. For example, using Python:
    ```bash
    python3 -m http.server 8000
    ```
3.  **Open in browser:** Navigate to `http://localhost:8000` (or the port your server is using) in your web browser.
4.  **Start playing:** The model will begin loading, and once ready, you can start adding to the story.

## Technologies Used
-   **HTML5:** For the game's structure.
-   **CSS3:** For styling and responsive design.
-   **JavaScript:** For game logic and interactivity.
-   **`transformers.js`:** A JavaScript library for running Hugging Face models in the browser.
-   **`Xenova/LaMini-T5-738M`:** The Large Language Model used for text generation.

## License

MIT License

Copyright (c) [Year] [Your Name/Organization]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
