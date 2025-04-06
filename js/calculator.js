export class Calculator {
    constructor(displayElement) {
        this._expression = '0';
        this._context = '';
        this._angleMode = 'deg'; // 'deg' or 'rad'
        this.display = displayElement;
        this.updateDisplay();
    }

    get expression() {
        return this._expression;
    }

    set expression(value) {
        if (typeof value !== 'string') throw new TypeError('Expression must be a string');
        this._expression = value;
        this.updateDisplay();
    }

    get context() {
        return this._context;
    }

    set context(value) {
        if (typeof value !== 'string') throw new TypeError('Context must be a string');
        this._context = value;
    }

    get angleMode() {
        return this._angleMode;
    }

    set angleMode(value) {
        if (value !== 'deg' && value !== 'rad') throw new Error('Angle mode must be either "deg" or "rad"');
        this._angleMode = value;
    }

    updateDisplay() {
        this.display.textContent = this._expression;
    }

    insert(num) {
        if (this._expression === '0') {
            this._expression = '';
        }
        this._expression += num;
        this.updateDisplay();
    }

    clean() {
        this._expression = '0';
        this._context = '';
        this._angleMode = 'deg';
        this.updateDisplay();
    }

    equal() {
        try {
            if (this._expression.includes('^')) {
                const [base, exponent] = this._expression.split('^');
                const result = Math.pow(eval(base), eval(exponent));
                this._expression = result.toString();
            } else {
                this._expression = eval(this._expression).toString();
            }
        } catch (e) {
            this._expression = 'Error';
        }
        this.updateDisplay();
    }

    back() {
        if (this._expression.length <= 1 || this._expression === '0') {
            this._expression = '0';
        } else {
            this._expression = this._expression.slice(0, -1);
        }
        this.updateDisplay();
    }

    percent() {
        try {
            this._expression = (eval(this._expression) / 100).toString();
        } catch {
            this._expression = 'Error';
        }
        this.updateDisplay();
    }

    piNumber() {
        if (this._expression === '0') this._expression = '';
        this._expression += Math.PI.toFixed(8);
        this.updateDisplay();
    }

    eNumber() {
        if (this._expression === '0') this._expression = '';
        this._expression += Math.E.toFixed(8);
        this.updateDisplay();
    }

    degree(name) {
        try {
            const value = parseFloat(eval(this._expression));
            let result;

            switch (name) {
                case 'sqrt':
                    result = Math.sqrt(value);
                    break;
                case 'sqr':
                    result = Math.pow(value, 2);
                    break;
                case '^-1':
                    result = Math.pow(value, -1);
                    break;
                default:
                    throw new Error(`Unknown operation: ${name}`);
            }

            this._expression = result.toString();
        } catch {
            this._expression = 'Error';
        }
        this.updateDisplay();
    }

    fact() {
        const factorial = function (n) {
            if (n < 0 || !Number.isInteger(n)) throw new Error('Invalid input');
            return n <= 1 ? 1 : n * factorial(n - 1);
        };

        try {
            const value = +eval(this._expression);
            this._expression = factorial(value).toString();
        } catch {
            this._expression = 'Error';
        }
        this.updateDisplay();
    }

    log(name) {
        try {
            const value = +eval(this._expression);
            let result;

            if (value <= 0) throw new Error('Log undefined for <= 0');

            if (name === 'lg') {
                result = Math.log10(value);
            } else if (name === 'ln') {
                result = Math.log(value);
            } else {
                throw new Error(`Unknown log type: ${name}`);
            }

            this._expression = Number(result.toFixed(8)).toString();
        } catch {
            this._expression = 'Error';
        }
        this.updateDisplay();
    }

    toggleAngleMode() {
        this._angleMode = this._angleMode === 'deg' ? 'rad' : 'deg';
        this.updateDisplay();
    }

    trigonometry(name) {
        try {
            let value = +eval(this._expression);
            if (this._angleMode === 'deg') value = value * Math.PI / 180;

            let result;
            switch (name) {
                case 'sin':
                    result = Math.sin(value);
                    break;
                case 'cos':
                    result = Math.cos(value);
                    break;
                case 'tan':
                    result = Math.tan(value);
                    break;
                case 'ctg':
                    const tan = Math.tan(value);
                    if (tan === 0) throw new Error('Cotangent undefined');
                    result = 1 / tan;
                    break;
                default:
                    throw new Error(`Unknown trig function: ${name}`);
            }

            this._expression = Number(result.toFixed(8)).toString();
        } catch {
            this._expression = 'Error';
        }
        this.updateDisplay();
    }
}