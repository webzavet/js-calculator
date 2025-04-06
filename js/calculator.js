class Calculator {
    constructor() {
        this._expression = '';
        this._context = '';
        this._angleMode = 'deg'; // 'deg' or 'rad'
    }

    get expression() {
        return this._expression;
    }

    set expression(value) {
        if (typeof value !== 'string') {
            throw new TypeError('Expression must be a string');
        }
        this._expression = value;

        console.log(this.expression, this.context);
    }

    get context() {
        return this._context;
    }

    set context(value) {
        if (typeof value !== 'string') {
            throw new TypeError('Context must be a string');
        }
        this._context = value;
    }

    get angleMode() {
        return this._angleMode;
    }

    set angleMode(value) {
        if (typeof value !== 'string') {
            throw new TypeError('Angle mode must be a string');
        }
        if (value !== 'deg' && value !== 'rad') {
            throw new Error('Angle mode must be either "deg" or "rad"');
        }
        this._angleMode = value;
    }

    insert(num) {
        if (this._expression === '0') {
            this._expression = '';
        }
        this._expression += num;
    }

    clean() {
        this._expression = '0';
        this._context = '';
        this._angleMode = 'deg';

        console.log(this.expression, this.context);
    }

    equal() {
        let exp = this._expression;
        if (this._expression.includes('^')) {
            let tmp = this._expression.split('^')
            let num = eval(power);
            let pow = +tmp[1]
            this._expression = Math.pow(num, pow);
            power = "";
            return;
        }
        if (exp) {
            this._expression = eval(exp);
        }
    }

    back() {
        if (this._expression.length <= 1 || this._expression === '0') {
            this._expression = '0';
        } else {
            this._expression = this._expression.slice(0, -1);
        }
    }

    percent() {
        this._expression = eval(this._expression) / 100;
    }

    piNumber() {
        if (this._expression === '0') {
            this._expression = '';
        }
        this._expression += Math.PI.toFixed(8);
    }

    eNumber() {
        if (this._expression === '0') {
            this._expression = '';
        }
        this._expression += Math.E.toFixed(8);
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
        } catch (error) {
            console.error('Calculation error:', error);
            this._expression = 'Error';
        }
    }

    fact() {
        const factorial = function(n) {
            return (n !== 1) ? n * factorial(n - 1) : 1;
        };

        try {
            const value = +eval(this._expression);
            this._expression = factorial(value).toString();
        } catch (err) {
            console.error('Factorial error:', err);
            this._expression = 'Error';
        }
    }

    log(name) {
        try {
            const value = +eval(this._expression);
            let result;

            if (name === 'lg') {
                if (value <= 0) throw new Error("Log base 10 undefined for <= 0");
                result = Math.log10(value);
            } else if (name === 'ln') {
                if (value <= 0) throw new Error("Natural log undefined for <= 0");
                result = Math.log(value);
            } else {
                throw new Error(`Unknown log type: ${name}`);
            }

            this._expression = result.toFixed(8);
        } catch (error) {
            console.error('Log error:', error);
            this._expression = 'Error';
        }
    }

    toggleAngleMode() {
        this._angleMode = this._angleMode === 'deg' ? 'rad' : 'deg';
    }

    trigonometry(name) {
        try {
            let value = +eval(this._expression);

            if (this._angleMode === 'deg') {
                value = value * Math.PI / 180;
            }

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
                    if (tan === 0) throw new Error('Cotangent undefined for this value');
                    result = 1 / tan;
                    break;
                default:
                    throw new Error(`Unknown trig function: ${name}`);
            }

            this._expression = Number(result.toFixed(8)).toString();
        } catch (error) {
            console.error('Trigonometry error:', error);
            this._expression = 'Error';
        }
    }
}
