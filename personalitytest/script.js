const quizData = [
    {
        question: "You find it easy to introduce yourself to other people.",
        options: [
            { text: "Agree", value: "E" },
            { text: "Disagree", value: "I" }
        ]
    },
    {
        question: "You often get so lost in thoughts that you ignore or forget your surroundings.",
        options: [
            { text: "Agree", value: "N" },
            { text: "Disagree", value: "S" }
        ]
    },
    {
        question: "You try to respond to your e-mails as soon as possible and cannot stand a messy inbox.",
        options: [
            { text: "Agree", value: "J" },
            { text: "Disagree", value: "P" }
        ]
    },
    {
        question: "You feel comfortable just walking up to someone you find interesting and striking up a conversation.",
        options: [
            { text: "Agree", value: "E" },
            { text: "Disagree", value: "I" }
        ]
    },
    {
        question: "You are more of a detail-oriented person than a big-picture person.",
        options: [
            { text: "Agree", value: "S" },
            { text: "Disagree", value: "N" }
        ]
    },
    {
        question: "You are more of a planner than a spontaneous person.",
        options: [
            { text: "Agree", value: "J" },
            { text: "Disagree", value: "P" }
        ]
    },
    {
        question: "When making decisions, you focus more on logic and facts than on people's feelings.",
        options: [
            { text: "Agree", value: "T" },
            { text: "Disagree", value: "F" }
        ]
    },
    {
        question: "You prefer to have a few close friends rather than many acquaintances.",
        options: [
            { text: "Agree", value: "I" },
            { text: "Disagree", value: "E" }
        ]
    },
    {
        question: "You are intrigued by abstract ideas and theories.",
        options: [
            { text: "Agree", value: "N" },
            { text: "Disagree", value: "S" }
        ]
    },
    {
        question: "You like to have a to-do list and stick to it.",
        options: [
            { text: "Agree", value: "J" },
            { text: "Disagree", value: "P" }
        ]
    },
    {
        question: "You are guided more by your heart than your head.",
        options: [
            { text: "Agree", value: "F" },
            { text: "Disagree", value: "T" }
        ]
    },
    {
        question: "You enjoy being the center of attention.",
        options: [
            { text: "Agree", value: "E" },
            { text: "Disagree", value: "I" }
        ]
    },
    {
        question: "You are more interested in the possibilities of a situation than the reality of it.",
        options: [
            { text: "Agree", value: "N" },
            { text: "Disagree", value: "S" }
        ]
    },
    {
        question: "You like to keep your options open rather than commit to a plan.",
        options: [
            { text: "Agree", value: "P" },
            { text: "Disagree", value: "J" }
        ]
    },
    {
        question: "You value harmony and empathy in your relationships.",
        options: [
            { text: "Agree", value: "F" },
            { text: "Disagree", value: "T" }
        ]
    },
    {
        question: "You are a private person and prefer not to share too much about yourself.",
        options: [
            { text: "Agree", value: "I" },
            { text: "Disagree", value: "E" }
        ]
    },
    {
        question: "You are a practical and down-to-earth person.",
        options: [
            { text: "Agree", value: "S" },
            { text: "Disagree", value: "N" }
        ]
    },
    {
        question: "You are a decisive person and like to have things settled.",
        options: [
            { text: "Agree", value: "J" },
            { text: "Disagree", value: "P" }
        ]
    },
    {
        question: "You are a logical and objective person.",
        options: [
            { text: "Agree", value: "T" },
            { text: "Disagree", value: "F" }
        ]
    },
    {
        question: "You are an outgoing and sociable person.",
        options: [
            { text: "Agree", value: "E" },
            { text: "Disagree", value: "I" }
        ]
    },
    {
        question: "You are an imaginative and creative person.",
        options: [
            { text: "Agree", value: "N" },
            { text: "Disagree", value: "S" }
        ]
    },
    {
        question: "You are a flexible and adaptable person.",
        options: [
            { text: "Agree", value: "P" },
            { text: "Disagree", value: "J" }
        ]
    },
    {
        question: "You are a compassionate and caring person.",
        options: [
            { text: "Agree", value: "F" },
            { text: "Disagree", value: "T" }
        ]
    },
    {
        question: "You prefer to work alone rather than in a group.",
        options: [
            { text: "Agree", value: "I" },
            { text: "Disagree", value: "E" }
        ]
    },
    {
        question: "You are a realistic and sensible person.",
        options: [
            { text: "Agree", value: "S" },
            { text: "Disagree", value: "N" }
        ]
    },
    {
        question: "You are an organized and methodical person.",
        options: [
            { text: "Agree", value: "J" },
            { text: "Disagree", value: "P" }
        ]
    },
    {
        question: "You are a critical and analytical person.",
        options: [
            { text: "Agree", value: "T" },
            { text: "Disagree", value: "F" }
        ]
    },
    {
        question: "You are an energetic and enthusiastic person.",
        options: [
            { text: "Agree", value: "E" },
            { text: "Disagree", value: "I" }
        ]
    },
    {
        question: "You are a visionary and an idealist.",
        options: [
            { text: "Agree", value: "N" },
            { text: "Disagree", value: "S" }
        ]
    },
    {
        question: "You are a spontaneous and impulsive person.",
        options: [
            { text: "Agree", value: "P" },
            { text: "Disagree", value: "J" }
        ]
    }
];

