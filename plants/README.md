# Plant Quiz Game

This is a simple, interactive web-based quiz game designed to help users learn about plants. It features multiple-choice and true/false questions suitable for elementary school students (Grade 1-3).

## Features

*   **Interactive Quiz:** Answer questions about plant needs, parts, life cycles, and more.
*   **Score Tracking:** Keep track of your score as you progress through the quiz.
*   **Progress Bar:** Visual indicator of your progress through the questions.
*   **Achievement Message:** A message at the end of the quiz based on your performance.
*   **Responsive Design:** Playable on various screen sizes.

## How to Play

1.  Open the `index.html` file in your web browser.
2.  Click the "Start Quiz" button on the welcome screen.
3.  Answer the multiple-choice or true/false questions by clicking on the correct option.
4.  After answering all questions, your final score and an achievement message will be displayed.
5.  Click "Play Again" to restart the quiz.

## Running Locally

This is a client-side web application and does not require a complex build process or a backend server. You can run it locally by simply opening the `index.html` file in your web browser.

Alternatively, you can serve it using a simple local web server:

### Using Python's Simple HTTP Server

If you have Python installed, navigate to the `plants` directory in your terminal and run:

```bash
python -m http.server
```

Then, open your web browser and go to `http://localhost:8000`.

### Using Node.js `http-server` (if installed globally)

If you have Node.js and `http-server` installed globally, navigate to the `plants` directory in your terminal and run:

```bash
http-server
```

Then, open your web browser and go to `http://localhost:8080` (or the port indicated by `http-server`).

## Technologies Used

*   HTML5
*   CSS3
*   JavaScript (ES6+)

## Development

The game logic is contained in `script.js`, styling in `style.css`, and the structure in `index.html`. Questions are defined within the `script.js` file.
