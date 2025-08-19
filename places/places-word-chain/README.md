# Places Chain Game

A fun and educational web-based game where players take turns naming geographical places (cities, states, countries), with each new place's name starting with the last letter of the previous one. The game features real-time place validation, an interactive map display, and a vibrant, kid-friendly user interface.

## Features

*   **Turn-based Gameplay:** Player vs. Computer (AI) or Play Solo.
*   **Letter Chaining Validation:** Ensures each new place name starts with the last letter of the previous one.
*   **Online Place Validation:** Verifies entered places are real geographical locations using the OpenStreetMap Nominatim API, prioritizing specific places (cities, towns) over broader administrative regions.
*   **Score Tracking:** Keeps track of consecutive correct answers.
*   **Interactive Map Display:** Shows the location of each named place on a map.
*   **Customizable Map Appearance:** Map colors are adjusted to be bright and appealing.
*   **Vibrant UI:** Features a colorful, kid-friendly palette, attractive fonts, and relevant icons.
*   **Clear Error Messages:** Provides immediate feedback for invalid entries.
*   **Wikipedia Integration:** Displays a short blurb and a direct link to the Wikipedia page for each place.
*   **Image Thumbnails:** Includes small images or flags for visual recognition (fetched from Wikipedia).
*   **Local Storage Persistence:** Game state (score and place chain) is saved locally in the browser across sessions.
*   **Inline Place Information:** Clicking on a place name in the chain expands its detailed information directly within the chain, with only one place's details shown at a time.
*   **Clear Game Option:** A button to clear the current game state and start a new game from the beginning.

## Technologies Used

*   **Frontend:**
    *   React.js (JavaScript)
    *   Bootstrap (for responsive layout and styling)
    *   OpenLayers (for interactive map display)
    *   Font Awesome (for icons)
    *   Google Fonts (for attractive typography)
*   **API:**
    *   OpenStreetMap Nominatim API (for place validation and geocoding)
    *   Wikimedia REST API (for Wikipedia summaries and images)

## Setup and Installation

To get the project up and running on your local machine:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url> # Replace with your actual repository URL if applicable
    ```
    (Note: If you've been following along with the CLI, you are already in the `geo-word-chain` directory.)

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm start
    ```
    This will open the application in your default web browser, usually at `http://localhost:3000`.

## Usage

1.  Choose your game mode: Player vs. AI or Play Solo.
2.  Enter a geographical place name (city, state, or country) into the input field.
3.  Click "Submit" or press Enter.
4.  If the place is valid and follows the chaining rules, it will be added to the chain, and its location will be shown on the map.
5.  Continue the chain by entering a new place name that starts with the last letter of the previous one.
6.  Click on a place name in the chain to expand and view its Wikipedia information and image.
7.  The game will provide feedback for invalid entries, incorrect chaining, or duplicate places.
8.  Your game progress is saved automatically.

## Future Enhancements

*   **Hint System:** Provide suggestions for valid place names.
*   **Difficulty Levels:** Easy (only major cities), Medium (cities/states), Hard (include countries).
*   **Time Limits:** Optional timer for added challenge.
*   **Scoreboard/Leaderboards:** Track high scores.
*   **Multiplayer Support:** Online play with friends.

## Attribution

*   Map data: &copy; [OpenStreetMap contributors](https://www.openstreetmap.org/copyright)
*   Basemap tiles: &copy; [CartoDB](https://cartodb.com/attributions)
*   Geocoding: [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org/)
*   Icons: [Font Awesome](https://fontawesome.com/)
*   Fonts: [Google Fonts](https://fonts.google.com/)
*   Wikipedia data: [Wikimedia REST API](https://api.wikimedia.org/)