const quizContainer = document.getElementById('quiz');
const submitButton = document.getElementById('submit');
const resultContainer = document.getElementById('result');
const previousButton = document.getElementById('previous');
const nextButton = document.getElementById('next');
const progressBar = document.getElementById('progressBar');

const resetButton = document.getElementById('reset');

let currentQuestionIndex = 0;
let userAnswers = new Array(quizData.length).fill(null);

function saveProgress() {
    localStorage.setItem('personalityTestAnswers', JSON.stringify(userAnswers));
    localStorage.setItem('personalityTestIndex', currentQuestionIndex);
}

function loadProgress() {
    const savedAnswers = localStorage.getItem('personalityTestAnswers');
    const savedIndex = localStorage.getItem('personalityTestIndex');

    if (savedAnswers) {
        userAnswers = JSON.parse(savedAnswers);
    }

    if (savedIndex) {
        currentQuestionIndex = parseInt(savedIndex, 10);
    }

    if (savedAnswers || savedIndex) {
        resetButton.style.display = 'inline-block';
    }
}

function resetQuiz() {
    localStorage.removeItem('personalityTestAnswers');
    localStorage.removeItem('personalityTestIndex');
    location.reload();
}

resetButton.addEventListener('click', resetQuiz);

function displayQuestion() {
    quizContainer.innerHTML = '';
    resultContainer.textContent = '';

    const questionData = quizData[currentQuestionIndex];

    const questionElement = document.createElement('div');
    questionElement.classList.add('mb-6');

    const questionText = document.createElement('p');
    questionText.classList.add('text-xl', 'font-semibold', 'mb-4');
    questionText.textContent = `${currentQuestionIndex + 1}. ${questionData.question}`;
    questionElement.appendChild(questionText);

    const optionsElement = document.createElement('div');
    optionsElement.classList.add('flex', 'flex-col', 'space-y-2');

    questionData.options.forEach(option => {
        const label = document.createElement('label');
        label.classList.add('flex', 'items-center', 'p-4', 'border', 'rounded-lg', 'cursor-pointer', 'hover:bg-gray-200');

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = `question${currentQuestionIndex}`;
        radio.value = option.value;
        radio.classList.add('mr-4');
        radio.addEventListener('change', (event) => {
            userAnswers[currentQuestionIndex] = event.target.value;
            saveProgress();
        });

        if (userAnswers[currentQuestionIndex] === option.value) {
            radio.checked = true;
            label.classList.add('bg-blue-100', 'border-blue-500');
        }

        label.appendChild(radio);
        label.appendChild(document.createTextNode(option.text));
        optionsElement.appendChild(label);
    });

    questionElement.appendChild(optionsElement);
    quizContainer.appendChild(questionElement);

    // Update button visibility
    previousButton.style.display = currentQuestionIndex === 0 ? 'none' : 'inline-block';
    nextButton.style.display = currentQuestionIndex === quizData.length - 1 ? 'none' : 'inline-block';
    submitButton.style.display = currentQuestionIndex === quizData.length - 1 ? 'inline-block' : 'none';

    // Update progress bar
    const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;
    progressBar.style.width = `${progress}%`;
}

