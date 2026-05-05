/**
 * Mind Mansion - Core Game Logic
 */

let currentPhase = 'PLACE'; // PLACE, PAINT, PLAY
let sessionItems = [];
let placedItems = new Map(); // LociIndex -> Item
let associations = new Map(); // ItemId -> Modifier
let sessionPerformance = {
    correct: 0,
    wrong: 0,
    byCategory: {} // Category -> { correct: 0, total: 0 }
};
let currentLociIndex = null;
let currentItem = null;
let selectedItemElement = null;
let paintingItem = null;
let recallIndex = 1;

// Loci positions (normalized 0-100 for responsiveness)
const lociPositions = [
    { x: 15, y: 20 }, { x: 40, y: 15 }, { x: 70, y: 20 },
    { x: 85, y: 45 }, { x: 75, y: 75 }, { x: 50, y: 85 },
    { x: 25, y: 80 }, { x: 10, y: 55 }, { x: 30, y: 45 },
    { x: 55, y: 50 }
];

document.addEventListener('DOMContentLoaded', () => {
    initGame();
});

function initGame() {
    loadStats(); // Ensure latest stats are loaded
    sessionItems = selectItemsForSession();
    renderLoci();
    renderInventory();
    updateHeader();
    updateMentalStrength();
}

function renderLoci() {
    const room = document.getElementById('room-view');
    room.innerHTML = '';
    lociPositions.forEach((pos, index) => {
        const loci = document.createElement('div');
        loci.className = 'loci';
        loci.style.left = `${pos.x}%`;
        loci.style.top = `${pos.y}%`;
        loci.innerHTML = index + 1;
        loci.dataset.index = index + 1;
        
        loci.addEventListener('dragover', e => e.preventDefault());
        loci.addEventListener('drop', handleDrop);
        loci.addEventListener('click', (e) => {
            if (currentPhase === 'PLACE' && currentItem) {
                handlePlacement(index + 1, e.currentTarget);
            } else {
                handleLociClick(e);
            }
        });
        
        room.appendChild(loci);
    });
}

function renderInventory() {
    const inventory = document.getElementById('inventory');
    inventory.innerHTML = '';
    sessionItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'inventory-item';
        div.draggable = true;
        
        // Icon logic
        const iconHtml = getItemIconHtml(item);
        div.innerHTML = `${iconHtml}<div style="font-size: 0.6rem; margin-top: 5px;">${item.name}</div>`;
        
        div.dataset.id = item.id;
        
        div.addEventListener('dragstart', (e) => {
            selectItem(item, div);
            e.dataTransfer.setData('text/plain', item.id);
        });

        div.addEventListener('click', () => {
            selectItem(item, div);
            showOwlMessage(`Great choice! Now tap a circle to place the ${item.name}.`);
        });
        
        inventory.appendChild(div);
    });
}

function selectItem(item, element) {
    if (selectedItemElement) {
        selectedItemElement.classList.remove('selected');
    }
    currentItem = item;
    selectedItemElement = element;
    element.classList.add('selected');
}

function getItemIconHtml(item) {
    // We now have SVGs for all 100 items!
    return `<img src="assets/items/item_${item.id}.svg" style="width: 40px; height: 40px;" onerror="this.outerHTML='⭐'">`;
}

function handleDrop(e) {
    e.preventDefault();
    if (currentPhase !== 'PLACE') return;
    const index = parseInt(e.target.dataset.index);
    handlePlacement(index, e.target);
}

function handlePlacement(index, element) {
    if (placedItems.has(index)) {
        showOwlMessage("That spot is already taken! Hoot!");
        return;
    }

    currentLociIndex = index;
    placedItems.set(index, currentItem);
    
    // Mark loci as occupied
    element.classList.add('occupied');
    const iconHtml = getItemIconHtml(currentItem);
    element.innerHTML = `<div style="transform: scale(0.8)">${iconHtml}</div>`;
    
    // Remove from inventory
    selectedItemElement.style.visibility = 'hidden';
    selectedItemElement.classList.remove('selected');
    paintingItem = currentItem;
    currentItem = null;
    selectedItemElement = null;

    // Transition to PAINT phase for this item
    showPaintModal(paintingItem);
}

function showPaintModal(item) {
    document.getElementById('paint-item-name').innerText = `Paint the ${item.name}!`;
    document.getElementById('paint-modal').style.display = 'flex';
}

function applyModifier(modifier) {
    associations.set(paintingItem.id, modifier);
    document.getElementById('paint-modal').style.display = 'none';
    
    showOwlMessage(`Great! The ${paintingItem.name} is now ${modifier.toLowerCase()}.`);
    
    paintingItem = null; // Clear after use
    
    if (placedItems.size === 10) {
        startRecallPhase();
    }
}

function startRecallPhase() {
    currentPhase = 'PLAY';
    updateHeader();
    showOwlMessage("Time to test your superpower! Click the circles in order 1 to 10.");
    
    // Hide names from Loci
    document.querySelectorAll('.loci').forEach((loci, i) => {
        loci.innerHTML = i + 1;
        loci.classList.remove('occupied');
    });
    
    // Hide inventory
    document.getElementById('inventory').style.display = 'none';
    
    recallIndex = 1;
    highlightLoci(recallIndex);
}

