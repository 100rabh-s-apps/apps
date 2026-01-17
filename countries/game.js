// --- CONFIG & STATE ---

const gameData = {
    "Africa": [], "Asia": [], "Europe": [], "North America": [], "South America": [], "Oceania": []
};

let continentsData;
let countryNamesData;
let currentCountryCode;
let currentCountryName;
let currentContinent;

// D3 Global variables
let svg;
let projection;
let path;
let zoomTransform = d3.zoomIdentity;
let worldMapData; // Add this global variable
let countryNameToCodeMap = {};

let gameState = {
    phase: null, // 'SELECTING_CONTINENT', 'SELECTING_COUNTRY'
    mode: 'RANDOM', // 'RANDOM' or 'CONTINENT'
    selectedContinentForMode: null, // Used for continent mode
    hoveredContinent: null,
    selectedContinent: null,
    hoveredCountry: null,
    selectedCountry: null,
    correctCountry: null,
    isShowingAnswer: false, // Flag to indicate if we're showing the correct answer after wrong attempts
    isPanning: false,
    panStart: { x: 0, y: 0 },
    continentIncorrectAttempts: 0,
    countryIncorrectAttempts: 0
};

let validFeatures; // Global variable to store filtered features that match our data

const COLORS = {
    default: '#B9B9B9',
    continentHover: 'yellow',
    continentSelected: 'lightblue',
    countryHover: 'yellow',
    countrySelected: 'orange',
    countryCorrect: 'green',
    countryShowAnswer: 'blue'
};

const svgContainer = document.getElementById('svg-container');
const questionElement = document.getElementById('question');
const controlsElement = document.getElementById('controls');
const gameModalElement = document.getElementById('gameModal');
const gameModal = new bootstrap.Modal(gameModalElement);
const gameModalTitle = document.getElementById('gameModalLabel');
const gameModalBody = gameModalElement.querySelector('.modal-body');

const zoomInButton = document.getElementById('zoom-in');
const zoomOutButton = document.getElementById('zoom-out');
const panUpButton = document.getElementById('pan-up');
const panDownButton = document.getElementById('pan-down');
const panLeftButton = document.getElementById('pan-left');
const panRightButton = document.getElementById('pan-right');
const resetViewButton = document.getElementById('reset-view');
const restartGameButton = document.getElementById('restart-game');
const randomModeBtn = document.getElementById('random-mode-btn');
const continentModeBtn = document.getElementById('continent-mode-btn');
const continentSelectionDiv = document.getElementById('continent-selection');
const continentOptionsDiv = document.getElementById('continent-options');
const setupContainer = document.getElementById('setup-container');
const gameContainer = document.getElementById('game-container');

// --- INITIALIZATION ---