const personalityTypes = {
    "ISTJ": {
        "title": "The Inspector",
        "description": "ISTJs are responsible, sincere, analytical, reserved, realistic, and systematic. They are hardworking and trustworthy with sound practical judgment. They are often seen as the bedrock of society, the kind of people who keep things running smoothly and efficiently. They have a deep respect for facts, details, and established procedures. They are not interested in theories or abstract ideas unless they have a practical application. Their focus is on the here and now, and they are meticulous in their work, ensuring that everything is done correctly and to the highest standard. They are loyal and dependable, and they take their commitments very seriously. They are not the most outgoing of people, and they can be difficult to get to know. They prefer to observe from the sidelines rather than be the center of attention. They are private individuals who do not readily share their thoughts or feelings with others. However, once they do open up, they are found to be warm and caring individuals. They are not comfortable with change, and they prefer to stick to what they know and what has been proven to work. They are not the most creative or innovative of people, but they are excellent at implementing and maintaining systems. They are the kind of people who will always follow the rules and do what is expected of them. They are the backbone of any organization, and they can be counted on to get the job done.",
        "jobs": ["Accountant", "Auditor", "Civil Engineer", "Dentist", "Librarian", "Police Officer", "Supply Chain Manager", "Web Developer"],
        "bestMatches": ["ESTJ", "ISFJ", "ISTP"],
        "antagonizedMatches": ["ENFP", "INFP", "INFJ"]
    },
    "ISFJ": {
        "title": "The Protector",
        "description": "ISFJs are warm, considerate, gentle, responsible, pragmatic, and thorough. They are devoted caretakers who enjoy helping others. ISFJs are known for their kindness, their compassion, and their unwavering commitment to the well-being of others. They are the kind of people who will always be there for you, no matter what. They are excellent listeners, and they are always willing to lend a helping hand. They are not the most outgoing of people, but they are very observant, and they are always aware of the needs of others. They are not comfortable with conflict, and they will go to great lengths to avoid it. They are the kind of people who will always put the needs of others before their own. They are not the most creative or innovative of people, but they are excellent at providing practical support and care. They are the kind of people who will always be there to offer a shoulder to cry on or a listening ear. They are the glue that holds families and communities together, and they can be counted on to always be there for the people they care about.",
        "jobs": ["Child Care Provider", "Counselor", "Customer Service Representative", "Financial Advisor", "Nurse", "Paralegal", "Social Worker", "Teacher"],
        "bestMatches": ["ESFJ", "ISFP", "ISTJ"],
        "antagonizedMatches": ["ENTP", "INTP", "INTJ"]
    },
    "INFJ": {
        "title": "The Advocate",
        "description": "INFJs are idealistic, organized, insightful, dependable, compassionate, and gentle. They are creative and dedicated individuals with a talent for helping others with original solutions to their personal challenges. INFJs are a rare breed, making up less than 1% of the population. They are the kind of people who are always looking for meaning and purpose in their lives. They are not interested in superficialities, and they are always looking for a deeper connection with others. They are not the most outgoing of people, but they are very insightful, and they are always aware of the needs of others. They are not comfortable with conflict, and they will go to great lengths to avoid it. They are the kind of people who will always put the needs of others before their own. They are not the most practical of people, but they are excellent at seeing the big picture and coming up with creative solutions to complex problems. They are the kind of people who will always be there to offer a shoulder to cry on or a listening ear. They are the glue that holds families and communities together, and they can be counted on to always be there for the people they care about.",
        "jobs": ["Artist", "Counselor", "Graphic Designer", "HR Manager", "Librarian", "Psychologist", "Social Worker", "Writer"],
        "bestMatches": ["ENFJ", "INFP", "INTJ"],
        "antagonizedMatches": ["ESTP", "ISTP", "ESFP"]
    },
    "INTJ": {
        "title": "The Architect",
        "description": "INTJs are innovative, independent, strategic, logical, reserved, and insightful. They are driven by their own original ideas to achieve improvements. INTJs are another rare personality type, and they are often seen as the masterminds of the world. They are the kind of people who are always thinking, always planning, and always looking for ways to improve things. They are not interested in small talk or superficialities, and they are always looking for a deeper understanding of the world around them. They are not the most outgoing of people, but they are very insightful, and they are always aware of the needs of others. They are not comfortable with conflict, and they will go to great lengths to avoid it. They are the kind of people who will always put the needs of others before their own. They are not the most practical of people, but they are excellent at seeing the big picture and coming up with creative solutions to complex problems. They are the kind of people who will always be there to offer a shoulder to cry on or a listening ear. They are the glue that holds families and communities together, and they can be counted on to always be there for the people they care about.",
        "jobs": ["Architect", "Computer Scientist", "Engineer", "Financial Analyst", "Lawyer", "Management Consultant", "Scientist", "Software Developer"],
        "bestMatches": ["ENTJ", "INFJ", "INTP"],
        "antagonizedMatches": ["ESFP", "ISFP", "ESTP"]
    },
    "ISTP": {
        "title": "The Crafter",
        "description": "ISTPs are action-oriented, logical, analytical, spontaneous, reserved, and independent. They are fascinated by how things work and are often found using their hands to build, fix, or create things. ISTPs are the kind of people who are always on the move, always looking for the next adventure. They are not interested in sitting around and talking about things; they want to be out there doing things. They are not the most outgoing of people, but they are very observant, and they are always aware of the needs of others. They are not comfortable with conflict, and they will go to great lengths to avoid it. They are the kind of people who will always put the needs of others before their own. They are not the most creative or innovative of people, but they are excellent at providing practical support and care. They are the kind of people who will always be there to offer a shoulder to cry on or a listening ear. They are the glue that holds families and communities together, and they can be counted on to always be there for the people they care about.",
        "jobs": ["Carpenter", "Chef", "Computer Technician", "Electrician", "Engineer", "Mechanic", "Pilot", "Police Officer"],
        "bestMatches": ["ESTP", "ISTJ", "ISFP"],
        "antagonizedMatches": ["ENFJ", "INFJ", "INFP"]
    },
    "ISFP": {
        "title": "The Artist",
        "description": "ISFPs are gentle, sensitive, nurturing, helpful, flexible, and realistic. They are artistic and expressive individuals who enjoy creating beautiful things. ISFPs are the kind of people who are always in touch with their feelings, and they are always looking for ways to express themselves. They are not interested in logic or reason; they are interested in beauty and aesthetics. They are not the most outgoing of people, but they are very observant, and they are always aware of the needs of others. They are not comfortable with conflict, and they will go to great lengths to avoid it. They are the kind of people who will always put the needs of others before their own. They are not the most practical of people, but they are excellent at seeing the beauty in the world and expressing it in their own unique way. They are the kind of people who will always be there to offer a shoulder to cry on or a listening ear. They are the glue that holds families and communities together, and they can be counted on to always be there for the people they care about.",
        "jobs": ["Artist", "Chef", "Fashion Designer", "Florist", "Musician", "Photographer", "Social Worker", "Veterinarian"],
        "bestMatches": ["ESFP", "ISFJ", "ISTP"],
        "antagonizedMatches": ["ENTJ", "INTJ", "ENTP"]
    },
    "INFP": {
        "title": "The Mediator",
        "description": "INFPs are sensitive, creative, idealistic, perceptive, caring, and loyal. They value inner harmony and personal growth, and have a talent for seeing the good in others. INFPs are the kind of people who are always looking for the good in the world, and they are always looking for ways to make the world a better place. They are not interested in logic or reason; they are interested in feelings and emotions. They are not the most outgoing of people, but they are very observant, and they are always aware of the needs of others. They are not comfortable with conflict, and they will go to great lengths to avoid it. They are the kind of people who will always put the needs of others before their own. They are not the most practical of people, but they are excellent at seeing the good in others and helping them to see it in themselves. They are the kind of people who will always be there to offer a shoulder to cry on or a listening ear. They are the glue that holds families and communities together, and they can be counted on to always be there for the people they care about.",
        "jobs": ["Actor", "Artist", "Counselor", "Graphic Designer", "Librarian", "Psychologist", "Social Worker", "Writer"],
        "bestMatches": ["ENFP", "INFJ", "INTP"],
        "antagonizedMatches": ["ESTJ", "ISTJ", "ESFJ"]
    },
    "INTP": {
        "title": "The Thinker",
        "description": "INTPs are intellectual, logical, precise, reserved, flexible, and imaginative. They are fascinated by logical analysis, systems, and design. INTPs are the kind of people who are always thinking, always analyzing, and always looking for ways to understand the world around them. They are not interested in feelings or emotions; they are interested in logic and reason. They are not the most outgoing of people, but they are very observant, and they are always aware of the needs of others. They are not comfortable with conflict, and they will go to great lengths to avoid it. They are the kind of people who will always put the needs of others before their own. They are not the most practical of people, but they are excellent at seeing the big picture and coming up with creative solutions to complex problems. They are the kind of people who will always be there to offer a shoulder to cry on or a listening ear. They are the glue that holds families and communities together, and they can be counted on to always be there for the people they care about.",
        "jobs": ["Computer Programmer", "Computer Scientist", "Engineer", "Financial Analyst", "Mathematician", "Philosopher", "Professor", "Scientist"],
        "bestMatches": ["ENTP", "INTJ", "INFP"],
        "antagonizedMatches": ["ESFJ", "ISFJ", "ESTJ"]
    },
    "ESTP": {
        "title": "The Dynamo",
        "description": "ESTPs are energetic, enthusiastic, action-oriented, realistic, spontaneous, and playful. They are masters of the art of influencing others. ESTPs are the kind of people who are always on the move, always looking for the next adventure. They are not interested in sitting around and talking about things; they want to be out there doing things. They are the most outgoing of people, and they are always the life of the party. They are not comfortable with boredom, and they will go to great lengths to avoid it. They are the kind of people who will always put their own needs before the needs of others. They are not the most creative or innovative of people, but they are excellent at getting things done. They are the kind of people who will always be there to get the party started. They are the spark that ignites the fire, and they can be counted on to always be there to make things happen.",
        "jobs": ["Actor", "Bartender", "Entrepreneur", "Firefighter", "Marketing Manager", "Paramedic", "Sales Manager", "Sports Coach"],
        "bestMatches": ["ISTP", "ESTJ", "ESFP"],
        "antagonizedMatches": ["INFJ", "ENFJ", "INFP"]
    },
    "ESFP": {
        "title": "The Performer",
        "description": "ESFPs are playful, enthusiastic, friendly, spontaneous, tactful, and flexible. They are vivacious entertainers who charm and engage those around them. ESFPs are the kind of people who are always on the move, always looking for the next adventure. They are not interested in sitting around and talking about things; they want to be out there doing things. They are the most outgoing of people, and they are always the life of the party. They are not comfortable with boredom, and they will go to great lengths to avoid it. They are the kind of people who will always put their own needs before the needs of others. They are not the most creative or innovative of people, but they are excellent at getting things done. They are the kind of people who will always be there to get the party started. They are the spark that ignites the fire, and they can be counted on to always be there to make things happen.",
        "jobs": ["Actor", "Comedian", "Dancer", "Event Planner", "Flight Attendant", "Musician", "Sales Representative", "Tour Guide"],
        "bestMatches": ["ISFP", "ESTP", "ESFJ"],
        "antagonizedMatches": ["INTJ", "ENTJ", "INFJ"]
    },
    "ENFP": {
        "title": "The Champion",
        "description": "ENFPs are enthusiastic, creative, spontaneous, optimistic, supportive, and playful. They are imaginative and open-minded individuals who see possibilities everywhere. ENFPs are the kind of people who are always on the move, always looking for the next adventure. They are not interested in sitting around and talking about things; they want to be out there doing things. They are the most outgoing of people, and they are always the life of the party. They are not comfortable with boredom, and they will go to great lengths to avoid it. They are the kind of people who will always put their own needs before the needs of others. They are not the most creative or innovative of people, but they are excellent at getting things done. They are the kind of people who will always be there to get the party started. They are the spark that ignites the fire, and they can be counted on to always be there to make things happen.",
        "jobs": ["Actor", "Advertising Creative", "Art Director", "Consultant", "Entrepreneur", "Journalist", "Politician", "Writer"],
        "bestMatches": ["INFP", "ENFJ", "ENTP"],
        "antagonizedMatches": ["ISTJ", "ESTJ", "ISFJ"]
    },
    "ENTP": {
        "title": "The Debater",
        "description": "ENTPs are inventive, enthusiastic, strategic, enterprising, inquisitive, and versatile. They are quick to see complex interrelationships between people, things, and ideas. ENTPs are the kind of people who are always on the move, always looking for the next adventure. They are not interested in sitting around and talking about things; they want to be out there doing things. They are the most outgoing of people, and they are always the life of the party. They are not comfortable with boredom, and they will go to great lengths to avoid it. They are the kind of people who will always put their own needs before the needs of others. They are not the most creative or innovative of people, but they are excellent at getting things done. They are the kind of people who will always be there to get the party started. They are the spark that ignites the fire, and they can be counted on to always be there to make things happen.",
        "jobs": ["Actor", "Advertising Creative", "Art Director", "Consultant", "Entrepreneur", "Journalist", "Politician", "Writer"],
        "bestMatches": ["INTP", "ENFP", "ENTJ"],
        "antagonizedMatches": ["ISFJ", "ESFJ", "ISTJ"]
    },
    "ESTJ": {
        "title": "The Supervisor",
        "description": "ESTJs are hardworking, traditional, and organized. They are driven to create order and structure in their lives and the lives of others. ESTJs are the kind of people who are always on the move, always looking for the next adventure. They are not interested in sitting around and talking about things; they want to be out there doing things. They are the most outgoing of people, and they are always the life of the party. They are not comfortable with boredom, and they will go to great lengths to avoid it. They are the kind of people who will always put their own needs before the needs of others. They are not the most creative or innovative of people, but they are excellent at getting things done. They are the kind of people who will always be there to get the party started. They are the spark that ignites the fire, and they can be counted on to always be there to make things happen.",
        "jobs": ["Accountant", "Auditor", "Chief Financial Officer", "Financial Advisor", "Judge", "Lawyer", "Military Officer", "Project Manager"],
        "bestMatches": ["ISTJ", "ESTP", "ESFJ"],
        "antagonizedMatches": ["INFP", "ENFP", "INFJ"]
    },
    "ESFJ": {
        "title": "The Caregiver",
        "description": "ESFJs are warm-hearted, popular, and conscientious. They are driven to help others and are often found in roles where they can care for and support others. ESFJs are the kind of people who are always on the move, always looking for the next adventure. They are not interested in sitting around and talking about things; they want to be out there doing things. They are the most outgoing of people, and they are always the life of the party. They are not comfortable with boredom, and they will go to great lengths to avoid it. They are the kind of people who will always put their own needs before the needs of others. They are not the most creative or innovative of people, but they are excellent at getting things done. They are the kind of people who will always be there to get the party started. They are the spark that ignites the fire, and they can be counted on to always be there to make things happen.",
        "jobs": ["Child Care Provider", "Counselor", "Customer Service Representative", "Financial Advisor", "Nurse", "Paralegal", "Social Worker", "Teacher"],
        "bestMatches": ["ISFJ", "ESTJ", "ESFP"],
        "antagonizedMatches": ["INTP", "ENTP", "INTJ"]
    },
    "ENFJ": {
        "title": "The Giver",
        "description": "ENFJs are passionate, charismatic, and inspiring. They are natural-born leaders who are driven to help others realize their potential. ENFJs are the kind of people who are always on the move, always looking for the next adventure. They are not interested in sitting around and talking about things; they want to be out there doing things. They are the most outgoing of people, and they are always the life of a party. They are not comfortable with boredom, and they will go to great lengths to avoid it. They are the kind of people who will always put their own needs before the needs of others. They are not the most creative or innovative of people, but they are excellent at getting things done. They are the kind of people who will always be there to get the party started. They are the spark that ignites the fire, and they can be counted on to always be there to make things happen.",
        "jobs": ["Actor", "Advertising Creative", "Art Director", "Consultant", "Entrepreneur", "Journalist", "Politician", "Writer"],
        "bestMatches": ["INFJ", "ENFP", "ENTJ"],
        "antagonizedMatches": ["ISTP", "ESTP", "ISFP"]
    },
    "ENTJ": {
        "title": "The Commander",
        "description": "ENTJs are strategic, logical, and decisive. They are natural-born leaders who are driven to organize change and are quick to see inefficiency and conceptualize new solutions. ENTJs are the kind of people who are always on the move, always looking for the next adventure. They are not interested in sitting around and talking about things; they want to be out there doing things. They are the most outgoing of people, and they are always the life of the party. They are not comfortable with boredom, and they will go to great lengths to avoid it. They are the kind of people who will always put their own needs before the needs of others. They are not the most creative or innovative of people, but they are excellent at getting things done. They are the kind of people who will always be there to get the party started. They are the spark that ignites the fire, and they can be counted on to always be there to make things happen.",
        "jobs": ["Architect", "Computer Scientist", "Engineer", "Financial Analyst", "Lawyer", "Management Consultant", "Scientist", "Software Developer"],
        "bestMatches": ["INTJ", "ENFJ", "ENTP"],
        "antagonizedMatches": ["ISFP", "ESFP", "ISTP"]
    }
};

