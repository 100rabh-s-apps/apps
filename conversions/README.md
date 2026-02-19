# Conversion Quest 🎮

**A fun, offline-friendly measurement conversion game for kids in grades 3-5!**

---

## 📖 What is Conversion Quest?

Conversion Quest turns boring unit conversions into an exciting adventure! Kids practice converting between metric units while earning rewards, unlocking achievements, and climbing through difficulty levels—all without needing an internet connection.

### Units Covered
| Category | Conversions |
|----------|-------------|
| **Length** | mm → m, cm → m, m → km |
| **Weight** | g → kg, mg → g |
| **Volume** | mL → L, L → kL |

---

## ✨ Features

### 🎯 Learning Mode
- **Type-in answers** – No multiple choice! Kids build real calculation skills
- **Progressive difficulty** – Starts easy, gets challenging as they master each level
- **Instant feedback** – Know right away if the answer is correct
- **Hint system** – Gentle nudges when stuck (without giving away the answer)

### 🏆 Rewards & Motivation
- **Star ratings** – Earn 1-3 stars per level based on accuracy
- **Achievement badges** – Unlock fun badges like "Length Master" and "Volume Virtuoso"
- **Combo bonuses** – Streak counters for consecutive correct answers
- **Celebration animations** – Confetti and cheers when leveling up!

### 📱 Built for Kids
- **Large, touch-friendly buttons** – Easy to use on tablets and phones
- **Color-blind friendly palette** – Accessible to all kids
- **Screen reader support** – Questions read aloud via browser accessibility
- **Keyboard navigation** – Full support for keyboard-only play
- **No time pressure** – Kids learn at their own pace

### 🌐 Works Everywhere
- **100% offline** – Once loaded, no internet needed
- **Responsive design** – Looks great on phones, tablets, and desktops
- **No login required** – Just open and play!
- **No ads, no tracking** – Safe, distraction-free learning

---

## 🚀 Getting Started

### Play Now
Simply open `index.html` in any modern web browser. No installation required!

```bash
# If you have a local server (optional - works offline too)
python -m http.server 8000
# Then visit: http://localhost:8000
```

### Browser Support
- Chrome/Edge (recommended)
- Firefox
- Safari
- Any HTML5-compatible browser

---

## 🎮 How to Play

1. **Choose a category** – Length, Weight, or Volume
2. **Read the question** – e.g., "Convert 250 cm to meters"
3. **Type your answer** – Enter the number only (decimals allowed!)
4. **Press Enter or Submit** – See if you're correct!
5. **Earn stars** – Get 10 correct to advance to the next level
6. **Unlock badges** – Master all categories to collect them all!

### Example Questions
```
Level 1: Convert 1000 mm to m          → Answer: 1
Level 2: Convert 450 g to kg           → Answer: 0.45
Level 3: Convert 2.5 L to mL           → Answer: 2500
Level 4: Convert 75 mg to g            → Answer: 0.075
```

---

## 📁 Project Structure

```
conversions/
├── index.html          # Main game interface
├── css/
│   └── style.css       # Responsive, accessible styles
├── js/
│   ├── game.js         # Core game logic
│   ├── questions.js    # Question generator
│   └── rewards.js      # Badges and achievements
├── assets/
│   ├── sounds/         # Fun sound effects (optional)
│   └── icons/          # Badge and star icons
└── README.md           # This file
```

---

## 🛠️ Building from Source

No build tools required! This is a pure HTML5 app. Just edit the files and refresh your browser.

### Optional: Live Reload for Development
```bash
# Install a simple live server
npm install -g live-server
live-server
```

---

## 🎨 Customization

### Adjust Difficulty
Edit `js/questions.js` to modify:
- Number ranges for each level
- Decimal precision requirements
- Questions needed to advance

### Add New Units
The modular design makes it easy to add:
- Time conversions (seconds → minutes)
- Temperature (°C → °F)
- Imperial units (inches → feet)

---

## ♿ Accessibility Features

| Feature | Implementation |
|---------|----------------|
| **Screen Readers** | ARIA labels on all interactive elements |
| **Keyboard Nav** | Tab through all controls, Enter to submit |
| **High Contrast** | 4.5:1 minimum contrast ratio |
| **Focus Indicators** | Clear outlines on focused elements |
| **Reduced Motion** | Respects `prefers-reduced-motion` |
| **Scalable Text** | Works with browser zoom up to 200% |

---

## 📝 License

Free for educational use. Modify and share as needed!

---

## 💡 Tips for Parents & Teachers

- **Start with Level 1** – Let kids build confidence before advancing
- **Encourage mental math** – Resist the calculator urge!
- **Real-world practice** – "This bottle is 500 mL. How many liters?"
- **Celebrate effort** – Stars matter, but learning matters more!

---

## 🐛 Found a Bug?

This is a community project. Feel free to:
- Report issues
- Submit improvements
- Share with other kids!

---

**Happy Converting! 🌟**

*Made with ❤️ for curious minds everywhere*