async function initGame() {
    const [worldMap, continents, countries] = await Promise.all([
        fetch('countries.geo.json').then(res => res.json()),
        fetch('continents.json').then(res => res.json()),
        fetch('country-names.json').then(res => res.json())
    ]);

    // svgContainer.innerHTML = svgText; // Removed this line
    continentsData = continents;
    countryNamesData = countries;

    // Create a reverse mapping from country name to country code
    for (const code in countryNamesData) {
        countryNameToCodeMap[countryNamesData[code]] = code;
    }
    
    svgContainer.innerHTML = ''; // Clear previous SVG content

    const width = 1000;
    const height = 507.209; // Original SVG height for aspect ratio

    svg = d3.select("#svg-container").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`);
    
    // Set up projection (Mercator is common for world maps)
    projection = d3.geoMercator()
        .fitSize([width, height], worldMap); // Fit projection to the GeoJSON data

    path = d3.geoPath()
        .projection(projection);

    // Filter features to only include countries that have data in our country names and continents files
    validFeatures = worldMap.features.filter(feature => {
        const countryName = feature.properties.name;
        const countryCode = countryNameToCodeMap[countryName];
        return countryCode && continentsData[countryCode]; // Only include if both mappings exist
    });

    svg.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(validFeatures)
        .enter().append("path")
        .attr("d", path)
        .attr("id", d => countryNameToCodeMap[d.properties.name]) // Use country code directly since we filtered
        .style("fill", COLORS.default)
        .style("stroke", "#ffffff")
        .style("stroke-width", "0.5px");
    
    // Store worldMap globally if needed for other functions
    worldMapData = worldMap;

    for (const countryCode in continentsData) {
        if (gameData[continentsData[countryCode]]) {
            gameData[continentsData[countryCode]].push(countryCode);
        }
    }
    
    setupControls();
    setupEventListeners();
    setupModeControls();
    populateContinentOptions();

    // Initially show setup container and hide game container
    setupContainer.style.display = 'block';
    gameContainer.style.display = 'none';
}

// --- STATE MANAGEMENT & RENDERING ---

function transitionToState(newState, payload = {}) {
    gameState.phase = newState;

    gameState.hoveredContinent = null;
    gameState.selectedContinent = null;
    gameState.hoveredCountry = null;
    gameState.selectedCountry = null;

    switch (newState) {
        case 'SELECTING_CONTINENT':
            questionElement.textContent = `Which continent is ${currentCountryName} in?`;
            controlsElement.style.display = 'none';
            resetView();
            break;
        case 'SELECTING_COUNTRY':
            questionElement.textContent = `Now, can you find ${currentCountryName} on the map?`;
            controlsElement.style.display = 'block';

            // In continent mode, zoom to the selected continent
            if (gameState.mode === 'CONTINENT' && gameState.selectedContinentForMode) {
                resetViewToContinent(gameState.selectedContinentForMode);
            } else {
                resetViewToContinent(currentContinent);
            }
            break;
    }
    render();
}

function render() {
    // Select all country paths using D3
    const allCountryPaths = svg.selectAll(".countries path");

    allCountryPaths.each(function(d) {
        const countryEl = d3.select(this);
        const countryCode = countryEl.attr('id');
        const continent = continentsData[countryCode];

        let color = COLORS.default;
        let opacity = 1;

        if (gameState.phase === 'SELECTING_CONTINENT') {
            if (continent === gameState.hoveredContinent) {
                color = COLORS.continentHover;
            }
             if (continent === gameState.selectedContinent) {
                color = COLORS.continentSelected;
            }
        } else if (gameState.phase === 'SELECTING_COUNTRY') {
            // In continent mode, only highlight countries from the selected continent
            const targetContinent = gameState.mode === 'CONTINENT' ? gameState.selectedContinentForMode : currentContinent;

            if (continent === targetContinent) {
                color = COLORS.continentSelected;
                if (countryCode === gameState.hoveredCountry) {
                    color = COLORS.countryHover;
                }
                if (countryCode === gameState.selectedCountry) {
                    color = COLORS.countrySelected;
                }
                // Use blue color when showing the correct answer after 3 wrong attempts
                // Use green color when the user correctly identifies the country
                if (countryCode === gameState.correctCountry) {
                    // Check if this is after 3 wrong attempts (when we're showing the answer)
                    if (gameState.isShowingAnswer) {
                        color = COLORS.countryShowAnswer; // Blue color
                    } else {
                        color = COLORS.countryCorrect; // Green color
                    }
                }
            } else {
                // In continent mode, dim countries not in the selected continent
                if (gameState.mode === 'CONTINENT') {
                    opacity = 0.2;
                }
                // In random mode, only dim countries not in the current country's continent
                else if (continent !== currentContinent) {
                    opacity = 0.2;
                }
            }
        }

        countryEl.style("fill", color);
        countryEl.style("opacity", opacity);
    });
}

// --- MODE CONTROLS ---

function setupModeControls() {
    randomModeBtn.addEventListener('click', () => {
        gameState.mode = 'RANDOM';
        // Hide setup container and show game container
        setupContainer.style.display = 'none';
        gameContainer.style.display = 'block';
        pickNewCountry();
        transitionToState('SELECTING_CONTINENT');
    });

    continentModeBtn.addEventListener('click', () => {
        gameState.mode = 'CONTINENT';
        // Show continent selection within setup container
        continentSelectionDiv.style.display = 'block';
    });
}

function populateContinentOptions() {
    const continents = Object.keys(gameData);
    continentOptionsDiv.innerHTML = '';

    continents.forEach(continent => {
        const button = document.createElement('button');
        button.className = 'btn btn-outline-primary';
        button.textContent = continent;
        button.addEventListener('click', () => {
            gameState.selectedContinentForMode = continent;
            // Hide setup container and show game container
            setupContainer.style.display = 'none';
            gameContainer.style.display = 'block';
            pickNewCountry();
            transitionToState('SELECTING_COUNTRY'); // Skip continent selection in continent mode
        });
        continentOptionsDiv.appendChild(button);
    });
}

// --- EVENT LISTENERS & HANDLERS ---

function setupEventListeners() {
    svg.on('mouseover', (e) => {
        if (gameState.phase === 'SELECTING_COUNTRY' && gameState.isPanning) return;
        const countryCode = getCountryCodeFromEventTarget(e.target);
        if (gameState.phase === 'SELECTING_CONTINENT') {
            gameState.hoveredContinent = countryCode ? continentsData[countryCode] : null;
        } else if (gameState.phase === 'SELECTING_COUNTRY') {
            gameState.hoveredCountry = countryCode;
        }
        render();
    });

    svg.on('mouseout', (e) => {
        if (gameState.phase === 'SELECTING_CONTINENT') {
            gameState.hoveredContinent = null;
        } else if (gameState.phase === 'SELECTING_COUNTRY') {
            gameState.hoveredCountry = null;
        }
        render();
    });

    svg.on('click', (e) => {
        if (gameState.phase === 'SELECTING_CONTINENT') {
            const countryCode = getCountryCodeFromEventTarget(e.target);
            if (countryCode) {
                const continent = continentsData[countryCode];
                gameState.selectedContinent = continent;
                render();
                setTimeout(() => checkContinentAnswer(continent), 200);
            }
        } else if (gameState.phase === 'SELECTING_COUNTRY') {
            const countryCode = getCountryCodeFromEventTarget(e.target);
            // In continent mode, allow selection from the selected continent
            // In random mode, allow selection from the current country's continent
            const targetContinent = gameState.mode === 'CONTINENT' ? gameState.selectedContinentForMode : currentContinent;

            if (countryCode && continentsData[countryCode] === targetContinent) {
                gameState.selectedCountry = countryCode;
                render();
                setTimeout(() => checkCountryAnswer(countryCode), 200);
            }
        }
    });

    // Mouse Pan & Zoom
    // Remove individual wheel, down, move, up listeners as D3's zoom behavior will handle these
    // svgContainer.addEventListener('wheel', handleMouseWheel);
    // svgContainer.addEventListener('mousedown', handleMouseDown);
    // svgContainer.addEventListener('mousemove', handleMouseMove);
    // svgContainer.addEventListener('mouseup', handleMouseUp);
    // svgContainer.addEventListener('mouseleave', handleMouseUp); // End panning if mouse leaves container

    // D3 Zoom behavior
    const zoomBehavior = d3.zoom()
        .scaleExtent([1, 8]) // Example: allow zooming from 1x to 8x
        .on("zoom", (event) => {
            zoomTransform = event.transform;
            applyZoomAndPan();
        });

    svg.call(zoomBehavior);
}

function showModal(title, body, onHiddenCallback) {
    gameModalTitle.textContent = title;
    gameModalBody.textContent = body;
    gameModal.show();

    if (onHiddenCallback) {
        gameModalElement.addEventListener('hidden.bs.modal', onHiddenCallback, { once: true });
    }
}


// --- GAME LOGIC ---

function checkContinentAnswer(selectedContinent) {
    if (selectedContinent === currentContinent) {
        gameState.continentIncorrectAttempts = 0; // Reset counter on correct answer
        gameState.isShowingAnswer = false; // Reset flag when moving to next phase
        showModal('Correct!', `Yes, ${currentCountryName} is in ${currentContinent}.`, () => {
            transitionToState('SELECTING_COUNTRY');
        });
    } else {
        gameState.continentIncorrectAttempts++;
        if (gameState.continentIncorrectAttempts >= 3) {
            // Show correct answer after 3 incorrect attempts
            showModal('Too many attempts!', `The correct answer is ${currentContinent}. ${currentCountryName} is located in ${currentContinent}.`, () => {
                // In continent mode, skip to country selection since continent is already known
                if (gameState.mode === 'CONTINENT') {
                    transitionToState('SELECTING_COUNTRY');
                } else {
                    transitionToState('SELECTING_COUNTRY');
                }
            });
            gameState.continentIncorrectAttempts = 0; // Reset counter
        } else {
            showModal('Wrong Continent!', 'That\'s not the right continent. Please try again.', () => {
                transitionToState('SELECTING_CONTINENT');
            });
        }
    }
}

function checkCountryAnswer(selectedCountry) {
    if (selectedCountry === currentCountryCode) {
        gameState.countryIncorrectAttempts = 0; // Reset counter on correct answer
        gameState.isShowingAnswer = false; // Reset flag when correct answer is given
        gameState.correctCountry = selectedCountry;
        render();

        showModal('You found it!', `Awesome! You found ${currentCountryName}.`, () => {
            setTimeout(() => {
                pickNewCountry();
                // In continent mode, stay in country selection phase
                if (gameState.mode === 'CONTINENT') {
                    transitionToState('SELECTING_COUNTRY');
                } else {
                    transitionToState('SELECTING_CONTINENT');
                }
            }, 500);
        });

    } else {
        gameState.countryIncorrectAttempts++;
        if (gameState.countryIncorrectAttempts >= 3) {
            // Highlight the correct country in blue after 3 incorrect attempts
            gameState.correctCountry = currentCountryCode;
            gameState.isShowingAnswer = true; // Set flag to show answer in blue
            render();

            // Zoom to the correct country before showing the modal
            zoomToCountry(currentCountryCode);

            // Show correct answer after 3 incorrect attempts
            showModal('Too many attempts!', `The correct answer is ${currentCountryName}. It's located in ${currentContinent}.`, () => {
                setTimeout(() => {
                    // Reset highlighting of the correct answer
                    gameState.correctCountry = null;
                    gameState.isShowingAnswer = false; // Reset the flag
                    render();

                    pickNewCountry();
                    // In continent mode, stay in country selection phase
                    if (gameState.mode === 'CONTINENT') {
                        transitionToState('SELECTING_COUNTRY');
                    } else {
                        transitionToState('SELECTING_CONTINENT');
                    }
                }, 1500);
            });
            gameState.countryIncorrectAttempts = 0; // Reset counter
        } else {
            showModal('Not quite...', 'That\'s not the right country. Try again!', () => {
                gameState.selectedCountry = null; // Reset selection
                render();
            });
        }
    }
}

