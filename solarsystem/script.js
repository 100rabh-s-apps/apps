let selectedDifficulty = 'Easy';
let filteredQuestions = [];

function startGame(difficulty) {
    selectedDifficulty = difficulty;
    document.getElementById('difficulty-selection').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    filteredQuestions = questions.filter(q => q.level === selectedDifficulty);
    score = 0;
    totalQuestions = 0;
    document.getElementById('score').textContent = '0';
    document.getElementById('total').textContent = '0';
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';
    nextQuestion();
}

const questions = [
    {question: "Which planet is closest to the Sun?", answer: "Mercury", level: "Easy"},
    {question: "Which planet is known as the 'Red Planet'?", answer: "Mars", level: "Easy"},
    {question: "Which is the largest planet in our solar system?", answer: "Jupiter", level: "Easy"},
    {question: "What is the only planet currently known to support life?", answer: "Earth", level: "Easy"},
    {question: "Which planet is famous for its extensive and beautiful ring system?", answer: "Saturn", level: "Easy"},
    {question: "What is the hottest planet in our solar system?", answer: "Venus", level: "Easy"},
    {question: "Which planet is the eighth and farthest from the Sun?", answer: "Neptune", level: "Easy"},
    {question: "Which planet is unique for rotating on its side?", answer: "Uranus", level: "Easy"},
    {question: "What is the smallest planet in our solar system?", answer: "Mercury", level: "Easy"},
    {question: "Which planet is often called Earth's 'sister planet' due to its similar size and mass?", answer: "Venus", level: "Easy"},
    {question: "What is the third planet from the Sun?", answer: "Earth", level: "Easy"},
    {question: "Which planet is home to the Great Red Spot, a storm larger than Earth?", answer: "Jupiter", level: "Easy"},
    {question: "Which planet is named after the Roman god of war?", answer: "Mars", level: "Medium"},
    {question: "Which planet is named after the Roman king of the gods?", answer: "Jupiter", level: "Medium"},
    {question: "On which planet is the solar system's largest volcano, Olympus Mons, located?", answer: "Mars", level: "Medium"},
    {question: "Which planet is the second largest in the solar system?", answer: "Saturn", level: "Easy"},
    {question: "Which planet has two small moons named Phobos and Deimos?", answer: "Mars", level: "Medium"},
    {question: "Which planet has the shortest year, completing an orbit in just 88 Earth days?", answer: "Mercury", level: "Medium"},
    {question: "Which planet is often seen as a bright 'Morning Star' or 'Evening Star'?", answer: "Venus", level: "Medium"},
    {question: "Which planet's name is the only one not derived from Greco-Roman mythology?", answer: "Earth", level: "Medium"},
    {question: "Which planet has the shortest day, rotating once in less than 10 hours?", answer: "Jupiter", level: "Medium"},
    {question: "Which is the least dense planet, so light it would float in water?", answer: "Saturn", level: "Medium"},
    {question: "Which planet was the first to be discovered using a telescope?", answer: "Uranus", level: "Medium"},
    {question: "Which planet is named after the Roman god of the sea?", answer: "Neptune", level: "Medium"},
    {question: "Which planet has a single day that is longer than its entire year?", answer: "Venus", level: "Hard"},
    {question: "Which planet is an ice giant and appears a pale blue-green color due to methane?", answer: "Uranus", level: "Medium"},
    {question: "The atmosphere of which planet is composed primarily of hydrogen and helium?", answer: "Jupiter", level: "Medium"},
    {question: "Which planet has a thick, toxic atmosphere that traps heat, causing a runaway greenhouse effect?", answer: "Venus", level: "Medium"},
    {question: "Which airless planet experiences the greatest temperature extremes in the solar system?", answer: "Mercury", level: "Hard"},
    {question: "Which planet's surface is marked by Valles Marineris, a canyon system that dwarfs the Grand Canyon?", answer: "Mars", level: "Hard"},
    {question: "Which planet boasts the fastest winds in the solar system, reaching speeds over 1,200 mph?", answer: "Neptune", level: "Hard"},
    {question: "Which planet rotates backward (retrograde rotation) compared to most other planets?", answer: "Venus", level: "Medium"},
    {question: "Which planet has the most eccentric, or non-circular, orbit of all the planets?", answer: "Mercury", level: "Hard"},
    {question: "The four large Galilean moons (Io, Europa, Ganymede, and Callisto) orbit which planet?", answer: "Jupiter", level: "Hard"},
    {question: "The moon Titan, the only moon with a thick atmosphere, orbits which planet?", answer: "Saturn", level: "Hard"},
    {question: "Which planet's existence was mathematically predicted before it was directly observed?", answer: "Neptune", level: "Hard"},
    {question: "Which planet is the densest in the entire solar system?", answer: "Earth", level: "Hard"},
    {question: "Which planet has a mysterious hexagonal-shaped storm at its north pole?", answer: "Saturn", level: "Hard"},
    {question: "Which planet's moons are mostly named after characters from the works of William Shakespeare?", answer: "Uranus", level: "Hard"},
    {question: "Which planet was studied in detail by the MESSENGER spacecraft, which orbited it from 2011 to 2015?", answer: "Mercury", level: "Hard"},
    {question: "Which planet's largest moon, Triton, has a retrograde orbit and active geysers?", answer: "Neptune", level: "Hard"},
    {question: "Which planet has the coldest recorded planetary atmosphere in the solar system?", answer: "Uranus", level: "Hard"},
    {question: "The rovers Spirit, Opportunity, and Curiosity explored the surface of which planet?", answer: "Mars", level: "Medium"},
    {question: "Which planet's powerful magnetic field protects it from solar winds and creates the auroras?", answer: "Earth", level: "Medium"},
    {question: "Which planet, along with Venus, is one of the two planets without any natural moons?", answer: "Mercury", level: "Medium"},
    {question: "Which planet is named after the Roman god of agriculture and wealth?", answer: "Saturn", level: "Medium"},
    {question: "Which planet is more than twice as massive as all the other planets in the solar system combined?", answer: "Jupiter", level: "Medium"},
    {question: "The Great Dark Spot, a storm system observed by Voyager 2 in 1989, was on which planet?", answer: "Neptune", level: "Medium"},
    {question: "Which planet has a rotational period, or day, that is very similar in length to Earth's?", answer: "Mars", level: "Medium"},
    {question: "Which planet is the fourth planet from the Sun?", answer: "Mars", level: "Easy"},
    {question: "Which planet is the second planet from the Sun?", answer: "Venus", level: "Easy"},
    {question: "Which planet is the fifth planet from the Sun?", answer: "Jupiter", level: "Easy"},
    {question: "Which planet is the sixth planet from the Sun?", answer: "Saturn", level: "Easy"},
    {question: "Which planet is the seventh planet from the Sun?", answer: "Uranus", level: "Easy"},
    {question: "Which planet has a massive iron core that makes up about 75% of its diameter?", answer: "Mercury", level: "Hard"},
    {question: "Which planet is thought to have the most volcanoes of any planet in the solar system?", answer: "Venus", level: "Hard"},
    {question: "On which planet is the magnetic field so tilted that a compass would point far from its rotational pole?", answer: "Uranus", level: "Hard"},
    {question: "Which planet has the longest orbital period, taking nearly 165 Earth years to circle the Sun?", answer: "Neptune", level: "Medium"},
    {question: "Which planet is the only one in our solar system where active plate tectonics have been confirmed?", answer: "Earth", level: "Medium"},
    {question: "Which planet is the only one named after a Greek deity rather than a Roman one?", answer: "Uranus", level: "Medium"},
    {question: "Which planet has a crushing surface pressure over 90 times that of Earth's?", answer: "Venus", level: "Hard"},
    {question: "Which planet is the smallest of the four giant planets?", answer: "Neptune", level: "Medium"},
    {question: "Which planet's famous rings are made mostly of particles of water ice?", answer: "Saturn", level: "Medium"},
    {question: "Global dust storms that can obscure the entire surface are a weather feature of which planet?", answer: "Mars", level: "Hard"},
    {question: "Which planet is the densest of all the giant planets?", answer: "Neptune", level: "Hard"},
    {question: "The Juno mission, which entered orbit in 2016, was sent to study which planet?", answer: "Jupiter", level: "Hard"},
    {question: "Which planet's axial tilt of about 23.5 degrees is responsible for its seasons?", answer: "Earth", level: "Easy"},
    {question: "Which planet is named after the swift-footed Roman messenger of the gods?", answer: "Mercury", level: "Medium"},
    {question: "Which planet has polar ice caps made of both water ice and frozen carbon dioxide (dry ice)?", answer: "Mars", level: "Medium"},
    {question: "Which gas giant is known for its pale yellow and white atmospheric bands?", answer: "Saturn", level: "Medium"},
    {question: "Which ice giant is known for its deep blue color and surprisingly active weather?", answer: "Neptune", level: "Medium"},
    {question: "The Cassini-Huygens probe spent 13 years studying which planet and its complex system of moons and rings?", answer: "Saturn", level: "Hard"},
    {question: "Voyager 2 is the only spacecraft to have made a close-up visit to which ice giant?", answer: "Uranus", level: "Hard"},
    {question: "Which planet, the second largest by diameter, is the outermost planet visible without a telescope?", answer: "Saturn", level: "Easy"},
    {question: "Which planet's largest moon, Ganymede, is bigger than the planet Mercury?", answer: "Jupiter", level: "Hard"},
    {question: "Which planet has an atmosphere that is about 95% carbon dioxide?", answer: "Mars", level: "Medium"},
    {question: "Which planet often appears almost featureless in visible light, like a placid blue ball?", answer: "Uranus", level: "Medium"},
    {question: "Which planet has the most confirmed moons in the solar system?", answer: "Jupiter", level: "Medium"},
    {question: "The Mariner 10 mission performed three flybys of which rocky cratered world?", answer: "Mercury", level: "Hard"},
    {question: "Which planet has a day lasting approximately 10 Earth hours?", answer: "Jupiter", level: "Medium"},
    {question: "Which planet has a day lasting approximately 17 Earth hours?", answer: "Uranus", level: "Medium"},
    {question: "Which planet has a day lasting approximately 16 Earth hours?", answer: "Neptune", level: "Medium"},
    {question: "Which planet has a day lasting an incredible 243 Earth days?", answer: "Venus", level: "Hard"},
    {question: "After the Moon, which planet is often the brightest natural object in the night sky?", answer: "Venus", level: "Easy"},
    {question: "Which gas giant has a faint dark ring system that was discovered by the Voyager 1 spacecraft?", answer: "Jupiter", level: "Medium"},
    {question: "This planet's rings were first seen by Galileo in 1610, though he mistook them for 'ears' or moons.", answer: "Saturn", level: "Easy"},
    {question: "Which planet experiences a periodic major storm known as the 'Great White Spot'?", answer: "Saturn", level: "Hard"},
    {question: "This rocky planet has a core that has mostly cooled, leaving it with a very weak global magnetic field.", answer: "Mars", level: "Medium"},
    {question: "This planet's magnetic field is bizarrely tilted at about 47 degrees from its axis of rotation.", answer: "Neptune", level: "Hard"},
    {question: "Which planet's atmosphere is 96.5% carbon dioxide, creating the most intense greenhouse effect in the solar system?", answer: "Venus", level: "Hard"},
    {question: "Which planet's lack of a substantial atmosphere prevents it from retaining heat?", answer: "Mercury", level: "Easy"},
    {question: "Which planet is home to the Tharsis Montes, a huge volcanic plateau?", answer: "Mars", level: "Hard"},
    {question: "The discovery of which planet in 1781 is credited to astronomer William Herschel?", answer: "Uranus", level: "Medium"},
    {question: "Which planet's deep blue color comes from methane in its atmosphere, which absorbs red light?", answer: "Neptune", level: "Medium"},
    {question: "Which planet is the only one with liquid water on its surface?", answer: "Earth", level: "Easy"}
];

