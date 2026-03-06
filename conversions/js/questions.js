/**
 * Conversion Quest - Question Generator
 * Generates metric conversion questions for length, weight, and volume
 */

const Questions = (function() {
    'use strict';

    // Conversion definitions
    const conversions = {
        length: {
            units: {
                mm: { name: 'millimeters', symbol: 'mm', toBase: 0.001 },
                cm: { name: 'centimeters', symbol: 'cm', toBase: 0.01 },
                m: { name: 'meters', symbol: 'm', toBase: 1 },
                km: { name: 'kilometers', symbol: 'km', toBase: 1000 }
            },
            // Level configurations: [fromUnit, toUnit, min, max, multiplier]
            levels: {
                1: [
                    { from: 'mm', to: 'cm', min: 10, max: 100, step: 10 },
                    { from: 'cm', to: 'mm', min: 1, max: 10, step: 1, special: [1, 2, 3, 5, 10] },
                    { from: 'cm', to: 'm', min: 100, max: 500, step: 100 },
                    { from: 'm', to: 'cm', min: 1, max: 10, step: 1, special: [1, 2, 3, 5, 10] },
                    { from: 'mm', to: 'm', min: 1000, max: 5000, step: 1000 },
                    { from: 'm', to: 'mm', min: 1, max: 5, step: 1, special: [1, 2, 3, 5] },
                    { from: 'm', to: 'km', min: 1000, max: 5000, step: 1000 },
                    { from: 'km', to: 'm', min: 1, max: 5, step: 1, special: [1, 2, 3, 5, 10] }
                ],
                2: [
                    { from: 'mm', to: 'cm', min: 1, max: 999, step: 1 },
                    { from: 'cm', to: 'mm', min: 1, max: 99, step: 1 },
                    { from: 'cm', to: 'm', min: 1, max: 999, step: 1 },
                    { from: 'm', to: 'cm', min: 1, max: 99, step: 1, decimal: true },
                    { from: 'm', to: 'km', min: 1000, max: 5000, step: 1000 },
                    { from: 'km', to: 'm', min: 1, max: 99, step: 1, decimal: true },
                    { from: 'mm', to: 'km', min: 100000, max: 999999, step: 10000 },
                    { from: 'km', to: 'mm', min: 1, max: 10, step: 1, decimal: true }
                ],
                3: [
                    { from: 'mm', to: 'm', min: 1000, max: 9999, step: 100 },
                    { from: 'm', to: 'mm', min: 1, max: 99, step: 1, decimal: true },
                    { from: 'cm', to: 'm', min: 1, max: 999, step: 1, decimal: true },
                    { from: 'm', to: 'cm', min: 1, max: 99, step: 1, decimal: true },
                    { from: 'm', to: 'km', min: 100, max: 9999, step: 100 },
                    { from: 'km', to: 'm', min: 1, max: 99, step: 1, decimal: true },
                    { from: 'mm', to: 'km', min: 100000, max: 999999, step: 10000 },
                    { from: 'km', to: 'mm', min: 1, max: 10, step: 1, decimal: true }
                ],
                4: [
                    { from: 'mm', to: 'm', min: 1, max: 9999, step: 1, decimal: true },
                    { from: 'm', to: 'mm', min: 0.001, max: 999, step: 0.001, decimal: true },
                    { from: 'cm', to: 'km', min: 100000, max: 999999, step: 10000 },
                    { from: 'km', to: 'cm', min: 1, max: 10, step: 1, decimal: true },
                    { from: 'm', to: 'km', min: 1, max: 999, step: 1, decimal: true },
                    { from: 'mm', to: 'km', min: 1, max: 999999, step: 1, decimal: true },
                    { from: 'km', to: 'mm', min: 0.001, max: 10, step: 0.001, decimal: true }
                ],
                5: [
                    { from: 'mm', to: 'km', min: 1000000, max: 9999999, step: 100000 },
                    { from: 'km', to: 'mm', min: 1, max: 100, step: 1, decimal: true },
                    { from: 'km', to: 'm', min: 1, max: 100, step: 1, decimal: true },
                    { from: 'km', to: 'cm', min: 1, max: 10, step: 1, decimal: true },
                    { from: 'km', to: 'mm', min: 0.001, max: 10, step: 0.001, decimal: true }
                ]
            }
        },
        weight: {
            units: {
                mg: { name: 'milligrams', symbol: 'mg', toBase: 0.001 },
                cg: { name: 'centigrams', symbol: 'cg', toBase: 0.01 },
                g: { name: 'grams', symbol: 'g', toBase: 1 },
                kg: { name: 'kilograms', symbol: 'kg', toBase: 1000 }
            },
            levels: {
                1: [
                    { from: 'g', to: 'kg', min: 1000, max: 5000, step: 1000 },
                    { from: 'kg', to: 'g', min: 1, max: 10, step: 1, special: [1, 2, 5, 10] },
                    { from: 'mg', to: 'g', min: 1000, max: 5000, step: 1000 },
                    { from: 'g', to: 'mg', min: 1, max: 10, step: 1, special: [1, 2, 5, 10] },
                    { from: 'mg', to: 'cg', min: 10, max: 100, step: 10 },
                    { from: 'cg', to: 'mg', min: 1, max: 10, step: 1, special: [1, 2, 3, 5, 10] },
                    { from: 'cg', to: 'g', min: 100, max: 500, step: 100 },
                    { from: 'g', to: 'cg', min: 1, max: 10, step: 1, special: [1, 2, 5, 10] }
                ],
                2: [
                    { from: 'mg', to: 'g', min: 100, max: 900, step: 100 },
                    { from: 'g', to: 'mg', min: 1, max: 99, step: 1 },
                    { from: 'g', to: 'kg', min: 100, max: 9999, step: 100 },
                    { from: 'kg', to: 'g', min: 1, max: 99, step: 1, decimal: true },
                    { from: 'mg', to: 'cg', min: 10, max: 999, step: 10 },
                    { from: 'cg', to: 'mg', min: 1, max: 99, step: 1 },
                    { from: 'mg', to: 'kg', min: 100000, max: 999999, step: 10000 },
                    { from: 'kg', to: 'mg', min: 1, max: 10, step: 1, decimal: true }
                ],
                3: [
                    { from: 'mg', to: 'g', min: 1, max: 999, step: 1, decimal: true },
                    { from: 'g', to: 'mg', min: 0.001, max: 999, step: 0.001, decimal: true },
                    { from: 'g', to: 'kg', min: 1, max: 999, step: 1, decimal: true },
                    { from: 'kg', to: 'g', min: 0.001, max: 999, step: 0.001, decimal: true },
                    { from: 'cg', to: 'g', min: 1, max: 999, step: 1, decimal: true },
                    { from: 'g', to: 'cg', min: 0.01, max: 999, step: 0.01, decimal: true },
                    { from: 'mg', to: 'kg', min: 1000, max: 999999, step: 1000 },
                    { from: 'kg', to: 'mg', min: 0.001, max: 10, step: 0.001, decimal: true }
                ],
                4: [
                    { from: 'mg', to: 'kg', min: 100000, max: 999999, step: 10000 },
                    { from: 'kg', to: 'mg', min: 0.1, max: 100, step: 0.1, decimal: true },
                    { from: 'kg', to: 'g', min: 1, max: 100, step: 1, decimal: true },
                    { from: 'g', to: 'kg', min: 0.001, max: 999, step: 0.001, decimal: true },
                    { from: 'mg', to: 'cg', min: 1000, max: 99999, step: 1000 },
                    { from: 'cg', to: 'mg', min: 0.01, max: 99, step: 0.01, decimal: true }
                ],
                5: [
                    { from: 'mg', to: 'kg', min: 1, max: 999999, step: 1, decimal: true },
                    { from: 'kg', to: 'mg', min: 0.000001, max: 10, step: 0.000001, decimal: true },
                    { from: 'kg', to: 'cg', min: 0.00001, max: 10, step: 0.00001, decimal: true },
                    { from: 'cg', to: 'kg', min: 1, max: 999999, step: 1, decimal: true }
                ]
            }
        },
        volume: {
            units: {
                mL: { name: 'milliliters', symbol: 'mL', toBase: 0.001 },
                cL: { name: 'centiliters', symbol: 'cL', toBase: 0.01 },
                L: { name: 'liters', symbol: 'L', toBase: 1 },
                kL: { name: 'kiloliters', symbol: 'kL', toBase: 1000 }
            },
            levels: {
                1: [
                    { from: 'mL', to: 'L', min: 100, max: 900, step: 100, special: [500, 250, 750, 1000] },
                    { from: 'L', to: 'mL', min: 1, max: 10, step: 1, special: [1, 2, 5, 10] },
                    { from: 'mL', to: 'cL', min: 10, max: 100, step: 10 },
                    { from: 'cL', to: 'mL', min: 1, max: 10, step: 1, special: [1, 2, 3, 5, 10] },
                    { from: 'cL', to: 'L', min: 100, max: 500, step: 100 },
                    { from: 'L', to: 'cL', min: 1, max: 10, step: 1, special: [1, 2, 5, 10] },
                    { from: 'L', to: 'kL', min: 1000, max: 5000, step: 1000 },
                    { from: 'kL', to: 'L', min: 1, max: 5, step: 1, special: [1, 2, 3, 5] }
                ],
                2: [
                    { from: 'mL', to: 'L', min: 1, max: 9999, step: 100 },
                    { from: 'L', to: 'mL', min: 1, max: 99, step: 1, decimal: true },
                    { from: 'L', to: 'kL', min: 1000, max: 5000, step: 1000 },
                    { from: 'kL', to: 'L', min: 1, max: 99, step: 1, decimal: true },
                    { from: 'mL', to: 'cL', min: 10, max: 999, step: 10 },
                    { from: 'cL', to: 'mL', min: 1, max: 99, step: 1 },
                    { from: 'mL', to: 'kL', min: 100000, max: 999999, step: 10000 },
                    { from: 'kL', to: 'mL', min: 1, max: 10, step: 1, decimal: true }
                ],
                3: [
                    { from: 'mL', to: 'L', min: 1, max: 9999, step: 1, decimal: true },
                    { from: 'L', to: 'mL', min: 0.001, max: 999, step: 0.001, decimal: true },
                    { from: 'L', to: 'kL', min: 1, max: 999, step: 1, decimal: true },
                    { from: 'kL', to: 'L', min: 0.001, max: 999, step: 0.001, decimal: true },
                    { from: 'cL', to: 'L', min: 1, max: 999, step: 1, decimal: true },
                    { from: 'L', to: 'cL', min: 0.01, max: 999, step: 0.01, decimal: true },
                    { from: 'mL', to: 'kL', min: 1000, max: 999999, step: 1000 },
                    { from: 'kL', to: 'mL', min: 0.001, max: 10, step: 0.001, decimal: true }
                ],
                4: [
                    { from: 'mL', to: 'kL', min: 100000, max: 999999, step: 10000 },
                    { from: 'kL', to: 'mL', min: 0.1, max: 100, step: 0.1, decimal: true },
                    { from: 'kL', to: 'L', min: 1, max: 100, step: 1, decimal: true },
                    { from: 'L', to: 'kL', min: 0.001, max: 999, step: 0.001, decimal: true },
                    { from: 'mL', to: 'cL', min: 1000, max: 99999, step: 1000 },
                    { from: 'cL', to: 'mL', min: 0.01, max: 99, step: 0.01, decimal: true }
                ],
                5: [
                    { from: 'mL', to: 'kL', min: 1, max: 9999999, step: 1, decimal: true },
                    { from: 'kL', to: 'mL', min: 0.000001, max: 10, step: 0.000001, decimal: true },
                    { from: 'kL', to: 'cL', min: 0.00001, max: 10, step: 0.00001, decimal: true },
                    { from: 'cL', to: 'kL', min: 1, max: 999999, step: 1, decimal: true }
                ]
            }
        }
    };

    /**
     * Generate a random number within range, optionally with step
     */
    function randomInRange(min, max, step = 1) {
        const range = max - min;
        const steps = Math.floor(range / step);
        const randomStep = Math.floor(Math.random() * (steps + 1));
        return min + (randomStep * step);
    }

    /**
     * Get a random conversion config for a level
     */
    function getRandomConversion(category, level) {
        const catData = conversions[category];
        if (!catData) return null;

        const levelConfigs = catData.levels[Math.min(level, 5)];
        if (!levelConfigs || levelConfigs.length === 0) return null;

        const config = levelConfigs[Math.floor(Math.random() * levelConfigs.length)];
        
        // Handle special values (like common mL measurements)
        let value;
        if (config.special && Math.random() < 0.4) {
            value = config.special[Math.floor(Math.random() * config.special.length)];
        } else {
            value = randomInRange(config.min, config.max, config.step);
        }

        return {
            from: config.from,
            to: config.to,
            value: value,
            decimal: config.decimal || false
        };
    }

    /**
     * Calculate the correct answer for a conversion
     */
    function calculateAnswer(conv) {
        const category = getCurrentCategoryData();
        if (!category) return 0;

        const fromUnit = category.units[conv.from];
        const toUnit = category.units[conv.to];

        if (!fromUnit || !toUnit) return 0;

        // Convert to base unit first, then to target
        const inBaseUnit = conv.value * fromUnit.toBase;
        const answer = inBaseUnit / toUnit.toBase;

        // Round to avoid floating point issues
        return Math.round(answer * 1000000) / 1000000;
    }

    /**
     * Get the current category data (set by Game module)
     */
    let currentCategory = 'length';
    
    function setCurrentCategory(category) {
        currentCategory = category;
    }

    function getCurrentCategoryData() {
        return conversions[currentCategory];
    }

    /**
     * Format the question text
     */
    function formatQuestion(conv) {
        const category = getCurrentCategoryData();
        const fromName = category.units[conv.from].name;
        const toName = category.units[conv.to].name;
        const fromSymbol = category.units[conv.from].symbol;
        const toSymbol = category.units[conv.to].symbol;

        return `Convert ${conv.value} ${fromSymbol} (${fromName}) to ${toSymbol} (${toName})`;
    }

    /**
     * Generate a hint based on the conversion
     */
    function generateHint(conv) {
        const category = getCurrentCategoryData();
        const fromUnit = category.units[conv.from];
        const toUnit = category.units[conv.to];

        // Calculate the conversion factor
        const factor = fromUnit.toBase / toUnit.toBase;

        if (factor < 1) {
            const divisor = Math.round(1 / factor);
            return `Hint: Divide by ${divisor} to convert ${conv.from} to ${conv.to}`;
        } else if (factor > 1) {
            return `Hint: Multiply by ${factor} to convert ${conv.from} to ${conv.to}`;
        } else {
            return `Hint: Think about how many ${conv.from} make one ${conv.to}`;
        }
    }

    /**
     * Generate a new question for the given category and level
     */
    function generateQuestion(category, level) {
        setCurrentCategory(category);
        const conv = getRandomConversion(category, level);
        
        if (!conv) {
            return {
                question: 'Error generating question',
                answer: 0,
                hint: ''
            };
        }

        return {
            question: formatQuestion(conv),
            answer: calculateAnswer(conv),
            hint: generateHint(conv),
            conversion: conv
        };
    }

    /**
     * Validate if an answer is correct (with tolerance for decimals)
     */
    function isAnswerCorrect(userAnswer, correctAnswer) {
        const tolerance = 0.0001;
        return Math.abs(userAnswer - correctAnswer) < tolerance;
    }

    /**
     * Get the maximum level (for UI purposes)
     */
    function getMaxLevel() {
        return 5;
    }

    /**
     * Get all available categories
     */
    function getCategories() {
        return ['length', 'weight', 'volume'];
    }

    // Public API
    return {
        generateQuestion,
        isAnswerCorrect,
        getMaxLevel,
        getCategories
    };

})();