function pickNewCountry() {
    let allCountryCodes;

    if (gameState.mode === 'CONTINENT' && gameState.selectedContinentForMode) {
        // In continent mode, pick from the selected continent only
        allCountryCodes = gameData[gameState.selectedContinentForMode];
    } else {
        // In random mode, pick from all countries
        allCountryCodes = Object.keys(countryNamesData);
    }

    // Filter out countries that don't have valid data in our GeoJSON
    const validCountryCodes = allCountryCodes.filter(code => {
        const countryName = countryNamesData[code];
        // Find if this country name exists in our GeoJSON features
        return validFeatures.some(feature =>
            countryNameToCodeMap[feature.properties.name] === code
        );
    });

    if (validCountryCodes.length === 0) {
        console.error("No valid countries found for the selected continent");
        return;
    }

    const randomCountryCode = validCountryCodes[Math.floor(Math.random() * validCountryCodes.length)];

    currentCountryCode = randomCountryCode;
    currentCountryName = countryNamesData[randomCountryCode];
    currentContinent = continentsData[randomCountryCode];
    gameState.correctCountry = null;

    // Reset attempt counters for new question
    gameState.continentIncorrectAttempts = 0;
    gameState.countryIncorrectAttempts = 0;
    gameState.isShowingAnswer = false; // Reset flag for new question
}

