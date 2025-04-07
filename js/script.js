import { Calculator } from './calculator.js';

const input = document.querySelector('.input');
const calculator = new Calculator(input);

const buttons = document.querySelectorAll('.item');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;
        const value = button.dataset.value;

        switch (action) {
            case 'insert':
                calculator.insert(value);
                break;
            case 'clean':
                calculator.clean();
                break;
            case 'equal':
                calculator.equal();
                break;
            case 'percent':
                calculator.percent();
                break;
            case 'back':
                calculator.back();
                break;
            case 'degree':
                calculator.degree(value);
                break;
            case 'fact':
                calculator.fact();
                break;
            case 'trig':
                calculator.trigonometry(value);
                break;
            case 'memoryClear':
                calculator.memoryClear();
                break;
            case 'memoryRecall':
                calculator.memoryRecall();
                break;
            case 'memoryAdd':
                calculator.memoryAdd();
                break;
            case 'memorySubtract':
                calculator.memorySubtract();
                break;
            case 'copyHistory':
                calculator.copyHistory();
                break;
            default:
                break;
        }
    });
});

const unitTypes = {
    length: ['m', 'cm', 'mm', 'km', 'in', 'ft', 'yd', 'mi'],
    weights: ['kg', 'g', 'mg', 'lb', 'oz'],
    area: ['m2', 'cm2', 'mm2', 'km2', 'ft2', 'in2'],
    num_sys: ['bin', 'oct', 'dec', 'hex']
};

const fromSelect = document.getElementById('fromUnit');
const toSelect = document.getElementById('toUnit');
const inputArea = document.querySelector('.input');

function populateUnits(type) {
    fromSelect.innerHTML = `<option value="" disabled selected>from:</option>`;
    toSelect.innerHTML = `<option value="" disabled selected>to:</option>`;
    unitTypes[type].forEach(unit => {
        fromSelect.appendChild(new Option(unit, unit));
        toSelect.appendChild(new Option(unit, unit));
    });
}

document.querySelectorAll('.convert').forEach(div => {
    div.addEventListener('click', () => {
        const type = div.textContent.trim().toLowerCase();
        populateUnits(type);
        fromSelect.dataset.type = type;
        toSelect.dataset.type = type;
    });
});

function performConversion() {
    const from = fromSelect.value;
    const to = toSelect.value;
    const type = fromSelect.dataset.type;

    if (from && to && type) {
        let value = calculator.expression;

        if (type === 'num_sys') {
            // Спробуємо витягти число з виразу
            const numberMatch = value.match(/[\dABCDEF]+/); // Витягує числові та шістнадцяткові символи
            if (numberMatch) {
                value = numberMatch[0]; // Використовуємо знайдене число
            } else {
                calculator.expression = 'Error: Invalid number';
                return;
            }
        }

        const result = calculator.convertUnits(value, from, to, type);
        calculator.expression = result.toString();
    }
}

fromSelect.addEventListener('change', performConversion);
toSelect.addEventListener('change', performConversion);