let currentQuestionIndex = 0;
let score = 0;
let totalQuestions = 0;
let selectedPlanet = null;
let answered = false;

function initGame() {
    // handled by startGame
}

function selectPlanet(planet) {
    if (answered) return;
    
    document.querySelectorAll('.planet').forEach(p => {
        p.classList.remove('selected');
    });
    
    const planetElement = document.querySelector('.' + planet.toLowerCase());
    planetElement.classList.add('selected');
    selectedPlanet = planet;
    
    checkAnswer();
}

function nextQuestion() {
    document.querySelectorAll('.planet').forEach(p => {
        p.classList.remove('selected');
        p.classList.remove('correct-answer');
    });
    
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';
    
    answered = false;
    
    currentQuestionIndex = Math.floor(Math.random() * filteredQuestions.length);
    const currentQuestion = filteredQuestions[currentQuestionIndex];
    
    document.getElementById('question').textContent = currentQuestion.question;
    
    const difficultyEl = document.getElementById('difficulty');
    difficultyEl.textContent = currentQuestion.level;
    difficultyEl.className = 'difficulty ' + currentQuestion.level.toLowerCase();
    
    selectedPlanet = null;
}

function checkAnswer() {
    if (selectedPlanet === null) {
        alert('Please select a planet!');
        return;
    }
    
    answered = true;
    
    const currentQuestion = filteredQuestions[currentQuestionIndex];
    const isCorrect = selectedPlanet === currentQuestion.answer;
    
    const feedbackEl = document.getElementById('feedback');
    
    if (isCorrect) {
        feedbackEl.textContent = 'Correct! Well done!';
        feedbackEl.className = 'feedback correct';
        score++;
    } else {
        feedbackEl.textContent = `Incorrect. The correct answer is ${currentQuestion.answer}.`;
        feedbackEl.className = 'feedback incorrect';
        const correctPlanetElement = document.querySelector('.' + currentQuestion.answer.toLowerCase());
        correctPlanetElement.classList.add('correct-answer');
    }
    
    totalQuestions++;
    document.getElementById('score').textContent = score;
    document.getElementById('total').textContent = totalQuestions;

    setTimeout(nextQuestion, 5000);
}

function resetGame() {
    document.getElementById('difficulty-selection').style.display = 'block';
    document.getElementById('quiz-container').style.display = 'none';
}

window.onload = initGame;