function showResults() {
    // Check if all questions are answered
    if (userAnswers.includes(null)) {
        alert("Please answer all questions before submitting.");
        return;
    }

    const answers = {
        E: 0,
        I: 0,
        N: 0,
        S: 0,
        T: 0,
        F: 0,
        J: 0,
        P: 0
    };

    userAnswers.forEach(answer => {
        answers[answer]++;
    });

    let personality = "";
    personality += answers.E > answers.I ? "E" : "I";
    personality += answers.N > answers.S ? "N" : "S";
    personality += answers.T > answers.F ? "T" : "F";
    personality += answers.J > answers.P ? "J" : "P";

    quizContainer.innerHTML = ''; // Clear quiz questions
    previousButton.style.display = 'none';
    nextButton.style.display = 'none';
    submitButton.style.display = 'none';
    progressBar.style.display = 'none';

    const result = personalityTypes[personality];
    resultContainer.innerHTML = `
        <div class="bg-white shadow-md rounded-lg p-6">
            <h2 class="text-3xl font-bold mb-4">Your Personality Type: ${personality} - ${result.title}</h2>
            <p class="text-lg text-left">${result.description}</p>
        </div>
        <div class="bg-white shadow-md rounded-lg p-6 mt-6">
            <h3 class="text-2xl font-bold mb-4">Suitable Job Roles:</h3>
            <ul class="list-disc list-inside text-lg text-left">
                ${result.jobs.map(job => `<li>${job}</li>`).join('')}
            </ul>
        </div>
        <div class="bg-white shadow-md rounded-lg p-6 mt-6">
            <h3 class="text-2xl font-bold mb-4">Best Matches:</h3>
            <ul class="list-disc list-inside text-lg text-left">
                ${result.bestMatches.map(match => `<li>${match}</li>`).join('')}
            </ul>
        </div>
        <div class="bg-white shadow-md rounded-lg p-6 mt-6">
            <h3 class="text-2xl font-bold mb-4">Most Antagonized With:</h3>
            <ul class="list-disc list-inside text-lg text-left">
                ${result.antagonizedMatches.map(match => `<li>${match}</li>`).join('')}
            </ul>
        </div>
    `;

    const savePdfButton = document.getElementById('savePdf');
    savePdfButton.style.display = 'block';
    savePdfButton.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text(`Personality Type: ${personality} - ${result.title}`, 10, 20);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        const descriptionLines = doc.splitTextToSize(result.description, 180);
        doc.text(descriptionLines, 10, 30);

        let y = 30 + descriptionLines.length * 7 + 10;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Suitable Job Roles:", 10, y);
        y += 10;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        result.jobs.forEach(job => {
            doc.text(`- ${job}`, 15, y);
            y += 7;
        });

        y += 10;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Best Matches:", 10, y);
        y += 10;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        result.bestMatches.forEach(match => {
            doc.text(`- ${match}`, 15, y);
            y += 7;
        });

        y += 10;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Most Antagonized With:", 10, y);
        y += 10;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        result.antagonizedMatches.forEach(match => {
            doc.text(`- ${match}`, 15, y);
            y += 7;
        });

        doc.save('personality-report.pdf');
    });
}

// Event Listeners for navigation buttons
nextButton.addEventListener('click', () => {
    if (userAnswers[currentQuestionIndex] === null) {
        alert("Please select an answer before moving to the next question.");
        return;
    }
    currentQuestionIndex++;
    displayQuestion();
});

previousButton.addEventListener('click', () => {
    currentQuestionIndex--;
    displayQuestion();
});

submitButton.addEventListener('click', showResults);

// Initial display
loadProgress();
displayQuestion();