function handleLociClick(e) {
    if (currentPhase !== 'PLAY') return;
    
    const index = parseInt(e.currentTarget.dataset.index);
    if (index === recallIndex) {
        showRecallModal(index);
    } else {
        showOwlMessage(`Focus! We need to find what was at Loci ${recallIndex} first.`);
    }
}

function showRecallModal(index) {
    const correctItem = placedItems.get(index);
    const modal = document.getElementById('recall-modal');
    const optionsContainer = document.getElementById('recall-options');
    const hintText = document.getElementById('recall-hint');
    
    hintText.innerText = ""; // Clear hint initially
    optionsContainer.innerHTML = '';
    
    // Generate options: correct item + 3 random from session
    const options = [correctItem];
    const others = sessionItems.filter(i => i.id !== correctItem.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
    
    const allOptions = [...options, ...others].sort(() => 0.5 - Math.random());
    
    allOptions.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'recall-btn';
        btn.innerText = item.name;
        btn.onclick = () => checkRecall(item, correctItem);
        optionsContainer.appendChild(btn);
    });
    
    modal.style.display = 'flex';
}

function checkRecall(selected, correct) {
    const modal = document.getElementById('recall-modal');
    
    // Track category stats
    if (!sessionPerformance.byCategory[correct.category]) {
        sessionPerformance.byCategory[correct.category] = { correct: 0, total: 0 };
    }
    sessionPerformance.byCategory[correct.category].total++;

    if (selected.id === correct.id) {
        sessionPerformance.correct++;
        sessionPerformance.byCategory[correct.category].correct++;
        
        recordPerformance(correct.id, true);
        modal.style.display = 'none';
        showOwlMessage("Perfect! Your memory is growing!");
        
        const loci = document.querySelector(`.loci[data-index="${recallIndex}"]`);
        loci.style.background = 'var(--success)';
        loci.style.color = 'white';
        loci.classList.remove('active');
        
        recallIndex++;
        if (recallIndex > 10) {
            showFinalResults();
        } else {
            highlightLoci(recallIndex);
        }
    } else {
        sessionPerformance.wrong++;
        recordPerformance(correct.id, false);
        const modifier = associations.get(correct.id);
        
        // Advanced Scaffolding: Progressive Hinting
        if (!correct.attempts) correct.attempts = 0;
        correct.attempts++;
        
        if (correct.attempts === 1) {
            document.getElementById('recall-hint').innerText = 
                `Hint: Remember the ${correct.name} that you made ${modifier.toLowerCase()}?`;
        } else {
            document.getElementById('owl-bubble').innerHTML = 
                `<strong>Memory Tip:</strong> Try to see the ${correct.name} in your mind as if it were 10 feet tall! Close your eyes and "paint" it again!`;
        }
        
        showOwlMessage("Not quite! Try to see the image you 'painted' in your mind.");
    }
    updateMentalStrength();
}

function highlightLoci(index) {
    document.querySelectorAll('.loci').forEach(l => l.classList.remove('active'));
    const active = document.querySelector(`.loci[data-index="${index}"]`);
    if (active) active.classList.add('active');
}

function showOwlMessage(msg) {
    document.getElementById('owl-bubble').innerText = msg;
}

function updateHeader() {
    const phaseText = currentPhase === 'PLACE' ? "1. Place & Paint" : "2. Recall Quest";
    document.getElementById('game-phase').innerText = `Phase: ${phaseText}`;
}

function updateMentalStrength() {
    const fill = document.getElementById('strength-fill');
    // Progress within current level
    const progress = (userStats.mentalStrength % 100);
    fill.style.width = `${progress}%`;
    
    const strengthLabel = document.querySelector('#mental-strength-container span');
    strengthLabel.innerText = `Level ${userStats.userLevel} Mental Strength:`;
}

function showFinalResults() {
    const modal = document.getElementById('result-modal');
    const title = document.getElementById('result-title');
    const text = document.getElementById('result-text');
    
    title.innerText = "Superpower Report!";
    
    let report = `You recalled ${sessionPerformance.correct} out of 10 items!\n\n`;
    report += "Your Brain Strengths:\n";
    
    for (const [cat, stats] of Object.entries(sessionPerformance.byCategory)) {
        const percent = Math.round((stats.correct / stats.total) * 100);
        let icon = "⭐";
        if (cat === "Living") icon = "🐾";
        if (cat === "Nature") icon = "🌿";
        if (cat === "Object") icon = "📦";
        if (cat === "Abstract") icon = "✨";
        
        report += `${icon} ${cat}: ${percent}%\n`;
    }

    report += `\nMental Strength: ${userStats.mentalStrength}`;
    
    text.style.whiteSpace = "pre-line";
    text.innerText = report;
    
    modal.style.display = 'flex';
}

function restartGame() {
    location.reload();
}

/**
 * Tutorial Logic
 */
function showTutorial() {
    document.getElementById('tutorial-modal').style.display = 'flex';
}

function closeTutorial() {
    document.getElementById('tutorial-modal').style.display = 'none';
    // Only show owl message after tutorial is closed
    showOwlMessage("Great! Now drag an item to Loci 1 to begin.");
}
