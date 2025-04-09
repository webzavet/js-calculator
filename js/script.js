import { Calculator } from './calculator.js';

const input = document.querySelector('.input');
const calculator = new Calculator(input);

const fromSelect = document.getElementById('fromUnit');
const toSelect = document.getElementById('toUnit');

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
                calculator.renderHistory(calculator);
                if (fromSelect.value && toSelect.value && fromSelect.dataset.type) {
                    calculator.handleUnitConversion(fromSelect.dataset.type, fromSelect, toSelect, input);
                }
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
            case 'const':
                calculator.insertConstant(value);
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
            case 'unit':
                calculator.handleUnitConversion(value, fromSelect, toSelect);
                break;
            default:
                break;
        }
    });
});

document.querySelectorAll('.convert').forEach(div => {
    div.addEventListener('click', () => {
        const type = div.dataset.value; // або div.textContent.trim().toLowerCase()
        calculator.handleUnitConversion(type, fromSelect, toSelect, input);
    });
});