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
            case 'pi':
                calculator.piNumber();
                break;
            case 'e':
                calculator.eNumber();
                break;
            case 'degree':
                calculator.degree(value);
                break;
            case 'fact':
                calculator.fact();
                break;
            case 'log':
                calculator.log(value);
                break;
            case 'toggleAngle':
                calculator.toggleAngleMode();
                break;
            case 'trig':
                calculator.trigonometry(value);
                break;
            default:
                break;
        }
    });
});