function getCountryCodeFromEventTarget(target) {
    // In D3, the country elements are 'path' elements directly
    // We check if the target itself is a path with an ID
    if (target.tagName === 'path' && target.id && continentsData[target.id]) {
        return target.id;
    }
    // If a path's child (e.g., a title tag) is clicked, find the parent path
    let currentElement = target;
    while (currentElement && currentElement.tagName !== 'svg') {
        if (currentElement.tagName === 'path' && currentElement.id && continentsData[currentElement.id]) {
            return currentElement.id;
        }
        currentElement = currentElement.parentNode;
    }
    return null;
}

// --- VIEW & CONTROLS ---

function setupControls() {
    zoomInButton.addEventListener('click', () => zoom(1.2));
    zoomOutButton.addEventListener('click', () => zoom(0.8));
    panUpButton.addEventListener('click', () => pan(0, 50)); // Adjusted pan values for consistency
    panDownButton.addEventListener('click', () => pan(0, -50));
    panLeftButton.addEventListener('click', () => pan(50, 0));
    panRightButton.addEventListener('click', () => pan(-50, 0));
    resetViewButton.addEventListener('click', () => resetZoomAndPan());
    restartGameButton.addEventListener('click', () => restartGame());
}

// Function to apply zoom and pan transformations
function applyZoomAndPan() {
    svg.select(".countries").attr("transform", zoomTransform);
}

function resetZoomAndPan() {
    zoomTransform = d3.zoomIdentity;
    svg.transition().duration(750).call(d3.zoom().transform, d3.zoomIdentity);
    applyZoomAndPan();
}

function restartGame() {
    // Reset game state
    gameState.mode = null;
    gameState.selectedContinentForMode = null;
    gameState.phase = null;
    gameState.isShowingAnswer = false; // Reset flag when restarting

    // Show setup container and hide game container
    setupContainer.style.display = 'block';
    gameContainer.style.display = 'none';

    // Reset setup UI
    continentSelectionDiv.style.display = 'none';
}


function resetView() {
    resetZoomAndPan();
}

function zoom(factor) {
    const center = [svg.attr("width") / 2, svg.attr("height") / 2];
    const newZoomTransform = zoomTransform
        .translate(center[0], center[1])
        .scale(factor)
        .translate(-center[0], -center[1]);
    
    svg.transition().duration(200).call(d3.zoom().transform, newZoomTransform);
    zoomTransform = newZoomTransform;
    applyZoomAndPan();
}

function pan(dx, dy) {
    const newZoomTransform = zoomTransform.translate(dx, dy);
    svg.transition().duration(50).call(d3.zoom().transform, newZoomTransform);
    zoomTransform = newZoomTransform;
    applyZoomAndPan();
}


function resetViewToContinent(targetContinent = null) {
    const width = +svg.attr("width");
    const height = +svg.attr("height");

    // Determine which continent to zoom to
    const continentToZoom = targetContinent || currentContinent;

    // Filter features for the target continent from the same valid features used for rendering
    const featuresOfContinent = validFeatures.filter(d => {
        const countryName = d.properties.name;
        const countryCode = countryNameToCodeMap[countryName];
        return continentsData[countryCode] === continentToZoom;
    });

    if (featuresOfContinent.length === 0) {
        console.warn(`No features found for continent: ${continentToZoom}`);
        resetZoomAndPan(); // Fallback to default view
        return;
    }

    const bounds = path.bounds({
        type: "FeatureCollection",
        features: featuresOfContinent
    });

    const dx = bounds[1][0] - bounds[0][0];
    const dy = bounds[1][1] - bounds[0][1];
    const x = (bounds[0][0] + bounds[1][0]) / 2;
    const y = (bounds[0][1] + bounds[1][1]) / 2;

    const scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height)));
    const translate = [width / 2 - scale * x, height / 2 - scale * y];

    zoomTransform = d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale);
    svg.transition().duration(750).call(d3.zoom().transform, zoomTransform);
    applyZoomAndPan();
}

// Function to zoom to a specific country
function zoomToCountry(countryCode) {
    const width = +svg.attr("width");
    const height = +svg.attr("height");

    // Find the feature for the specific country
    const countryFeature = validFeatures.find(d => {
        const featureCountryCode = countryNameToCodeMap[d.properties.name];
        return featureCountryCode === countryCode;
    });

    if (!countryFeature) {
        console.warn(`Country feature not found for code: ${countryCode}`);
        return;
    }

    // Calculate bounds for the specific country
    const bounds = path.bounds(countryFeature);

    const dx = bounds[1][0] - bounds[0][0];
    const dy = bounds[1][1] - bounds[0][1];
    const x = (bounds[0][0] + bounds[1][0]) / 2;
    const y = (bounds[0][1] + bounds[1][1]) / 2;

    // Calculate scale to make the country occupy at least 40% of the map area
    // Using 0.4 (40%) as the minimum area factor
    const minScaleFactor = 0.4;
    const scaleX = width / dx;
    const scaleY = height / dy;
    const scaleToFit = Math.min(scaleX, scaleY);
    const scale = Math.max(1, Math.min(8, scaleToFit * Math.sqrt(minScaleFactor)));

    const translate = [width / 2 - scale * x, height / 2 - scale * y];

    zoomTransform = d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale);
    svg.transition().duration(750).call(d3.zoom().transform, zoomTransform);
    applyZoomAndPan();
}

// --- MOUSE & TOUCH PAN/ZOOM HANDLERS ---

// --- START GAME ---

initGame();